import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How long does setup take?',
      answer: 'Most departments complete their initial setup in under 5 minutes. You can have a professional-looking site published with your branding, programs, and events on the same day. The self-serve builder means no waiting for developers or IT tickets.'
    },
    {
      question: 'Can we use our own domain name?',
      answer: 'Yes! All plans include a subdomain (yourdept.rechub.app) that works immediately. Custom domain support (yourdept.gov) is available on Enterprise plans. We\'ll handle the technical setup and SSL certificates for you.'
    },
    {
      question: 'When will online payments be available?',
      answer: 'Online payment processing for program registrations and facility bookings is planned for Q2 2025. In the MVP, the platform supports request-to-book workflows where staff approve bookings and handle payments offline.'
    },
    {
      question: 'Can we export our data?',
      answer: 'Absolutely. You own your data. Export all programs, events, facilities, bookings, and resident information at any time in CSV or JSON format. No lock-in, no hassle.'
    },
    {
      question: 'Is the site accessible (WCAG compliant)?',
      answer: 'Yes, all sites built with Rec Hub meet WCAG AA accessibility standards. This ensures your site works for all residents, including those using screen readers or keyboard navigation. Accessibility is built-in, not optional.'
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'Starter and Pro plans include email support with response within 24 hours on business days. Enterprise plans get priority support with phone and chat access, plus a dedicated account manager to help with onboarding and custom workflows.'
    },
    {
      question: 'How secure is our data?',
      answer: 'Very secure. Your department\'s data is completely isolated from other tenants in our multi-tenant architecture. We use industry-standard encryption, regular backups, and follow SOC 2 security practices. Enterprise plans can add SSO for additional security.'
    },
    {
      question: 'Can we migrate from our current website?',
      answer: 'Yes, we can help! While the platform is designed for quick self-service setup, we offer migration assistance for departments switching from legacy systems. Contact our team to discuss your current setup and timeline.'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about Rec Hub. Can't find the answer? <a href="mailto:support@rechub.app" className="text-brand-primary hover:underline font-semibold">Email our team</a>.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden hover:border-brand-primary transition-colors duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 group"
              >
                <span className="text-lg font-semibold text-slate-900 group-hover:text-brand-primary transition-colors">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-slate-400 group-hover:text-brand-primary flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="mt-16 text-center bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 max-w-3xl mx-auto border-2 border-blue-100">
          <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-slate-600 mb-6">
            Our team is here to help you find the right solution for your department.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@rechub.app"
              className="px-6 py-3 bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold rounded-xl transition-colors duration-200"
            >
              Email support
            </a>
            <a
              href="mailto:sales@rechub.app?subject=Schedule a Demo"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200"
            >
              Schedule a demo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
