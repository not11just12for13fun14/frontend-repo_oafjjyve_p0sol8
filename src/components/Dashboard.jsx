import { useEffect, useMemo, useState } from "react";
import { Plus, SendHorizonal, Dumbbell, Salad } from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function Dashboard(){
  const [role, setRole] = useState("trainer");
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [logs, setLogs] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);

  // bootstrap: create a sample trainer and client if not exists
  useEffect(() => {
    const boot = async () => {
      const res = await fetch(`${API}/api/users`).then(r=>r.json());
      if (!res.find(u=>u.email==="trainer@example.com")){
        await fetch(`${API}/api/users`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:"Coach Mike", email:"trainer@example.com", role:"trainer"})});
      }
      if (!res.find(u=>u.email==="client@example.com")){
        await fetch(`${API}/api/users`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:"Sarah", email:"client@example.com", role:"client"})});
      }
      const all = await fetch(`${API}/api/users`).then(r=>r.json());
      const trainer = all.find(u=>u.email==="trainer@example.com");
      const client = all.find(u=>u.email==="client@example.com");
      // connect them
      if (client && trainer && (!client.trainer_id || client.trainer_id!==trainer.id)){
        const url = new URL(`${API}/api/connect`);
        url.searchParams.set("trainer_id", trainer.id);
        url.searchParams.set("client_email", client.email);
        await fetch(url);
      }
      setUsers(all);
      setMe(trainer);
      setSelectedClient(client);
    };
    boot();
  }, []);

  const conversationId = useMemo(()=> me && selectedClient ? `${me.id}_${selectedClient.id}` : "", [me, selectedClient]);

  const refreshChatAndLogs = async (clientId, convId) => {
    if (!clientId || !convId) return;
    const msgs = await fetch(`${API}/api/messages?conversation_id=${convId}`).then(r=>r.json());
    setMessages(msgs.reverse());
    const l = await fetch(`${API}/api/logs?client_id=${clientId}`).then(r=>r.json());
    setLogs(l);
  };

  const refreshPlans = async (trainerId, clientId) => {
    if (!trainerId || !clientId) return;
    const w = await fetch(`${API}/api/workout-plans?trainer_id=${trainerId}&client_id=${clientId}&active=true`).then(r=>r.json());
    setWorkoutPlans(w);
    const m = await fetch(`${API}/api/meal-plans?trainer_id=${trainerId}&client_id=${clientId}&active=true`).then(r=>r.json());
    setMealPlans(m);
  };

  useEffect(()=>{
    const load = async () => {
      if (!conversationId || !selectedClient || !me) return;
      await refreshChatAndLogs(selectedClient.id, conversationId);
      await refreshPlans(me.id, selectedClient.id);
    };
    load();
  }, [conversationId, selectedClient, me]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !conversationId || !me) return;
    await fetch(`${API}/api/messages`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({conversation_id: conversationId, sender_id: me.id, content: newMsg})});
    setNewMsg("");
    await refreshChatAndLogs(selectedClient.id, conversationId);
  };

  const addQuickLog = async () => {
    if (!selectedClient) return;
    const today = new Date().toISOString().slice(0,10);
    await fetch(`${API}/api/logs`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({client_id: selectedClient.id, log_date: today, calories: 2200, protein_g: 160, notes: "Great day"})});
    const l = await fetch(`${API}/api/logs?client_id=${selectedClient.id}`).then(r=>r.json());
    setLogs(l);
  }

  const createSampleWorkoutPlan = async () => {
    if (!me || !selectedClient) return;
    const payload = {
      trainer_id: me.id,
      client_id: selectedClient.id,
      title: "4-Week Hypertrophy",
      goal: "Build muscle",
      duration_weeks: 4,
      schedule: [
        { day: "Mon", focus: "Push", exercises: [ { name: "Bench Press", sets: 4, reps: "8-10", rest_seconds: 90 }, { name: "Overhead Press", sets: 3, reps: "8-10", rest_seconds: 90 } ] },
        { day: "Wed", focus: "Pull", exercises: [ { name: "Deadlift", sets: 3, reps: "5", rest_seconds: 120 }, { name: "Pull Ups", sets: 4, reps: "AMRAP", rest_seconds: 90 } ] },
        { day: "Fri", focus: "Legs", exercises: [ { name: "Squat", sets: 5, reps: "5", rest_seconds: 120 }, { name: "Leg Press", sets: 3, reps: "10-12", rest_seconds: 90 } ] }
      ],
      is_active: true
    };
    await fetch(`${API}/api/workout-plans`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload)});
    await refreshPlans(me.id, selectedClient.id);
  };

  const createSampleMealPlan = async () => {
    if (!me || !selectedClient) return;
    const payload = {
      trainer_id: me.id,
      client_id: selectedClient.id,
      title: "High-Protein Cut",
      daily_calorie_target: 2200,
      meals: [
        { name: "Greek Yogurt + Berries", calories: 350, protein_g: 30, carbs_g: 40, fats_g: 8, time_of_day: "breakfast" },
        { name: "Chicken + Rice + Veg", calories: 650, protein_g: 55, carbs_g: 70, fats_g: 15, time_of_day: "lunch" },
        { name: "Salmon + Potatoes + Salad", calories: 700, protein_g: 50, carbs_g: 60, fats_g: 25, time_of_day: "dinner" },
        { name: "Protein Shake", calories: 200, protein_g: 30, carbs_g: 5, fats_g: 2, time_of_day: "snack" }
      ],
      is_active: true
    };
    await fetch(`${API}/api/meal-plans`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload)});
    await refreshPlans(me.id, selectedClient.id);
  };

  return (
    <section id="dashboard" className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Role</span>
          <select value={role} onChange={e=>setRole(e.target.value)} className="border rounded-md px-3 py-1 text-sm">
            <option value="trainer">Trainer</option>
            <option value="client">Client</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Chat</h3>
            <button onClick={addQuickLog} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white"><Plus className="w-4 h-4"/>Quick Log</button>
          </div>
          <div className="mt-4 h-64 overflow-y-auto space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`max-w-sm p-3 rounded-lg ${m.sender_id===me?.id? 'bg-blue-50 ml-auto':'bg-gray-50'}`}>
                <p className="text-sm text-gray-800">{m.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} placeholder="Type a message" className="flex-1 border rounded-md px-3 py-2"/>
            <button onClick={sendMessage} className="px-3 py-2 rounded-md bg-gray-900 text-white inline-flex items-center gap-2"><SendHorizonal className="w-4 h-4"/> Send</button>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold">Daily Stats</h3>
          <div className="mt-4 space-y-3">
            {logs.slice(0,7).map((l)=> (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{new Date(l.log_date).toLocaleDateString()}</span>
                <span className="font-medium text-gray-900">{l.calories} kcal • {l.protein_g}g P</span>
              </div>
            ))}
            {logs.length===0 && <p className="text-sm text-gray-500">No logs yet.</p>}
          </div>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-blue-600"/>
              <h3 className="font-semibold">Workout Plans</h3>
            </div>
            <button onClick={createSampleWorkoutPlan} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white"><Plus className="w-4 h-4"/>Sample Plan</button>
          </div>
          <div className="mt-4 space-y-3">
            {workoutPlans.map((p)=> (
              <div key={p.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-600">{p.goal || '—'} • {p.duration_weeks} weeks</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">Active</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">Days: {p.schedule?.map(d=>d.day).join(', ')}</div>
              </div>
            ))}
            {workoutPlans.length===0 && <p className="text-sm text-gray-500">No active plans yet.</p>}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Salad className="w-4 h-4 text-emerald-600"/>
              <h3 className="font-semibold">Meal Plans</h3>
            </div>
            <button onClick={createSampleMealPlan} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-emerald-600 text-white"><Plus className="w-4 h-4"/>Sample Plan</button>
          </div>
          <div className="mt-4 space-y-3">
            {mealPlans.map((p)=> (
              <div key={p.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-600">Target: {p.daily_calorie_target} kcal</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">Active</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">Meals: {p.meals?.length || 0}</div>
              </div>
            ))}
            {mealPlans.length===0 && <p className="text-sm text-gray-500">No active plans yet.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
