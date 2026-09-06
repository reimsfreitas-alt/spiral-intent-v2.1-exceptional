import {verifyEffect} from './verifier';
const a={system:'stripe' as const,operation:'refund' as const,amount:50000,currency:'brl'};
const o=(amount:number,status='succeeded')=>({system:'stripe' as const,operation:'refund' as const,external_operation_id:'re_1',amount,currency:'brl',status,observed_at:'2026-09-06T00:00:00.000Z'});
test('CONFIRMED exact match',()=>expect(verifyEffect(a,o(50000)).verdict).toBe('CONFIRMED'));
test('DEVIATED amount mismatch',()=>expect(verifyEffect(a,o(5000000)).verdict).toBe('DEVIATED'));
test('INCONCLUSIVE external failure',()=>expect(verifyEffect(a,o(50000,'failed')).verdict).toBe('INCONCLUSIVE'));
test('INCONCLUSIVE scope mismatch',()=>expect(verifyEffect(a,{...o(50000),system:'stripe',operation:'charge'} as any).verdict).toBe('INCONCLUSIVE'));
test('deterministic',()=>expect(verifyEffect(a,o(5000000))).toEqual(verifyEffect(a,o(5000000))));
