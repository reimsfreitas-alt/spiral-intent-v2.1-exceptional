export type ExecutionState = 'CREATED'|'AUTHORIZED'|'READY'|'EXECUTING'|'EXECUTED'|'OBSERVING'|'OBSERVED'|'VERIFYING'|'VERIFIED'|'UNKNOWN'|'RECONCILING'|'REJECTED'|'EXPIRED';

const transitions: Record<ExecutionState, readonly ExecutionState[]> = {
  CREATED:['AUTHORIZED','REJECTED'],
  AUTHORIZED:['READY','EXPIRED','REJECTED'],
  READY:['EXECUTING','EXPIRED','REJECTED'],
  EXECUTING:['EXECUTED','UNKNOWN','REJECTED'],
  EXECUTED:['OBSERVING'],
  OBSERVING:['OBSERVED','UNKNOWN','RECONCILING'],
  OBSERVED:['VERIFYING'],
  VERIFYING:['VERIFIED','RECONCILING'],
  UNKNOWN:['RECONCILING','REJECTED'],
  RECONCILING:['EXECUTED','OBSERVING','REJECTED','UNKNOWN'],
  VERIFIED:[],
  REJECTED:[],
  EXPIRED:[]
};

export function canTransition(from:ExecutionState,to:ExecutionState):boolean { return transitions[from].includes(to); }
export function transition(from:ExecutionState,to:ExecutionState):ExecutionState {
  if (!canTransition(from,to)) throw new Error(`INVALID_STATE_TRANSITION:${from}->${to}`);
  return to;
}
