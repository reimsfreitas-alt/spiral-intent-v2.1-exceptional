import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spiral Wealth — Governed Execution Infrastructure',
  description: 'Spiral Wealth — governed execution infrastructure for intent, policy, execution, observation, verification and receipt.',
  alternates: { canonical: 'https://spiralwealth.com.br/' },
  openGraph: {
    title: 'Spiral Wealth — Governed Execution Infrastructure',
    description: 'Intenção autorizada, transformada em ação externa observável e verificável.',
    url: 'https://spiralwealth.com.br/',
    siteName: 'Spiral Codes',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  const filePath = path.join(process.cwd(), 'public', 'matrix.html')
  const html = fs.readFileSync(filePath, 'utf8')
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
