import {SpiralIntentOS} from './runtime';
import {canTransition} from './state-machine';
import {evaluatePolicy} from './policy';
import {issueAuthorization,verifyAuthorization} from './authorization';
import {IntentRequest} from './types';

const intent: IntentRequest={intent_id:'i-001',tenant_id:'t-001',actor_id:'agent-001',action:'refund',target:'stripe:customer:cus_123',payload_ref:'refund:001',correlation_id:'c-001',created_at:'2026-09-09T00:00:00.000Z'};
const rules=[{policy_id:'refunds',version:'1.0.0',action:'refund',target_prefix:'stripe:customer:',decision:'ALLOW' as const}];

describe('Spiral Intent OS kernel',()=>{
  test('enforces the canonical state graph',()=>{
    expect(canTransition('RECEIVED','POLICY_EVALUATED')).toBe(true);
    expect(canTransition('EXECUTING','AUTHORIZED')).toBe(false);
    expect(canTransition('VERIFIED','EXECUTING')).toBe(false);
  });

  test('defaults to deny when no policy matches',()=>{
    expect(evaluatePolicy({...intent,action:'delete'},rules).decision).toBe('DENY');
  });

  test('binds authorization to tenant, intent, action, target and idempotency',()=>{
    const policy=evaluatePolicy(intent,rules);
    const auth=issueAuthorization(intent,policy,new Date('2026-09-09T00:00:00.000Z'));
    expect(auth.idempotency_key).toHaveLength(64);
    expect(()=>verifyAuthorization(auth,{...intent,target:'stripe:customer:other'},new Date('2026-09-09T00:01:00.000Z'))).toThrow('AUTHORIZATION_SCOPE_MISMATCH');
    expect(()=>verifyAuthorization(auth,intent,new Date('2026-09-09T00:06:00.000Z'))).toThrow('AUTHORIZATION_EXPIRED');
  });

  test('records a hash-chained lifecycle and never skips policy',()=>{
    const os=new SpiralIntentOS();
    const result=os.receive(intent,rules,new Date('2026-09-09T00:00:00.000Z'));
    expect(result.state).toBe('AUTHORIZED');
    expect(os.events().map(e=>e.state)).toEqual(['RECEIVED','POLICY_EVALUATED','AUTHORIZED']);
    expect(os.verifyLedger()).toBe(true);
    expect(os.ready(intent.intent_id,intent.tenant_id,result.authorization!.authorization_id).state).toBe('READY');
    expect(os.verifyLedger()).toBe(true);
  });
});
