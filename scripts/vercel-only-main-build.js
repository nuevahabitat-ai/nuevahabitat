#!/usr/bin/env node
/**
 * Vercel Ignored Build Step: solo construir en rama main (Production).
 * Exit 0 → cancelar build (sin Preview). Exit 1 → continuar build.
 * @see https://vercel.com/docs/project-configuration/project-configuration#ignorecommand
 */
const ref = process.env.VERCEL_GIT_COMMIT_REF || '';
if (ref === 'main') {
  process.exit(1);
}
console.log(`[vercel-only-main] Skip build for branch "${ref}" (solo Production en main).`);
process.exit(0);
