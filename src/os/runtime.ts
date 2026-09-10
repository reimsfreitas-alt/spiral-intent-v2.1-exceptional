import {IntentRequest,PolicyRule,OSState} from './types';
import {evaluatePolicy} from './policy';
import {issueAuthorization} from './authorization';
import {MemoryLedger} from './ledger';
import {assertTransition} from './state-machine';
import {newId} from './hash';

export class SpiralIntentOS {
  constructor(private readonly ledger = new MemoryLedger()) {}

  receive(intent: IntentRequest, rules: readonly PolicyRule[], now = new Date()) {
    this.ledger.append({tenant_id:intent.tenant_id,intent_id:intent.intent_id,state:'RECEIVED',type:'INTENT_RECEIVED',occurred_at:now.toISOString(),data:{...intent}});
    const policy=evaluatePolicy(intent,rules,now);
    assertTransition('RECEIVED','POLICY_EVALUATED');
    this.ledger.append({tenant_id:intent.tenant_id,intent_id:intent.intent_id,state:'POLICY_EVALUATED',type:'POLICY_EVALUATED',occurred_at:now.toISOString(),data:{...policy}});
    if (policy.decision !== 'ALLOW') {
      const state: OSState = policy.decision === 'DENY' ? 'REJECTED' : 'REQUIRES_APPROVAL';
      this.ledger.append({tenant_id:intent.tenant_id,intent_id:intent.intent_id,state,type:'AUTHORIZATION_DECISION',occurred_at:now.toISOString(),data:{...policy}});
      return {intent,policy,state,authorization:null};
    }
    const authorization=issueAuthorization(intent,policy,now);
    this.ledger.append({tenant_id:intent.tenant_id,intent_id:intent.intent_id,state:'AUTHORIZED',type:'AUTHORIZATION_ISSUED',occurred_at:now.toISOString(),data:{authorization_id:authorization.authorization_id,policy_id:authorization.policy_id,policy_version:authorization.policy_version,idempotency_key:authorization.idempotency_key,expires_at:authorization.expires_at,nonce:authorization.nonce}});
    return {intent,policy,state:'AUTHORIZED' as const,authorization};
  }

  ready(intentId:string, tenantId:string, authorizationId:string, now = new Date()) {
    const current=this.ledger.latestState(intentId);
    assertTransition(current ?? 'REJECTED','READY');
    this.ledger.append({tenant_id:tenantId,intent_id:intentId,state:'READY',type:'EXECUTION_READY',occurred_at:now.toISOString(),data:{authorization_id:authorizationId}});
    return {execution_id:newId(),state:'READY' as const};
  }

  events() { return this.ledger.all(); }
  verifyLedger() { return this.ledger.verify(); }
}
