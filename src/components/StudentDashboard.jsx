import { useEffect, useState } from 'react'

const backend = import.meta.env.VITE_BACKEND_URL

export default function StudentDashboard({ student }){
  const [lessons, setLessons] = useState([])
  const [homework, setHomework] = useState([])
  const [messages, setMessages] = useState([])
  const [tab, setTab] = useState('lessons')
  const [text, setText] = useState('')
  const [file, setFile] = useState('')
  const [selectedHW, setSelectedHW] = useState('')

  useEffect(()=>{(async()=>{
    const l = await (await fetch(`${backend}/api/lessons?student_id=${student.id}`)).json(); setLessons(l)
    const h = await (await fetch(`${backend}/api/homework?student_id=${student.id}`)).json(); setHomework(h)
    const m = await (await fetch(`${backend}/api/messages?student_id=${student.id}`)).json(); setMessages(m)
  })()},[student.id])

  const send = async ()=>{
    if(!text) return
    const res = await fetch(`${backend}/api/messages`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({student_id:student.id, sender:'student', text})})
    const m = await res.json(); setMessages([...messages, m]); setText('')
  }

  const submit = async ()=>{
    if(!selectedHW) return
    const res = await fetch(`${backend}/api/homework/${selectedHW}/submit?student_id=${student.id}`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({file_url:file||null})})
    const sub = await res.json()
    alert('تم إرسال الواجب بنجاح!')
    // refresh homework to see status
    const h = await (await fetch(`${backend}/api/homework?student_id=${student.id}`)).json(); setHomework(h)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">أهلاً {student.name}</h2>
        <div className="flex gap-2">
          {['lessons','homework','messages','ai'].map(t => (
            <button key={t} onClick={()=>setTab(t)} className={`px-3 py-2 rounded-xl ${tab===t? 'bg-blue-500 text-white':'bg-white'}`}>{
              t==='lessons'?'الدروس':t==='homework'?'الواجبات':t==='messages'?'الرسائل':'المساعدة الذكية'
            }</button>
          ))}
        </div>
      </div>

      {tab==='lessons' && (
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-bold mb-3 text-right">الدروس</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {lessons.map(l=>(
              <div key={l.id} className="border rounded-xl p-3 text-right">
                <div className="font-bold">{l.topic}</div>
                <div className="text-sm text-gray-600">{l.date} - {l.start_time}</div>
                <div className="text-xs">الحالة: {l.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='homework' && (
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-bold mb-3 text-right">الواجبات</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {homework.map(h=>(
              <div key={h.id} className={`border rounded-xl p-3 text-right ${h.status==='graded'?'border-green-400':'border-gray-200'}`}>
                <div className="font-bold">{h.title}</div>
                <div className="text-sm text-gray-600">تاريخ التسليم: {h.due_date || '—'}</div>
                <div className="text-xs mt-1">الحالة: {h.status}</div>
                {h.status==='graded' && (
                  <div className="mt-1 text-green-700 text-sm">تم التصحيح! راجع الرسائل لمعرفة الملاحظات</div>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <input type="text" className="flex-1 border rounded p-2" placeholder="رابط الملف أو صورة" value={file} onChange={e=>setFile(e.target.value)} />
                  <button onClick={()=>{setSelectedHW(h.id)}} className={`px-2 py-1 rounded ${selectedHW===h.id?'bg-blue-600 text-white':'bg-gray-100'}`}>اختر</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right">
            <button onClick={submit} className="bg-blue-500 text-white px-4 py-2 rounded-xl">إرسال الواجب المختار</button>
          </div>
        </div>
      )}

      {tab==='messages' && (
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
          <h3 className="font-bold mb-3 text-right">الرسائل</h3>
          <div className="flex-1 space-y-2 overflow-auto border rounded-xl p-3 bg-gray-50">
            {messages.map(m=> (
              <div key={m.id} className={`max-w-[70%] p-2 rounded-xl ${m.sender==='teacher'?'bg-pink-200 self-start':'bg-blue-200 self-end ml-auto'}`}>
                <div className="text-sm">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input className="flex-1 border rounded-xl p-2" value={text} onChange={e=>setText(e.target.value)} placeholder="اكتب رسالة..." />
            <button onClick={send} className="bg-blue-500 text-white px-4 rounded-xl">إرسال</button>
          </div>
        </div>
      )}

      {tab==='ai' && <AIBox/>}
    </div>
  )
}

function AIBox(){
  const [q,setQ]=useState('')
  const [a,setA]=useState(null)
  const ask=async()=>{const res=await fetch(`${backend}/api/ai/chat`,{method:'POST',headers:{'Content-Type':'application/json'}, body: JSON.stringify({question:q})}); setA(await res.json())}
  return (
    <div className="bg-white p-6 rounded-2xl shadow" dir="rtl">
      <h3 className="font-bold mb-3 text-right">مساعدة ماما عيدة</h3>
      <div className="flex gap-2">
        <input className="flex-1 border rounded-xl p-2 text-right" value={q} onChange={e=>setQ(e.target.value)} placeholder="اسألني عن الواجب أو الدرس"/>
        <button onClick={ask} className="bg-blue-500 text-white px-4 rounded-xl">اسأل</button>
      </div>
      {a && (
        <div className="mt-4 text-right">
          <div className="font-bold">{a.reply}</div>
          <div className="text-sm text-gray-600 mt-1">نصيحة: {a.tip}</div>
        </div>
      )}
    </div>
  )
}
