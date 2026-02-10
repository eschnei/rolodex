export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary px-6 py-16">
      <div className="mx-auto max-w-page">
        {/* Header */}
        <header className="mb-12">
          <p className="type-overline mb-2">Personal Networking CRM</p>
          <h1 className="type-h1 mb-4">RoloDex</h1>
          <p className="type-body max-w-[600px] text-text-secondary">
            Manage your professional network with intention. Track
            relationships, set cadences, and never lose touch with the people
            who matter.
          </p>
        </header>

        {/* Status Card */}
        <article className="rounded-lg border border-border-subtle bg-bg-secondary shadow-sm">
          <header className="border-b border-border-subtle p-5">
            <h2 className="type-h3">Project Status</h2>
          </header>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-status-ontrack-bg px-2 py-0.5 text-[11px] font-semibold text-status-ontrack-text">
                Running
              </span>
              <span className="type-mono">Next.js 14 + TypeScript</span>
            </div>
            <p className="type-small">
              The development server is running successfully. The design system
              has been configured with all custom colors, typography, spacing,
              and component styles from the specification.
            </p>
          </div>
          <footer className="border-t border-border-subtle bg-bg-inset px-5 py-3">
            <p className="type-caption">M1-T01: Project initialization complete</p>
          </footer>
        </article>

        {/* Design System Preview */}
        <section className="mt-12">
          <h2 className="type-h2 mb-6">Design System Preview</h2>

          {/* Colors */}
          <div className="mb-8">
            <h3 className="type-overline mb-4">Status Colors</h3>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full bg-status-overdue-bg px-3 py-1 text-[11px] font-semibold text-status-overdue-text">
                Overdue
              </span>
              <span className="inline-flex items-center rounded-full bg-status-due-bg px-3 py-1 text-[11px] font-semibold text-status-due-text">
                Due Soon
              </span>
              <span className="inline-flex items-center rounded-full bg-status-ontrack-bg px-3 py-1 text-[11px] font-semibold text-status-ontrack-text">
                On Track
              </span>
              <span className="inline-flex items-center rounded-full bg-accent-subtle px-3 py-1 text-[11px] font-semibold text-accent-text">
                Accent
              </span>
            </div>
          </div>

          {/* Typography */}
          <div className="mb-8">
            <h3 className="type-overline mb-4">Typography Scale</h3>
            <div className="space-y-3 rounded-lg border border-border-subtle bg-bg-secondary p-5">
              <p className="type-h1">H1 - Page Title (28px)</p>
              <p className="type-h2">H2 - Section Header (22px)</p>
              <p className="type-h3">H3 - Card Title (17px)</p>
              <p className="type-body">Body - Primary content (14px)</p>
              <p className="type-small">Small - Secondary info (13px)</p>
              <p className="type-caption">Caption - Labels (12px)</p>
              <p className="type-mono">Mono - Timestamps (13px)</p>
              <p className="type-overline">Overline - Section labels (11px)</p>
            </div>
          </div>

          {/* Buttons Preview */}
          <div>
            <h3 className="type-overline mb-4">Interactive Elements</h3>
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-[14px] py-2 text-[13px] font-medium text-text-inverse transition-all duration-fast hover:bg-accent-hover">
                Primary Action
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-md border border-border-primary bg-bg-secondary px-[14px] py-2 text-[13px] font-medium text-text-primary transition-all duration-fast hover:bg-bg-hover">
                Secondary
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-md bg-transparent px-[14px] py-2 text-[13px] font-medium text-text-secondary transition-all duration-fast hover:bg-bg-hover hover:text-text-primary">
                Ghost
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
