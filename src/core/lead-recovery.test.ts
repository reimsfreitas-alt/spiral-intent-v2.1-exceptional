import { ingestLead, propagate, observe } from '@/core/lead-recovery';

describe('Lead Recovery vertical', () => {
  it('blocks communication without verified consent', () => {
    const intent = ingestLead({ workspaceId: 'w1', leadRef: 'l-no-consent', consent: false });
    expect(intent.status).toBe('POLICY_BLOCKED');
    expect(intent.policy?.verdict).toBe('DENY');
    expect(intent.authorization).toBeUndefined();
  });

  it('runs the governed sandbox trajectory with authorization and observation', () => {
    const intent = ingestLead({ workspaceId: 'w2', leadRef: 'l-001', consent: true });
    expect(intent.status).toBe('AUTHORIZED');
    expect(intent.authorization).toBeDefined();
    const propagated = propagate(intent.id, 'SANDBOX');
    expect(propagated.status).toBe('PROPAGATED');
    const observed = observe(intent.id, 'REPLIED');
    expect(observed.status).toBe('COMPLETED');
    expect(observed.observation).toBe('REPLIED');
  });

  it('refuses REAL mode without explicit Meta credentials', () => {
    const intent = ingestLead({ workspaceId: 'w3', leadRef: 'l-real', consent: true });
    expect(() => propagate(intent.id, 'REAL')).toThrow('REAL_MODE_CONFIGURATION_REQUIRED');
  });
});
