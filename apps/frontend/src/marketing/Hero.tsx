import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white pt-20 pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge row */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 font-medium mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Multitenant</span>
              <span className="text-blue-300">•</span>
              <span>Mobile-first</span>
              <span className="text-blue-300">•</span>
              <span>Bookings built-in</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Launch a modern Rec Department website{' '}
              <span className="text-brand-primary">in minutes.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              A self-serve platform for programs, events, facilities, and bookings—no IT tickets, no waiting.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/auth/register')}
                className="px-8 py-4 bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Get started — it's free to try
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-200"
              >
                View pricing
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>5 minute setup</span>
              </div>
            </div>
          </div>

          {/* Right column - Hero image/mockup */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl shadow-2xl p-8 transform lg:rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Mock UI - Header */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">yourdept.rechub.app</div>
                </div>

                {/* Mock UI - Content */}
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-blue-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-5/6" />

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 space-y-2">
                      <div className="h-3 bg-blue-300 rounded w-2/3" />
                      <div className="h-2 bg-blue-200 rounded w-full" />
                      <div className="h-2 bg-blue-200 rounded w-4/5" />
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 space-y-2">
                      <div className="h-3 bg-emerald-300 rounded w-2/3" />
                      <div className="h-2 bg-emerald-200 rounded w-full" />
                      <div className="h-2 bg-emerald-200 rounded w-4/5" />
                    </div>
                  </div>

                  <div className="mt-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-300 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-300 rounded w-3/4" />
                        <div className="h-2 bg-slate-200 rounded w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl px-6 py-4 border-2 border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Live in 5 minutes</div>
                  <div className="text-xs text-slate-500">No developer needed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
