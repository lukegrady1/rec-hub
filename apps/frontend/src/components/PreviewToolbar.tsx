import { Monitor, Tablet, Smartphone, ArrowLeft, Rocket } from "lucide-react";

interface PreviewToolbarProps {
  deviceMode: "desktop" | "tablet" | "mobile";
  onDeviceChange: (device: "desktop" | "tablet" | "mobile") => void;
  onReturnToBuilder: () => void;
  onPublish: () => void;
  hasChanges?: boolean;
}

export default function PreviewToolbar({
  deviceMode,
  onDeviceChange,
  onReturnToBuilder,
  onPublish,
  hasChanges = false,
}: PreviewToolbarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-brand-border shadow-md z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Return button */}
        <button
          onClick={onReturnToBuilder}
          className="flex items-center gap-2 px-4 py-2 text-brand-neutral hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Return to Builder</span>
        </button>

        {/* Center: Device toggles */}
        <div className="flex items-center gap-2 bg-brand-bg rounded-lg p-1">
          <button
            onClick={() => onDeviceChange("desktop")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              deviceMode === "desktop"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-brand-muted hover:text-brand-neutral"
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium">Desktop</span>
          </button>
          <button
            onClick={() => onDeviceChange("tablet")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              deviceMode === "tablet"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-brand-muted hover:text-brand-neutral"
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
            <span className="text-sm font-medium">Tablet</span>
          </button>
          <button
            onClick={() => onDeviceChange("mobile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              deviceMode === "mobile"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-brand-muted hover:text-brand-neutral"
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-medium">Mobile</span>
          </button>
        </div>

        {/* Right: Publish button */}
        <button
          onClick={onPublish}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-colors ${
            hasChanges
              ? "bg-brand-primary text-white hover:bg-brand-primaryHover shadow-lg"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>Publish Changes</span>
        </button>
      </div>
    </div>
  );
}
