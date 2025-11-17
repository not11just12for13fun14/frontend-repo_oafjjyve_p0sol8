import { Activity, CalendarRange, Salad, MessageSquare, Dumbbell, BarChart3 } from "lucide-react";

export default function Features(){
  const features = [
    {icon: Dumbbell, title: "Program Builder", desc: "Design structured workouts with sets, reps, rest, and notes."},
    {icon: Salad, title: "Meal Planning", desc: "Set daily calories and macro targets, track meals with ease."},
    {icon: MessageSquare, title: "Chat", desc: "Keep conversations organized per client with read status."},
    {icon: Activity, title: "Daily Logs", desc: "Track calories, protein, weight, and progress notes."},
    {icon: BarChart3, title: "Progress", desc: "Insights on adherence, streaks, and plan consistency."},
    {icon: CalendarRange, title: "Scheduling", desc: "Weekly splits and visibility over current plans."},
  ];
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-900">Everything you need to coach at scale</h2>
      <p className="text-gray-600 mt-2">Built for trainers and high-performing clients.</p>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 text-blue-700 flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5"/>
            </div>
            <h3 className="font-semibold text-gray-900">{f.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
