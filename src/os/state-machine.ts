import {OSState} from './types';

const transitions: Record<OSState, readonly OSState[]> = {
  RECEIVED:['POLICY_EVALUATED'],
  POLICY_EVALUATED:['AUTHORIZED','REQUIRES_APPROVAL','REJECTED'],
  AUTHORIZED:['READY'],
  REQUIRES_APPROVAL:['AUTHORIZED','REJECTED'],
  REJECTED:[],
  READY:['EXECUTING','REJECTED'],
  EXECUTING:['OBSERVING','FAILED'],
  OBSERVING:['VERIFIED','DEVIATED','CONFLICTED','INCONCLUSIVE','FAILED'],
  VERIFIED:[], DEVIATED:[], CONFLICTED:[], INCONCLUSIVE:[], FAILED:[]
};

export function canTransition(from: OSState, to: OSState): boolean { return transitions[from].includes(to); }
export function assertTransition(from: OSState, to: OSState): void {
  if (!canTransition(from,to)) throw new Error(`INVALID_STATE_TRANSITION:${from}->${to}`);
}
export function allowedTransitions(from: OSState): readonly OSState[] { return transitions[from]; }
