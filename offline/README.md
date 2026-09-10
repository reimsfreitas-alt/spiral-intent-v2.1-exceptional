# Spiral Intent Offline Verifier

This verifier is deliberately outside the Spiral runtime. It consumes an exported ECR JSON package and uses only Node.js, `canonicalize`, and the public key carried by the receipt.

## Verification contract

1. Reconstruct canonical ECR payload.
2. Verify SHA-256 canonical hash.
3. Verify Ed25519 signature.
4. Verify authorized-effect and observation hashes.
5. Recompute the deterministic verdict from authorized vs observed effect.
6. Validate the optional audit-chain package.
7. Return machine-readable proof status.

The offline verifier never calls Spiral APIs, the worker, the observer, Stripe, or a database.

`keyKnown=true` in offline mode means the receipt carries the public key required for cryptographic verification. Trust in that key's historical identity is a separate policy decision; production export packages should include the key registry metadata and historical trust policy.

## Usage

`npm run verify:offline -- ./spiral-export/ecr.json`
