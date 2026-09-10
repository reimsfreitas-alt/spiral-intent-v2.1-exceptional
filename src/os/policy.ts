import {IntentRequest,PolicyRule,OSDecision} from './types';

export interface PolicyResult { decision: OSDecision; policy_id: string; version: string; reason: string; }

export function evaluatePolicy(intent: IntentRequest, rules: readonly PolicyRule[], now = new Date()): PolicyResult {
  const rule = rules.find(r => r.action === intent.action && (!r.target_prefix || intent.target.startsWith(r.target_prefix)));
  if (!rule) return {decision:'DENY', policy_id:'default-deny', version:'1', reason:'NO_MATCHING_POLICY'};
  return {decision:rule.decision, policy_id:rule.policy_id, version:rule.version, reason: rule.decision === 'ALLOW' ? 'POLICY_MATCH' : 'POLICY_REQUIRES_REVIEW'};
}
