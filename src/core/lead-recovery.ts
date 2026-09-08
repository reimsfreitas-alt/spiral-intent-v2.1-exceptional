import crypto from 'node:crypto';

export type PolicyVerdict = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
export type IntentStatus = 'LEAD_RECEIVED' | 'POLICY_BLOCKED' | 'PENDING_HUMAN_APPROVAL' | 'AUTHORIZED' | 'PROPAGATED' | 'OBSERVED' | 'COMPLETED';
export type ObservationStatus = 'DELIVERED' | 'READ' | 'REPLIED' | 'QUALIFIED' | 'OPPORTUNITY' | 'FAILED' | 'BLOCKED' | 'UNKNOWN';
export type ExecutionMode = 'SANDBOX' | 'REAL' | 'DRY_RUN';

export interface LeadEvent { id: string; workspaceId: string; leadRef: string; consent: boolean; source: 'META_LEAD_ADS'; receivedAt: string; }
export interface PolicyResult { verdict: PolicyVerdict; reasons: string[]; policyVersion: string; policyHash: string; }
export interface AuthorizationEnvelope { id: string; intentId: string; workspaceId: string; policyVersion: string; policyHash: string; scope: string[]; authorizedAction: 'WHATSAPP_TEMPLATE'; targetRef: string; issuedAt: string; expiresAt: string; nonce: string; signature: string; publicKey: string; }
export interface IntentRecord { id: string; workspaceId: string; lead: LeadEvent; status: IntentStatus; score: number; policy?: PolicyResult; authorization?: AuthorizationEnvelope; propagationId?: string; observation?: ObservationStatus; createdAt: string; updatedAt: string; }

const stores = globalThis as typeof globalThis & { __spiralLeadStore?: Map<string, IntentRecord> };
const store = stores.__spiralLeadStore ?? new Map<string, IntentRecord>();
stores.__spiralLeadStore = store;

function canonical(input: Omit<AuthorizationEnvelope, 'signature' | 'publicKey'>): string {
  return JSON.stringify(input, Object.keys(input).sort());
}

function keysFromEnv(): { privateKey?: crypto.KeyObject; publicKey?: crypto.KeyObject; publicKeyPem?: string } {
  const priv = process.env.INTENT_SIGNING_PRIVATE_KEY;
  const pub = process.env.INTENT_SIGNING_PUBLIC_KEY;
  if (!priv || !pub) return {};
  try {
    return { privateKey: crypto.createPrivateKey(priv), publicKey: crypto.createPublicKey(pub), publicKeyPem: pub };
  } catch { return {}; }
}

function issueAuthorization(intent: IntentRecord, policy: PolicyResult): AuthorizationEnvelope {
  const envKeys = keysFromEnv();
  const pair = envKeys.privateKey && envKeys.publicKey
    ? envKeys
    : crypto.generateKeyPairSync('ed25519');
  const publicKeyPem = envKeys.publicKeyPem ?? pair.publicKey.export({ type: 'spki', format: 'pem' }).toString();
  const issuedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 15 * 60_000).toISOString();
  const base = {
    id: `auth_${crypto.randomUUID()}`,
    intentId: intent.id,
    workspaceId: intent.workspaceId,
    policyVersion: policy.policyVersion,
    policyHash: policy.policyHash,
    scope: ['lead:read', 'whatsapp:template:lead-recovery'],
    authorizedAction: 'WHATSAPP_TEMPLATE' as const,
    targetRef: intent.lead.leadRef,
    issuedAt,
    expiresAt,
    nonce: crypto.randomBytes(24).toString('hex')
  };
  const signature = crypto.sign(null, Buffer.from(canonical(base)), pair.privateKey).toString('base64url');
  return { ...base, signature, publicKey: publicKeyPem };
}

function verifyAuthorization(auth: AuthorizationEnvelope): boolean {
  if (Date.now() >= Date.parse(auth.expiresAt)) return false;
  try {
    const { signature, publicKey, ...base } = auth;
    return crypto.verify(null, Buffer.from(canonical(base)), crypto.createPublicKey(publicKey), Buffer.from(signature, 'base64url'));
  } catch { return false; }
}

function policyFor(lead: LeadEvent): PolicyResult {
  const policyVersion = 'lead-recovery.v1';
  const reasons: string[] = [];
  if (!lead.consent) reasons.push('Communication eligibility requires verified consent.');
  const policyHash = crypto.createHash('sha256').update(`${policyVersion}|consent=${lead.consent}|action=WHATSAPP_TEMPLATE`).digest('hex');
  return { verdict: lead.consent ? 'ALLOW' : 'DENY', reasons: reasons.length ? reasons : ['Consent verified.', 'Lead Recovery template is within scope.'], policyVersion, policyHash };
}

export function ingestLead(input: { workspaceId: string; leadRef: string; consent: boolean; source?: 'META_LEAD_ADS' }): IntentRecord {
  const now = new Date().toISOString();
  const lead: LeadEvent = { id: `lead_${crypto.randomUUID()}`, workspaceId: input.workspaceId, leadRef: input.leadRef, consent: input.consent, source: input.source ?? 'META_LEAD_ADS', receivedAt: now };
  const intent: IntentRecord = { id: `intent_${crypto.randomUUID()}`, workspaceId: input.workspaceId, lead, status: 'LEAD_RECEIVED', score: input.consent ? 82 : 18, createdAt: now, updatedAt: now };
  const policy = policyFor(lead);
  intent.policy = policy;
  if (policy.verdict === 'DENY') intent.status = 'POLICY_BLOCKED';
  else {
    intent.authorization = issueAuthorization(intent, policy);
    if (!verifyAuthorization(intent.authorization)) throw new Error('AUTHORIZATION_VERIFICATION_FAILED');
    intent.status = 'AUTHORIZED';
  }
  intent.updatedAt = new Date().toISOString();
  store.set(intent.id, intent);
  return intent;
}

export function propagate(intentId: string, mode: ExecutionMode): IntentRecord {
  const intent = store.get(intentId);
  if (!intent) throw new Error('INTENT_NOT_FOUND');
  if (intent.status !== 'AUTHORIZED') throw new Error('POLICY_OR_AUTHORIZATION_REQUIRED');
  if (!intent.authorization || !verifyAuthorization(intent.authorization)) throw new Error('INVALID_OR_EXPIRED_AUTHORIZATION');
  if (mode === 'REAL' && (!process.env.META_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID)) throw new Error('REAL_MODE_CONFIGURATION_REQUIRED');
  intent.propagationId = `prop_${crypto.randomUUID()}`;
  intent.status = 'PROPAGATED';
  intent.updatedAt = new Date().toISOString();
  store.set(intent.id, intent);
  return intent;
}

export function observe(intentId: string, status: ObservationStatus): IntentRecord {
  const intent = store.get(intentId);
  if (!intent) throw new Error('INTENT_NOT_FOUND');
  intent.observation = status;
  intent.status = status === 'UNKNOWN' ? 'OBSERVED' : 'COMPLETED';
  intent.updatedAt = new Date().toISOString();
  store.set(intent.id, intent);
  return intent;
}

export function getIntent(id: string): IntentRecord | undefined { return store.get(id); }
export function summary(workspaceId: string) {
  const records = [...store.values()].filter(x => x.workspaceId === workspaceId);
  const completed = records.filter(x => x.observation === 'QUALIFIED' || x.observation === 'OPPORTUNITY').length;
  return { intents: records.length, authorized: records.filter(x => x.status !== 'POLICY_BLOCKED').length, propagated: records.filter(x => Boolean(x.propagationId)).length, qualified: completed, policyBlocks: records.filter(x => x.status === 'POLICY_BLOCKED').length, records };
}
