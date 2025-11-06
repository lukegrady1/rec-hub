export default function ProblemSolution() {
  const problems = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Manual onboarding takes weeks',
      description: 'IT tickets, developer queues, and endless back-and-forth just to update your site.',
      solution: 'Self-serve builder—launch in 5 minutes'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Dated sites that don\'t work on mobile',
      description: 'Residents expect modern experiences. Your current site doesn\'t deliver.',
      solution: 'Mobile-first templates that look professional'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Messy facility booking process',
      description: 'Phone calls, spreadsheets, and double-bookings waste staff time.',
      solution: 'Visual slot calendar with request-to-book'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Constant phone tag with residents',
      description: 'Staff spend hours answering the same questions and sending status updates.',
      solution: 'Automated email notifications for bookings'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Stop fighting outdated tools
          </h2>
          <p className="text-lg text-slate-600">
            Recreation departments deserve modern software. Here's how we solve your biggest headaches.
          </p>
        </div>

        {/* Problem-Solution cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {problems.map((item, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-8 hover:border-brand-primary hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              {/* Problem */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-600 mb-6">
                {item.description}
              </p>

              {/* Solution */}
              <div className="flex items-start gap-3 pt-6 border-t-2 border-slate-100">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-700 mb-1">Solution</div>
                  <div className="text-sm text-slate-700 font-medium">
                    {item.solution}
                  </div>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-16">
          <p className="text-lg text-slate-600 font-medium">
            Built specifically for recreation departments—not generic website builders.
          </p>
        </div>
      </div>
    </section>
  )
}
