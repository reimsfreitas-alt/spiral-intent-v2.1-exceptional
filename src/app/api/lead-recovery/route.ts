import { NextResponse } from 'next/server';
import { getIntent, ingestLead, observe, propagate, summary, type ExecutionMode, type ObservationStatus } from '@/core/lead-recovery';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get('workspaceId') ?? 'demo-workspace';
  const id = url.searchParams.get('intentId');
  if (id) {
    const intent = getIntent(id);
    return intent ? NextResponse.json(intent) : NextResponse.json({ error: 'INTENT_NOT_FOUND' }, { status: 404 });
  }
  return NextResponse.json(summary(workspaceId));
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as { operation?: string; workspaceId?: string; leadRef?: string; consent?: boolean; intentId?: string; mode?: ExecutionMode; observation?: ObservationStatus };
    const workspaceId = body.workspaceId ?? 'demo-workspace';
    if (body.operation === 'ingest') {
      if (!body.leadRef || typeof body.consent !== 'boolean') return NextResponse.json({ error: 'leadRef_and_consent_required' }, { status: 400 });
      return NextResponse.json(ingestLead({ workspaceId, leadRef: body.leadRef, consent: body.consent }));
    }
    if (!body.intentId) return NextResponse.json({ error: 'intentId_required' }, { status: 400 });
    if (body.operation === 'propagate') return NextResponse.json(propagate(body.intentId, body.mode ?? 'SANDBOX'));
    if (body.operation === 'observe') return NextResponse.json(observe(body.intentId, body.observation ?? 'UNKNOWN'));
    return NextResponse.json({ error: 'unknown_operation' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'INTERNAL_ERROR';
    const status = message === 'REAL_MODE_CONFIGURATION_REQUIRED' ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
