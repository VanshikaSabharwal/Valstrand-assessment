export default function Header() {
  return (
    <header className="border-b border-border bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">RealtyGenie</h1>
            <p className="text-text-muted mt-1">AI-Powered Property Image Automation</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted">Automate your real estate workflow</p>
          </div>
        </div>
      </div>
    </header>
  )
}
