import { redirect } from 'next/navigation'

/**
 * Canonical OS entrypoint.
 * Keep the operating system as a top-level navigation surface rather than
 * embedding it in the institutional landing page. The static OS is currently
 * a read-only/demo surface; production data boundaries remain server-side.
 */
export default function OperatingSystemPage() {
  redirect('/os.html')
}
