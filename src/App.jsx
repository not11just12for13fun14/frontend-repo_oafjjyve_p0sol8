import Hero from './components/Hero'
import Features from './components/Features'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600" />
            <span className="font-semibold">Gym Coach</span>
          </div>
          <nav className="text-sm text-gray-600 flex items-center gap-6">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#dashboard" className="hover:text-gray-900">Dashboard</a>
            <a href="https://github.com" target="_blank" className="hover:text-gray-900">Docs</a>
          </nav>
        </div>
      </header>
      <main>
        <Hero />
        <Features />
        <Dashboard />
      </main>
      <footer className="mt-16 py-10 text-center text-sm text-gray-500">Made for trainers and ambitious clients</footer>
    </div>
  )
}

export default App
