import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4FFF]">
              <span className="text-sm font-black text-white">V</span>
            </div>
            <span className="text-lg font-bold text-[#0C0D0E]">ValiSearch</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-[#52565E] hover:text-[#0C0D0E]">
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-black text-[#0C0D0E] mb-8">Privacy Policy</h1>
        <p className="text-sm text-[#52565E] mb-8">Last updated: May 2026</p>

        <div className="space-y-8 text-[#52565E] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">What We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Account information: email address and name you provide during registration</li>
              <li>Startup ideas and analysis results you submit through the platform</li>
              <li>Usage data: pages visited, features used, analysis frequency</li>
              <li>Payment information: processed securely through LemonSqueezy (we never store card details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To run your requested analyses and deliver results</li>
              <li>To improve our AI agents and analysis quality</li>
              <li>To send transactional emails (trial expiry, password reset)</li>
              <li>To provide customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Data Sharing</h2>
            <p>We do not sell your personal data. We share data only with:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>OpenRouter and Google AI — to run AI agent analysis (your ideas are sent as prompts)</li>
              <li>Supabase — for database and authentication</li>
              <li>LemonSqueezy — for payment processing</li>
              <li>PostHog — for product analytics (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Data Retention</h2>
            <p>We retain your data for as long as your account is active. You can delete your account at any time from the Settings page, which will permanently remove all your analyses, ideas, and personal information within 48 hours.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Your Rights (GDPR)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Right to access — download your data anytime</li>
              <li>Right to deletion — delete your account permanently</li>
              <li>Right to rectification — update your profile information</li>
              <li>Right to data portability — export your analyses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0C0D0E] mb-3">Contact</h2>
            <p>For privacy inquiries: privacy@valisearch.app</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#E5E7EB] bg-gray-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm text-[#52565E] sm:px-6">
          <span>&copy; {new Date().getFullYear()} ValiSearch. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-[#0C0D0E]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#0C0D0E]">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
