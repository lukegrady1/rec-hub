export default function Dashboard() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-brand-neutral mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
            <h3 className="text-brand-muted text-sm font-semibold">Programs</h3>
            <p className="text-3xl font-bold text-brand-neutral mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
            <h3 className="text-brand-muted text-sm font-semibold">Events</h3>
            <p className="text-3xl font-bold text-brand-neutral mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
            <h3 className="text-brand-muted text-sm font-semibold">Bookings</h3>
            <p className="text-3xl font-bold text-brand-neutral mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-border">
            <h3 className="text-brand-muted text-sm font-semibold">Facilities</h3>
            <p className="text-3xl font-bold text-brand-neutral mt-2">0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
