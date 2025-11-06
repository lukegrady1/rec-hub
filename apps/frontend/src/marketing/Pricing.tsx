import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface PricingProps {
  showToggle?: boolean
}

export default function Pricing({ showToggle = true }: PricingProps) {
  const navigate = useNavigate()
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Starter',
      price: { monthly: 99, annual: 950 },
      description: 'Perfect for small departments getting started',
      features: [
        'Self-serve website builder',
        'Programs & events management',
        'Announcements & updates',
        'Subdomain (yourdept.rechub.app)',
        'Mobile-responsive design',
        'Basic analytics',
        'Email support'
      ],
      cta: 'Start free trial',
      highlighted: false,
      color: 'blue'
    },
    {
      name: 'Pro',
      price: { monthly: 199, annual: 1910 },
      description: 'Most popular for mid-size departments',
      features: [
        'Everything in Starter, plus:',
        'Facilities & slot management',
        'Request-to-book system',
        'Booking email notifications',
        'Media library & storage',
        'Custom branding & colors',
        'Advanced analytics',
        'Priority email support'
      ],
      cta: 'Start free trial',
      highlighted: true,
      color: 'emerald',
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'For large departments with custom needs',
      features: [
        'Everything in Pro, plus:',
        'Single Sign-On (SSO)',
        'Custom domain support',
        'Advanced role management',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Phone & chat support',
        'SLA guarantee'
      ],
      cta: 'Contact sales',
      highlighted: false,
      color: 'purple'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Choose the plan that fits your department. All plans include a 14-day free trial—no credit card required.
          </p>

          {/* Billing toggle */}
          {showToggle && (
            <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  !isAnnual
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 relative ${
                  isAnnual
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annual
                <span className="absolute -top-6 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                plan.highlighted ? 'ring-2 ring-brand-primary scale-105 md:scale-110' : 'border border-slate-200'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-bold px-4 py-2 rounded-bl-xl">
                  {plan.badge}
                </div>
              )}

              <div className="p-8">
                {/* Plan name */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  {plan.price ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-slate-900">
                          ${isAnnual ? Math.floor(plan.price.annual / 12) : plan.price.monthly}
                        </span>
                        <span className="text-slate-600">/month</span>
                      </div>
                      {isAnnual && (
                        <div className="text-sm text-slate-500 mt-2">
                          Billed ${plan.price.annual}/year
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-3xl font-bold text-slate-900">
                      Custom pricing
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    if (plan.name === 'Enterprise') {
                      window.location.href = 'mailto:sales@rechub.app?subject=Enterprise Plan Inquiry'
                    } else {
                      navigate('/auth/register')
                    }
                  }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 mb-8 ${
                    plan.highlighted
                      ? 'bg-brand-primary hover:bg-brand-primaryHover text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      {feature.startsWith('Everything in') ? (
                        <>
                          <svg className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="font-semibold text-slate-700">{feature}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-slate-700">{feature}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom accent */}
              {plan.highlighted && (
                <div className="h-1 bg-gradient-to-r from-brand-primary to-brand-accent" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="text-sm text-slate-600">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Need a custom plan? <a href="mailto:sales@rechub.app" className="text-brand-primary hover:underline font-semibold">Contact our team</a>
          </p>
        </div>
      </div>
    </section>
  )
}
