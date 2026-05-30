import { createFileRoute, Link } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
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
        <h1 className="text-4xl font-black text-[#0C0D0E] mb-4">About ValiSearch</h1>
        <p className="text-lg text-[#52565E] mb-12 leading-relaxed">
          Most founders waste 3-12 months building something nobody wants. ValiSearch tells you in 60 seconds whether your idea is worth pursuing — and exactly what to do next.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-[#0C0D0E] mb-4">Our Mission</h2>
            <p className="text-[#52565E] leading-relaxed">
              We believe every founder deserves access to the same quality of strategic analysis that venture capital firms use — without the $50,000 consulting fee. By running 12 specialized AI agents in parallel, we deliver comprehensive market, product, and growth analysis in under a minute.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0C0D0E] mb-4">How It Works</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { step: '1', title: 'Describe your idea', desc: 'Write a few sentences about your startup idea — the problem, target user, and solution.' },
                { step: '2', title: '12 agents analyze it', desc: 'Market sizing, competitor intel, technical feasibility, financials, and more run in parallel.' },
                { step: '3', title: 'Get your report', desc: 'An investor-grade report with scores, risks, opportunities, and a prioritized action plan.' },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-[#E5E7EB] p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B4FFF]/10 text-lg font-bold text-[#1B4FFF] mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-[#0C0D0E] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#52565E] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0C0D0E] mb-4">Why ValiSearch?</h2>
            <ul className="space-y-4">
              {[
                'Built for solo founders and early-stage teams in emerging markets',
                'Mobile-first design — works on any device',
                'Free tier available — no credit card required',
                'Real-time web research powered by Serper, Reddit, and Hacker News',
                'AI Co-founder chat to explore ideas interactively',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[#52565E]">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#1B4FFF]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
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
