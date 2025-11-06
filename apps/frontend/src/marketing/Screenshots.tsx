export default function Screenshots() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            See it in action
          </h2>
          <p className="text-lg text-slate-600">
            A glimpse of how your recreation department site will look and feel
          </p>
        </div>

        {/* Screenshots grid */}
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Admin Page Builder */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-4 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  {/* Mock browser */}
                  <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div className="ml-4 text-xs text-slate-500 font-mono">Admin / Pages / Editor</div>
                  </div>

                  {/* Mock content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-blue-200 rounded w-1/3" />
                      <div className="flex gap-2">
                        <div className="h-8 w-20 bg-slate-200 rounded" />
                        <div className="h-8 w-20 bg-blue-500 rounded" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="col-span-1 space-y-2">
                        <div className="h-16 bg-slate-100 rounded border-2 border-dashed border-slate-300" />
                        <div className="h-16 bg-slate-100 rounded border-2 border-dashed border-slate-300" />
                        <div className="h-16 bg-slate-100 rounded border-2 border-dashed border-slate-300" />
                      </div>
                      <div className="col-span-2 space-y-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                          <div className="h-6 bg-blue-300 rounded w-3/4 mb-3" />
                          <div className="h-4 bg-blue-200 rounded w-full mb-2" />
                          <div className="h-4 bg-blue-200 rounded w-5/6" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-100 rounded-lg p-4 space-y-2">
                            <div className="h-3 bg-slate-300 rounded w-2/3" />
                            <div className="h-2 bg-slate-200 rounded w-full" />
                          </div>
                          <div className="bg-slate-100 rounded-lg p-4 space-y-2">
                            <div className="h-3 bg-slate-300 rounded w-2/3" />
                            <div className="h-2 bg-slate-200 rounded w-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                Admin Experience
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Drag-and-drop page builder
              </h3>
              <p className="text-lg text-slate-600 mb-6">
                Choose from pre-built blocks, customize content, and publish instantly. No technical skills required.
              </p>
              <ul className="space-y-3">
                {[
                  'Live preview as you build',
                  'Professional templates included',
                  'Mobile-responsive by default',
                  'One-click publish'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Facility Grid + Calendar */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                Public Site
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Beautiful facility browsing & booking
              </h3>
              <p className="text-lg text-slate-600 mb-6">
                Residents see available facilities with photos, amenities, and real-time slot availability in a clean calendar view.
              </p>
              <ul className="space-y-3">
                {[
                  'Visual slot calendar',
                  'Request booking in one click',
                  'Instant email confirmation',
                  'Mobile-friendly interface'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-2xl p-4 transform lg:rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  {/* Mock browser */}
                  <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div className="ml-4 text-xs text-slate-500 font-mono">yourdept.rechub.app/facilities</div>
                  </div>

                  {/* Mock content */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg h-32" />
                      <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg h-32" />
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200">
                      <div className="h-3 bg-slate-300 rounded w-1/2 mb-4" />
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} className="h-8 bg-slate-200 rounded" />
                        ))}
                        {Array.from({ length: 14 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-8 rounded ${i % 3 === 0 ? 'bg-emerald-100 border-2 border-emerald-400' : 'bg-slate-100'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="h-10 w-32 bg-emerald-500 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Request Flow */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl shadow-2xl p-4 transform lg:-rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                  {/* Mock email */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                    <div className="text-sm font-semibold mb-1">Booking Request Approved</div>
                    <div className="text-xs opacity-80">Community Recreation Center</div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-slate-100 rounded w-full" />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <div className="h-2 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-300 rounded w-2/3" />
                      <div className="h-2 bg-slate-200 rounded w-1/2 mt-3" />
                      <div className="h-3 bg-slate-300 rounded w-3/4" />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 h-10 bg-blue-500 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                Automated Workflow
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Email notifications for everyone
              </h3>
              <p className="text-lg text-slate-600 mb-6">
                Staff get notified of new booking requests. Residents get automatic updates when bookings are approved or declined. No manual follow-ups needed.
              </p>
              <ul className="space-y-3">
                {[
                  'Staff notified of new requests',
                  'One-click approve/decline',
                  'Residents get instant updates',
                  'Reduces phone calls by 80%'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
