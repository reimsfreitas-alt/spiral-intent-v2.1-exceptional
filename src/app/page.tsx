import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spiral Intent — Independent Execution Assurance',
  description: 'Independent verification of externally observed effects against authorized effects.',
  alternates: { canonical: 'https://spiralwealth.com.br/' },
  openGraph: {
    title: 'Spiral Intent — Independent Execution Assurance',
    description: 'Proof for systems that act.',
    url: 'https://spiralwealth.com.br/',
    siteName: 'Spiral Codes',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function Page() {
  return (
    <main style={{ position: 'fixed', inset: 0 }}>
      <iframe
        src="/landing-approved.html"
        title="Spiral Intent — Independent Execution Assurance"
        style={{ width: '100%', height: '100%', border: 0 }}
        loading="eager"
      />
      <a
        href="/os.html"
        aria-label="Open Spiral Intent Operating System"
        style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 100, padding: '10px 13px', border: '1px solid #5fe0d0', borderRadius: 7, background: '#07110f', color: '#b9fff5', font: '800 10px ui-monospace, monospace', textDecoration: 'none' }}
      >
        OPEN OPERATING SYSTEM →
      </a>
    </main>
  )
}
