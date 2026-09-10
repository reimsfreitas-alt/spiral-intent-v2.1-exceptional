import {AuthorizedEffect, Execution, Observation} from './types';

export type AdapterOutcome = 'CONFIRMED' | 'REJECTED' | 'UNKNOWN';

export interface ExecutionContext {
  tenant_id: string;
  intent_id: string;
  execution_id: string;
  idempotency_key: string;
  deadline: string;
  authorization_hash: string;
}

export interface ExecutionResult {
  outcome: AdapterOutcome;
  external_operation_id?: string;
  executed_amount?: number;
  raw_reference?: string;
}

export interface ObservationContext {
  tenant_id: string;
  execution: Execution;
}

export interface EffectAdapter {
  readonly system: string;
  authorize(effect: AuthorizedEffect, context: ExecutionContext): Promise<void>;
  execute(effect: AuthorizedEffect, context: ExecutionContext): Promise<ExecutionResult>;
  observe(context: ObservationContext): Promise<Observation>;
  normalize(raw: unknown): Observation;
}

export function assertAdapterContract(adapter: Partial<EffectAdapter>): asserts adapter is EffectAdapter {
  if (!adapter || typeof adapter.system !== 'string' || typeof adapter.authorize !== 'function' || typeof adapter.execute !== 'function' || typeof adapter.observe !== 'function' || typeof adapter.normalize !== 'function') {
    throw new Error('ADAPTER_CONTRACT_INVALID');
  }
}
