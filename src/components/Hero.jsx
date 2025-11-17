import { Dumbbell, MessageSquare, Salad, FlameKindling } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600 opacity-10" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              Coach, connect, and transform results
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              A modern platform for trainers and clients to build programs, plan meals, chat, and track daily progress.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#dashboard" className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:shadow-md transition">Launch Dashboard</a>
              <a href="#features" className="px-5 py-3 rounded-lg bg-white text-gray-800 font-semibold border hover:bg-gray-50 transition">Explore Features</a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Dumbbell className="w-5 h-5 text-blue-600"/> Program Builder</div>
              <div className="flex items-center gap-2"><Salad className="w-5 h-5 text-green-600"/> Meal Planning</div>
              <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-600"/> Real-time Chat</div>
              <div className="flex items-center gap-2"><FlameKindling className="w-5 h-5 text-orange-600"/> Calorie Tracking</div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-indigo-500 blur-3xl opacity-20" />
            <div className="rounded-2xl border bg-white/70 backdrop-blur shadow-xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
                  <h3 className="font-semibold">Weekly Split</h3>
                  <p className="text-sm text-gray-600">Push • Pull • Legs</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <h3 className="font-semibold">Calories</h3>
                  <p className="text-sm text-gray-600">2,300 target</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
                  <h3 className="font-semibold">Protein</h3>
                  <p className="text-sm text-gray-600">170g / day</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50">
                  <h3 className="font-semibold">Chat</h3>
                  <p className="text-sm text-gray-600">Stay aligned daily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
