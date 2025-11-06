import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MarketingHeader from './MarketingHeader'
import Pricing from './Pricing'
import FAQ from './FAQ'
import MarketingFooter from './MarketingFooter'

export default function PricingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Set page title and meta description
    document.title = 'Pricing - RecHub'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Simple, transparent pricing for recreation departments. Start with a 14-day free trial. Plans start at $99/month.')
    }

    // Scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <main>
        {/* Hero section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full text-brand-primary font-semibold text-sm mb-6">
              Transparent pricing
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 max-w-4xl mx-auto">
              Choose the plan that fits your department
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              All plans include a 14-day free trial with full access to features. No credit card required to start.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Money-back guarantee</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing section */}
        <Pricing showToggle={true} />

        {/* Comparison table */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Compare plans
              </h2>
              <p className="text-lg text-slate-600">
                Detailed feature comparison to help you choose the right plan
              </p>
            </div>

            <div className="max-w-5xl mx-auto overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <thead className="bg-slate-100 border-b-2 border-slate-200">
                  <tr>
                    <th className="text-left p-6 font-bold text-slate-900">Features</th>
                    <th className="text-center p-6 font-bold text-slate-900">Starter</th>
                    <th className="text-center p-6 font-bold text-slate-900 bg-blue-50">Pro</th>
                    <th className="text-center p-6 font-bold text-slate-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { feature: 'Website builder', starter: true, pro: true, enterprise: true },
                    { feature: 'Programs & events', starter: true, pro: true, enterprise: true },
                    { feature: 'Announcements', starter: true, pro: true, enterprise: true },
                    { feature: 'Subdomain', starter: true, pro: true, enterprise: true },
                    { feature: 'Mobile responsive', starter: true, pro: true, enterprise: true },
                    { feature: 'Facilities management', starter: false, pro: true, enterprise: true },
                    { feature: 'Booking system', starter: false, pro: true, enterprise: true },
                    { feature: 'Email notifications', starter: false, pro: true, enterprise: true },
                    { feature: 'Media library', starter: false, pro: true, enterprise: true },
                    { feature: 'Custom branding', starter: false, pro: true, enterprise: true },
                    { feature: 'Advanced analytics', starter: false, pro: true, enterprise: true },
                    { feature: 'Custom domain', starter: false, pro: false, enterprise: true },
                    { feature: 'SSO / SAML', starter: false, pro: false, enterprise: true },
                    { feature: 'API access', starter: false, pro: false, enterprise: true },
                    { feature: 'Dedicated support', starter: false, pro: false, enterprise: true }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-700 font-medium">{row.feature}</td>
                      <td className="p-4 text-center">
                        {row.starter ? (
                          <svg className="w-5 h-5 text-emerald-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </td>
                      <td className="p-4 text-center bg-blue-50/50">
                        {row.pro ? (
                          <svg className="w-5 h-5 text-emerald-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.enterprise ? (
                          <svg className="w-5 h-5 text-emerald-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-slate-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/auth/register')}
                className="px-8 py-4 bg-brand-primary hover:bg-brand-primaryHover text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Start your free trial
              </button>
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <FAQ />
      </main>

      <MarketingFooter />
    </div>
  )
}
