import {eventHash,newId} from './hash';
import {OSEvent,OSState} from './types';

export class MemoryLedger {
  private readonly events: OSEvent[] = [];
  append(input: Omit<OSEvent,'sequence'|'event_id'|'previous_hash'|'hash'>): OSEvent {
    const previous_hash = this.events.length ? this.events[this.events.length - 1].hash : null;
    const event = {...input,sequence:this.events.length + 1,event_id:newId(),previous_hash} as Omit<OSEvent,'hash'>;
    const hash = eventHash(event);
    const committed = {...event,hash};
    this.events.push(committed);
    return committed;
  }
  all(): readonly OSEvent[] { return [...this.events]; }
  verify(): boolean {
    let previous: string | null = null;
    for (let i=0;i<this.events.length;i++) {
      const e=this.events[i];
      if (e.sequence !== i+1 || e.previous_hash !== previous) return false;
      const {hash:_,...withoutHash}=e;
      if (eventHash(withoutHash) !== e.hash) return false;
      previous=e.hash;
    }
    return true;
  }
  latestState(intentId:string): OSState | null {
    const found=[...this.events].reverse().find(e=>e.intent_id===intentId);
    return found?.state ?? null;
  }
}
