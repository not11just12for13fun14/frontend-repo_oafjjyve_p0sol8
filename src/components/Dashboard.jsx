import { useEffect, useMemo, useState } from "react";
import { Plus, SendHorizonal } from "lucide-react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function Dashboard(){
  const [role, setRole] = useState("trainer");
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [logs, setLogs] = useState([]);

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

  useEffect(()=>{
    const load = async () => {
      if (!conversationId) return;
      const msgs = await fetch(`${API}/api/messages?conversation_id=${conversationId}`).then(r=>r.json());
      setMessages(msgs.reverse());
      const l = await fetch(`${API}/api/logs?client_id=${selectedClient.id}`).then(r=>r.json());
      setLogs(l);
    };
    load();
  }, [conversationId, selectedClient]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    await fetch(`${API}/api/messages`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({conversation_id: conversationId, sender_id: me.id, content: newMsg})});
    setNewMsg("");
    const msgs = await fetch(`${API}/api/messages?conversation_id=${conversationId}`).then(r=>r.json());
    setMessages(msgs.reverse());
  };

  const addQuickLog = async () => {
    if (!selectedClient) return;
    const today = new Date().toISOString().slice(0,10);
    await fetch(`${API}/api/logs`, {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({client_id: selectedClient.id, log_date: today, calories: 2200, protein_g: 160, notes: "Great day"})});
    const l = await fetch(`${API}/api/logs?client_id=${selectedClient.id}`).then(r=>r.json());
    setLogs(l);
  }

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
    </section>
  )
}
