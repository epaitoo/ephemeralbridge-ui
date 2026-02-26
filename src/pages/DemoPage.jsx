import { Zap, Upload, Clock, FileText, Shield, Link, BookOpen, LogIn } from 'lucide-react';

function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const features = [
  {
    icon: Upload,
    title: 'Drag & drop upload',
    description: 'Drop files directly onto the page. No size limits beyond what your storage allows.',
  },
  {
    icon: Clock,
    title: '24-hour auto-expiry',
    description: 'Every file and snippet is automatically deleted after 24 hours. Nothing persists.',
  },
  {
    icon: FileText,
    title: 'Text snippets',
    description: 'Paste code, notes, or any text. Syntax-highlighted and ready to share instantly.',
  },
  {
    icon: Shield,
    title: 'Cloudflare Access',
    description: 'Zero-trust authentication sits in front of the app. No account creation required.',
  },
  {
    icon: Link,
    title: 'Presigned download URLs',
    description: 'Files are served via time-limited S3 presigned URLs — never exposed directly.',
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-surface font-body">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-700" strokeWidth={2.5} />
            <span className="font-semibold text-slate-900 tracking-tight">EphemeralBridge</span>
          </div>
          <nav className="flex items-center gap-1">
            <a
              href="#features"
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
            >
              Features
            </a>
            <a
              href="https://epaitoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
            >
              Portfolio
            </a>
            <a
              href="https://github.com/epaitoo/ephemeral-bridge"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
            >
              GitHub
            </a>
            <a
              href="https://medium.com/@epaitoo/building-a-secure-ephemeral-file-sharing-service-with-go-and-cloudflare-d44a80415c97"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
            >
              Article
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-20 pb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-100 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
              <span className="text-xs font-medium text-brand-700 tracking-wide uppercase">Self-hosted</span>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
              EphemeralBridge
            </h1>
            <p className="text-xl text-brand-700 font-medium mb-6">
              Secure ephemeral file &amp; text sharing
            </p>
            <p className="text-slate-500 text-base leading-relaxed">
              A lightweight self-hosted tool for sharing files and text snippets that vanish
              automatically. Built on Go, S3, and Cloudflare Access — no accounts, no clutter,
              nothing that lingers.
            </p>
          </div>
        </section>

        {/* Demo video */}
        <section className="pb-20">
          <div className="w-full rounded-xl border border-slate-200 overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <video
              src="/demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="pb-20">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">How it works</h2>
            <span className="text-sm text-slate-400">{features.length} core features</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className={`bg-white px-6 py-6 flex gap-4${
                  i === features.length - 1 && features.length % 2 !== 0
                    ? ' md:col-span-2'
                    : ''
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-brand-700" strokeWidth={1.75} />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm mb-1">{title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="border-t border-slate-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <a
              href="/files"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <LogIn className="w-4 h-4" />
              Login to App
            </a>
            <div className="flex items-center gap-4">
              <a
                href="https://epaitoo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                Portfolio
              </a>
              <span className="text-slate-200">|</span>
              <a
                href="https://github.com/epaitoo/ephemeral-bridge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub repo
              </a>
              <span className="text-slate-200">|</span>
              <a
                href="https://medium.com/@epaitoo/building-a-secure-ephemeral-file-sharing-service-with-go-and-cloudflare-d44a80415c97"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Medium article
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-xs text-slate-400">EphemeralBridge</span>
          <span className="text-xs text-slate-400">Files expire after 24 hours</span>
        </div>
      </footer>
    </div>
  );
}
