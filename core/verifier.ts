import {AuthorizedEffect, Observation, VerificationResult} from './types';

const base = (system:boolean, operation:boolean, amount:boolean, currency:boolean, status:boolean, trace:string[]):VerificationResult => ({
  verdict:'INCONCLUSIVE', reason:'', invariants:{system,operation,amount,currency,status}, trace
});

export function verifyEffect(a:AuthorizedEffect, observations:Observation[]):VerificationResult {
  if (!observations?.length) return {...base(false,false,false,false,false,['NO_OBSERVATION']), reason:'NO_OBSERVATION'};
  const system=observations.every(o=>o.system===a.system);
  const operation=observations.every(o=>o.operation===a.operation);
  const statusValues=[...new Set(observations.map(o=>String(o.status).toLowerCase()))];
  const amounts=[...new Set(observations.map(o=>o.amount))];
  const currencies=[...new Set(observations.map(o=>String(o.currency).toLowerCase()))];
  const status=statusValues.length===1 && statusValues[0]==='succeeded';
  const amount=amounts.length===1 && amounts[0]===a.amount;
  const currency=currencies.length===1 && currencies[0]===a.currency.toLowerCase();
  const trace=[
    `OBSERVER_COUNT=${observations.length}`,
    `SYSTEM=${system}`,
    `OPERATION=${operation}`,
    `STATUS_VALUES=${statusValues.join(',')}`,
    `OBSERVED_AMOUNTS=${amounts.join(',')}`,
    `OBSERVED_CURRENCIES=${currencies.join(',')}`,
    `AUTHORIZED_AMOUNT=${a.amount}`,
    `AUTHORIZED_CURRENCY=${a.currency.toLowerCase()}`
  ];
  const result=base(system,operation,amount,currency,status,trace);
  if (!system || !operation) return {...result, reason:'SCOPE_MISMATCH'};
  if (statusValues.length>1 || amounts.length>1 || currencies.length>1) return {...result, verdict:'CONFLICTED', reason:'OBSERVER_DISAGREEMENT'};
  if (!status) return {...result, reason:'EXTERNAL_STATUS_NOT_SUCCEEDED'};
  if (amount && currency) return {...result, verdict:'CONFIRMED', reason:'EXACT_EFFECT_MATCH'};
  return {...result, verdict:'DEVIATED', reason:'AUTHORIZED_EFFECT_DOES_NOT_MATCH_OBSERVED_EFFECT'};
}

export function verifySingleEffect(a:AuthorizedEffect, o:Observation):VerificationResult { return verifyEffect(a,[o]); }
