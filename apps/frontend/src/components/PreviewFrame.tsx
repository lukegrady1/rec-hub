import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

interface PreviewFrameProps {
  deviceMode: "desktop" | "tablet" | "mobile";
  config: any;
  previewData: any;
}

// Simple public site components for preview
function PublicNav({ config }: { config: any }) {
  return (
    <nav className="bg-brand-primary text-white py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold">Rec Hub</div>
        <div className="flex gap-6">
          <a href="#/preview" className="hover:text-brand-ring transition-colors">
            Home
          </a>
          {config?.enabledPages?.programs && (
            <a
              href="#/preview/programs"
              className="hover:text-brand-ring transition-colors"
            >
              Programs
            </a>
          )}
          {config?.enabledPages?.events && (
            <a
              href="#/preview/events"
              className="hover:text-brand-ring transition-colors"
            >
              Events
            </a>
          )}
          {config?.enabledPages?.facilities && (
            <a
              href="#/preview/facilities"
              className="hover:text-brand-ring transition-colors"
            >
              Facilities
            </a>
          )}
          {config?.enabledPages?.contact && (
            <a
              href="#/preview/contact"
              className="hover:text-brand-ring transition-colors"
            >
              Contact
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ hero }: { hero: any }) {
  return (
    <div
      className="relative bg-gradient-to-br from-blue-600 to-brand-primary text-white py-24 px-6"
      style={
        hero?.backgroundImage
          ? { backgroundImage: `url(${hero.backgroundImage})`, backgroundSize: "cover" }
          : {}
      }
    >
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-display font-extrabold mb-4">
          {hero?.headline || "Welcome to Our Recreation Department"}
        </h1>
        <p className="text-xl mb-8 opacity-90">
          {hero?.subheadline || "Discover programs, events, and facilities"}
        </p>
        <a
          href={hero?.ctaLink || "#"}
          className="inline-block bg-white text-brand-primary font-bold px-8 py-3 rounded-xl hover:bg-brand-ring transition-colors"
        >
          {hero?.ctaText || "Get Started"}
        </a>
      </div>
    </div>
  );
}

function PreviewHome({ config, data }: { config: any; data: any }) {
  return (
    <div className="bg-white min-h-screen">
      <PublicNav config={config} />
      <HeroSection hero={config?.hero} />

      {/* Programs Section */}
      {config?.enabledPages?.programs && data?.programs?.length > 0 && (
        <section className="py-16 px-6 bg-brand-bg">
          <div className="container mx-auto">
            <h2 className="text-3xl font-display font-bold text-brand-neutral mb-8">
              Featured Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.programs.slice(0, 3).map((program: any) => (
                <div
                  key={program.id}
                  className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-brand-neutral mb-2">
                    {program.title}
                  </h3>
                  <p className="text-brand-muted text-sm mb-4 line-clamp-3">
                    {program.description}
                  </p>
                  {program.price_cents > 0 && (
                    <p className="text-brand-primary font-semibold">
                      ${(program.price_cents / 100).toFixed(2)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      {config?.enabledPages?.events && data?.events?.length > 0 && (
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-display font-bold text-brand-neutral mb-8">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.events.slice(0, 3).map((event: any) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-brand-neutral mb-2">
                    {event.title}
                  </h3>
                  <p className="text-brand-muted text-sm mb-2">
                    {event.location || "TBD"}
                  </p>
                  <p className="text-sm text-brand-muted">
                    {new Date(event.starts_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function PreviewPrograms({ data }: { data: any }) {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-display font-extrabold text-brand-neutral mb-8">
            Programs
          </h1>
          {data?.programs?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.programs.map((program: any) => (
                <div
                  key={program.id}
                  className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-brand-neutral mb-2">
                    {program.title}
                  </h3>
                  <p className="text-brand-muted text-sm mb-4">
                    {program.description}
                  </p>
                  {program.season && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {program.season}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-brand-muted mb-4">No programs available yet.</p>
              <p className="text-sm text-brand-muted">
                Add programs in the admin panel to see them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewEvents({ data }: { data: any }) {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-display font-extrabold text-brand-neutral mb-8">
            Events
          </h1>
          {data?.events?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.events.map((event: any) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-brand-neutral mb-2">
                    {event.title}
                  </h3>
                  <p className="text-brand-muted text-sm mb-2">
                    {event.location || "TBD"}
                  </p>
                  <p className="text-sm text-brand-muted mb-4">
                    {new Date(event.starts_at).toLocaleDateString()} -{" "}
                    {new Date(event.ends_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-brand-muted line-clamp-2">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-brand-muted mb-4">No events available yet.</p>
              <p className="text-sm text-brand-muted">
                Add events in the admin panel to see them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewFacilities({ data }: { data: any }) {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-display font-extrabold text-brand-neutral mb-8">
            Facilities
          </h1>
          {data?.facilities?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.facilities.map((facility: any) => (
                <div
                  key={facility.id}
                  className="bg-white rounded-2xl border border-brand-border p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-brand-neutral mb-2">
                    {facility.name}
                  </h3>
                  <p className="text-brand-muted text-sm mb-2">
                    Type: {facility.type}
                  </p>
                  {facility.address && (
                    <p className="text-sm text-brand-muted">{facility.address}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-brand-muted mb-4">No facilities available yet.</p>
              <p className="text-sm text-brand-muted">
                Add facilities in the admin panel to see them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewContact() {
  return (
    <div className="bg-white min-h-screen">
      <div className="py-16 px-6">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-4xl font-display font-extrabold text-brand-neutral mb-8">
            Contact Us
          </h1>
          <div className="bg-white rounded-2xl border border-brand-border p-8">
            <p className="text-brand-muted mb-6">
              Get in touch with our recreation department.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-brand-neutral mb-2">Phone</h3>
                <p className="text-brand-muted">(555) 123-4567</p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-neutral mb-2">Email</h3>
                <p className="text-brand-muted">info@recre ation.example.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-neutral mb-2">Address</h3>
                <p className="text-brand-muted">
                  123 Recreation Way
                  <br />
                  Anytown, ST 12345
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewFrame({
  deviceMode,
  config,
  previewData,
}: PreviewFrameProps) {
  const [currentPath, setCurrentPath] = useState("/preview");

  // Device width mapping
  const widthMap = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  useEffect(() => {
    // Listen for hash changes to handle navigation
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (hash.startsWith("/preview")) {
        setCurrentPath(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderRoute = () => {
    if (currentPath === "/preview" || currentPath === "/preview/") {
      return <PreviewHome config={config} data={previewData} />;
    } else if (currentPath === "/preview/programs") {
      return <PreviewPrograms data={previewData} />;
    } else if (currentPath === "/preview/events") {
      return <PreviewEvents data={previewData} />;
    } else if (currentPath === "/preview/facilities") {
      return <PreviewFacilities data={previewData} />;
    } else if (currentPath === "/preview/contact") {
      return <PreviewContact />;
    }
    return <PreviewHome config={config} data={previewData} />;
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen p-8">
      <div
        className="bg-white shadow-2xl overflow-auto"
        style={{
          width: widthMap[deviceMode],
          maxWidth: "100%",
          height: "calc(100vh - 120px)",
          border: deviceMode === "mobile" ? "8px solid #333" : "none",
          borderRadius: deviceMode === "mobile" ? "24px" : "8px",
        }}
      >
        {renderRoute()}
      </div>
    </div>
  );
}
