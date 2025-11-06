import { useNavigate } from 'react-router-dom'

export default function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-gradient-to-br from-brand-primary via-blue-600 to-emerald-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white,transparent)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-8">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Join recreation departments modernizing their operations</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Create your site in{' '}
            <span className="relative">
              <span className="relative z-10">under 5 minutes</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C60 3 140 3 198 10" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              </svg>
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            No credit card required. No IT tickets. No waiting. Start your 14-day free trial and have a professional site live today.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/auth/register')}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-brand-primary font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 text-lg"
            >
              Get started — it's free to try
            </button>
            <a
              href="mailto:sales@rechub.app?subject=Book a Demo"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-200 text-lg"
            >
              Book a demo
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Cancel anytime</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t-2 border-white/20 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-white mb-2">5min</div>
              <div className="text-sm text-blue-100">Average setup time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">80%</div>
              <div className="text-sm text-blue-100">Reduction in phone calls</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-sm text-blue-100">Data ownership</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
