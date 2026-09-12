import { describe, expect, it } from 'vitest'

import { scanTemplateDemoArtifacts } from '../../scripts/assert-template-clean.mjs'

describe('template provenance and cleanup', () => {
  it('contains no template demo identity or records', async () => {
    expect(await scanTemplateDemoArtifacts(process.cwd())).toEqual([])
  })
})
