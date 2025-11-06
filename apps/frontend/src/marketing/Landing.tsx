import { useEffect } from 'react'
import MarketingHeader from './MarketingHeader'
import Hero from './Hero'
import ProblemSolution from './ProblemSolution'
import Features from './Features'
import Screenshots from './Screenshots'
import Pricing from './Pricing'
import FAQ from './FAQ'
import FinalCTA from './FinalCTA'
import MarketingFooter from './MarketingFooter'

export default function Landing() {
  useEffect(() => {
    // Set page title and meta description
    document.title = 'RecHub - Modern Recreation Department Website Builder'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Launch a modern recreation department website in minutes. Self-serve builder for programs, events, facilities, and bookings. No IT tickets required.')
    }

    // Scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <main>
        <Hero />

        <div id="features">
          <ProblemSolution />
          <Features />
        </div>

        <Screenshots />

        <div id="pricing">
          <Pricing showToggle={false} />
        </div>

        <div id="faq">
          <FAQ />
        </div>

        <FinalCTA />
      </main>

      <MarketingFooter />
    </div>
  )
}
