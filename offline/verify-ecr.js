#!/usr/bin/env node
'use strict';

const fs = require('fs');
const crypto = require('crypto');
const canonicalize = require('canonicalize');

function jcs(value) {
  const out = canonicalize(value);
  if (typeof out !== 'string') throw new Error('JCS_CANONICALIZATION_FAILED');
  return out;
}
function sha256(value) { return crypto.createHash('sha256').update(value, 'utf8').digest('hex'); }
function publicKey(hex) { return crypto.createPublicKey({key: Buffer.from(hex, 'hex'), format: 'der', type: 'spki'}); }
function verifySignature(ecr) {
  const {signature, public_key_hex, ...payload} = ecr;
  if (!signature || !public_key_hex) return false;
  return crypto.verify(null, Buffer.from(jcs(payload)), publicKey(public_key_hex), Buffer.from(signature, 'base64url'));
}
function verifyCanonicalHash(ecr) {
  if (!ecr.hashes || !ecr.hashes.canonical_sha256) return false;
  const {signature, public_key_hex, ...payload} = ecr;
  const canonical = {...payload, public_key_hex, hashes: {...payload.hashes, canonical_sha256: ''}};
  return sha256(jcs(canonical)) === ecr.hashes.canonical_sha256;
}
function verifyEffect(ecr) {
  const a = ecr.authorized_effect;
  const os = ecr.observations || [];
  if (!a || os.length === 0) return {verdict: 'INCONCLUSIVE', reason: 'NO_OBSERVATION'};
  const systems = new Set(os.map(o => o.system));
  const operations = new Set(os.map(o => o.operation));
  const amounts = new Set(os.map(o => o.amount));
  const currencies = new Set(os.map(o => String(o.currency).toLowerCase()));
  const system = systems.size === 1 && systems.has(a.system);
  const operation = operations.size === 1 && operations.has(a.operation);
  const status = os.every(o => o.status === 'succeeded');
  if (!system || !operation) return {verdict:'INCONCLUSIVE', reason:'SCOPE_MISMATCH'};
  if (!status) return {verdict:'INCONCLUSIVE', reason:'EXTERNAL_STATUS_NOT_SUCCEEDED'};
  if (amounts.size > 1 || currencies.size > 1) return {verdict:'CONFLICTED', reason:'OBSERVER_DISAGREEMENT'};
  if ([...amounts][0] === a.amount && [...currencies][0] === String(a.currency).toLowerCase()) return {verdict:'CONFIRMED', reason:'EXACT_EFFECT_MATCH'};
  return {verdict:'DEVIATED', reason:'AUTHORIZED_EFFECT_DOES_NOT_MATCH_OBSERVED_EFFECT'};
}
function verifyHashes(ecr) {
  return !!ecr.hashes &&
    sha256(jcs(ecr.authorized_effect)) === ecr.hashes.authorized_effect_sha256 &&
    sha256(jcs(ecr.observations || [])) === ecr.hashes.observed_effect_sha256;
}
function verifyChain(chain) {
  if (!chain) return {present:false, valid:true};
  if (!Array.isArray(chain) || chain.length === 0) return {present:true, valid:false};
  let previous = '';
  for (const event of chain) {
    if (event.previous_hash !== previous) return {present:true, valid:false};
    const {event_hash, ...body} = event;
    if (typeof event_hash !== 'string' || sha256(previous + jcs(body)) !== event_hash) return {present:true, valid:false};
    previous = event_hash;
  }
  return {present:true, valid:true, root_hash:previous};
}
function verify(ecr) {
  const signatureValid = verifySignature(ecr);
  const hashValid = verifyCanonicalHash(ecr);
  const componentHashesValid = verifyHashes(ecr);
  const deterministic = verifyEffect(ecr);
  const declared = ecr.verification;
  const verdictValid = !!declared && jcs(declared) === jcs(deterministic);
  const chain = verifyChain(ecr.audit_chain);
  const keyKnown = true; // Offline package trusts the public key explicitly carried by the receipt.
  const trustPolicy = ecr.issuer?.key_id ? true : false;
  return {
    signatureValid,
    keyKnown,
    trustPolicy,
    chainValid: chain.valid,
    verdict: deterministic.verdict,
    verdictValid,
    componentHashesValid,
    canonicalHashValid: hashValid,
    valid: signatureValid && hashValid && componentHashesValid && verdictValid && chain.valid && trustPolicy,
    ledger_root_hash: ecr.ledger_root_hash || chain.root_hash || null
  };
}

function main() {
  const file = process.argv[2];
  if (!file) { console.error('Usage: npm run verify:offline -- path/to/ecr.json'); process.exit(2); }
  const ecr = JSON.parse(fs.readFileSync(file, 'utf8'));
  const result = verify(ecr);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.valid ? 0 : 1);
}

if (require.main === module) main();
module.exports = {verify, verifyEffect, verifyChain};
