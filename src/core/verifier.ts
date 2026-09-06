import {AuthorizedEffect,ObservedEffect,VerificationResult} from './types';
export function verifyEffect(a:AuthorizedEffect,o:ObservedEffect):VerificationResult{
 const system=a.system===o.system, operation=a.operation===o.operation, amount=a.amount===o.amount, currency=a.currency.toLowerCase()===o.currency.toLowerCase(), status=['succeeded','pending'].includes(o.status);
 if(!system||!operation) return {verdict:'INCONCLUSIVE',reason:'SCOPE_MISMATCH',invariants:{system,operation,amount,currency,status}};
 if(!status) return {verdict:'INCONCLUSIVE',reason:`EXTERNAL_STATUS_${o.status.toUpperCase()}`,invariants:{system,operation,amount,currency,status}};
 if(amount&&currency) return {verdict:'CONFIRMED',reason:'EXACT_EFFECT_MATCH',invariants:{system,operation,amount,currency,status}};
 return {verdict:'DEVIATED',reason:'AUTHORIZED_EFFECT_DOES_NOT_MATCH_OBSERVED_EFFECT',invariants:{system,operation,amount,currency,status}};
}
