import {Observation} from './types';

export type ObservationMode = 'api_polling' | 'webhook' | 'reconciliation';

export interface ObservationRequest {
  mode: ObservationMode;
  tenant_id: string;
  execution_id: string;
  external_operation_id: string;
  requested_at: string;
}

export interface ObservationEnvelope {
  request: ObservationRequest;
  observation: Observation;
  evidence_hash: string;
}

export function assertObservationSource(observation: Observation): void {
  if (!observation.observer_id) throw new Error('OBSERVER_ID_REQUIRED');
  if (!observation.source?.kind || !observation.source?.locator) throw new Error('OBSERVATION_SOURCE_REQUIRED');
  if (!observation.independence_vector?.length) throw new Error('OBSERVATION_INDEPENDENCE_METADATA_REQUIRED');
}

export function selectObservationMode(providerSupportsWebhook: boolean, scheduledReconciliation: boolean): ObservationMode {
  if (providerSupportsWebhook) return 'webhook';
  if (scheduledReconciliation) return 'reconciliation';
  return 'api_polling';
}
