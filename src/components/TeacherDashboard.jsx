import { useEffect, useState } from 'react'

const backend = import.meta.env.VITE_BACKEND_URL

export default function TeacherDashboard() {
  const [tab, setTab] = useState('students')
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-right">لوحة تحكم المعلمة</h2>
      <div className="flex gap-2 justify-end">
        {['students','lessons','homework','messages','ai'].map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-2 rounded-xl ${tab===t? 'bg-pink-500 text-white':'bg-white'}`}>{
            t==='students'?'الطلاب':t==='lessons'?'الدروس':t==='homework'?'الواجبات':t==='messages'?'الرسائل':'المساعدة الذكية'
          }</button>
        ))}
      </div>
      {tab==='students' && <StudentsManager />}
      {tab==='lessons' && <LessonsManager />}
      {tab==='homework' && <HomeworkManager />}
      {tab==='messages' && <MessagesView />}
      {tab==='ai' && <AIBox />}
    </div>
  )
}

function StudentsManager(){
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({name:'', gender:'boy', grade:'1', code:'', avatar:'boy'})
  const load = async ()=>{
    const res = await fetch(`${backend}/api/students`)
    setStudents(await res.json())
  }
  useEffect(()=>{load()},[])
  const save = async ()=>{
    const res = await fetch(`${backend}/api/students`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
    const s = await res.json()
    setForm({name:'', gender:'boy', grade:'1', code:'', avatar:'boy'})
    setStudents([s, ...students])
  }
  const remove = async (id)=>{
    await fetch(`${backend}/api/students/${id}`,{method:'DELETE'})
    setStudents(students.filter(s=>s.id!==id))
  }
  return (
    <div className="grid md:grid-cols-3 gap-4" dir="rtl">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold mb-2 text-right">إضافة طالب</h3>
        <div className="space-y-2">
          <input className="w-full border p-2 rounded" placeholder="اسم الطالب" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <select className="w-full border p-2 rounded" value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})}>
            <option value="boy">ذكر</option>
            <option value="girl">أنثى</option>
          </select>
          <select className="w-full border p-2 rounded" value={form.grade} onChange={e=>setForm({...form, grade:e.target.value})}>
            <option value="1">الصف الأول</option>
            <option value="2">الصف الثاني</option>
            <option value="3">الصف الثالث</option>
          </select>
          <input className="w-full border p-2 rounded" placeholder="رمز الدخول" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} />
          <select className="w-full border p-2 rounded" value={form.avatar} onChange={e=>setForm({...form, avatar:e.target.value})}>
            <option value="boy">صورة ولد</option>
            <option value="girl">صورة بنت</option>
          </select>
          <button onClick={save} className="w-full bg-pink-500 text-white py-2 rounded">حفظ</button>
        </div>
      </div>
      <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold mb-2 text-right">قائمة الطلاب</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.map(s=> (
            <div key={s.id} className="border rounded-xl p-3 text-right">
              <div className="font-bold">{s.name}</div>
              <div className="text-sm text-gray-600">الصف: {s.grade}</div>
              <div className="flex justify-between mt-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">رمز: {s.code}</span>
                <button onClick={()=>remove(s.id)} className="text-red-600 text-sm">حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LessonsManager(){
  const [students,setStudents]=useState([])
  const [list,setList]=useState([])
  const [form,setForm]=useState({student_id:'',date:'',start_time:'',topic:'',notes:'',status:'scheduled'})
  useEffect(()=>{(async()=>{const s=await (await fetch(`${backend}/api/students`)).json(); setStudents(s); const l=await (await fetch(`${backend}/api/lessons`)).json(); setList(l)})()},[])
  const add=async()=>{const res=await fetch(`${backend}/api/lessons`,{method:'POST',headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)}); const data=await res.json(); setList([data,...list])}
  const remove=async(id)=>{await fetch(`${backend}/api/lessons/${id}`,{method:'DELETE'}); setList(list.filter(x=>x.id!==id))}
  return (
    <div className="grid md:grid-cols-3 gap-4" dir="rtl">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold mb-2 text-right">إضافة درس</h3>
        <select className="w-full border p-2 rounded" value={form.student_id} onChange={e=>setForm({...form, student_id:e.target.value})}>
          <option value="">اختر الطالب</option>
          {students.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input className="w-full border p-2 rounded mt-2" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
        <input className="w-full border p-2 rounded mt-2" type="time" value={form.start_time} onChange={e=>setForm({...form, start_time:e.target.value})} />
        <input className="w-full border p-2 rounded mt-2" placeholder="موضوع الدرس" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} />
        <textarea className="w-full border p-2 rounded mt-2" placeholder="ملاحظات" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
        <button onClick={add} className="w-full bg-pink-500 text-white py-2 rounded mt-2">حفظ</button>
      </div>
      <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold mb-2 text-right">قائمة الدروس</h3>
        <div className="space-y-2">
          {list.map(l=>(
            <div key={l.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div className="text-right">
                <div className="font-bold">{l.topic}</div>
                <div className="text-sm text-gray-600">{l.date} - {l.start_time}</div>
              </div>
              <button onClick={()=>remove(l.id)} className="text-red-600">حذف</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HomeworkManager(){
  const [students,setStudents]=useState([])
  const [list,setList]=useState([])
  const [form,setForm]=useState({student_id:'',lesson_id:'',title:'',description:'',due_date:'',attachment_url:'',status:'pending'})
  useEffect(()=>{(async()=>{const s=await (await fetch(`${backend}/api/students`)).json(); setStudents(s); const l=await (await fetch(`${backend}/api/homework`)).json(); setList(l)})()},[])
  const add=async()=>{const res=await fetch(`${backend}/api/homework`,{method:'POST',headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)}); const data=await res.json(); setList([data,...list])}
  const remove=async(id)=>{await fetch(`${backend}/api/homework/${id}`,{method:'DELETE'}); setList(list.filter(x=>x.id!==id))}
  return (
    <div className="grid md:grid-cols-3 gap-4" dir="rtl">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold mb-2 text-right">إضافة واجب</h3>
        <select className="w-full border p-2 rounded" value={form.student_id} onChange={e=>setForm({...form, student_id:e.target.value})}>
          <option value="">اختر الطالب</option>
          {students.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input className="w-full border p-2 rounded mt-2" placeholder="عنوان الواجب" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <textarea className="w-full border p-2 rounded mt-2" placeholder="التعليمات" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <input className="w-full border p-2 rounded mt-2" type="date" value={form.due_date} onChange={e=>setForm({...form, due_date:e.target.value})} />
        <input className="w-full border p-2 rounded mt-2" placeholder="رابط مرفق (اختياري)" value={form.attachment_url} onChange={e=>setForm({...form, attachment_url:e.target.value})} />
        <button onClick={add} className="w-full bg-pink-500 text-white py-2 rounded mt-2">حفظ</button>
      </div>
      <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold mb-2 text-right">قائمة الواجبات</h3>
        <div className="space-y-2">
          {list.map(l=>(
            <div key={l.id} className="border rounded-xl p-3 text-right">
              <div className="font-bold">{l.title}</div>
              <div className="text-sm text-gray-600">تاريخ التسليم: {l.due_date || '—'}</div>
              <button onClick={()=>remove(l.id)} className="text-red-600 mt-2">حذف</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MessagesView(){
  const [students,setStudents]=useState([])
  const [selected,setSelected]=useState('')
  const [messages,setMessages]=useState([])
  const [text,setText]=useState('')
  useEffect(()=>{(async()=>{const s=await (await fetch(`${backend}/api/students`)).json(); setStudents(s)})()},[])
  useEffect(()=>{(async()=>{ if(!selected) return; const msgs=await (await fetch(`${backend}/api/messages?student_id=${selected}`)).json(); setMessages(msgs) })()},[selected])
  const send = async ()=>{
    if(!selected||!text) return
    const res = await fetch(`${backend}/api/messages`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({student_id:selected, sender:'teacher', text})})
    const m = await res.json(); setMessages([...messages, m]); setText('')
  }
  return (
    <div className="grid md:grid-cols-3 gap-4" dir="rtl">
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold mb-2 text-right">اختر الطالب</h3>
        <select className="w-full border p-2 rounded" value={selected} onChange={e=>setSelected(e.target.value)}>
          <option value="">—</option>
          {students.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow flex flex-col">
        <div className="flex-1 space-y-2 overflow-auto border rounded-xl p-3 bg-gray-50">
          {messages.map(m=> (
            <div key={m.id} className={`max-w-[70%] p-2 rounded-xl ${m.sender==='teacher'?'bg-pink-200 self-start':'bg-blue-200 self-end ml-auto'}`}>
              <div className="text-sm">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input className="flex-1 border rounded-xl p-2" value={text} onChange={e=>setText(e.target.value)} placeholder="اكتب رسالة..." />
          <button onClick={send} className="bg-pink-500 text-white px-4 rounded-xl">إرسال</button>
        </div>
      </div>
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
        <input className="flex-1 border rounded-xl p-2 text-right" value={q} onChange={e=>setQ(e.target.value)} placeholder="اسألني عن الدرس أو الواجب"/>
        <button onClick={ask} className="bg-pink-500 text-white px-4 rounded-xl">اسأل</button>
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
