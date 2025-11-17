import { useState } from 'react'
import Login from './components/Login'
import TeacherDashboard from './components/TeacherDashboard'
import StudentDashboard from './components/StudentDashboard'

function App() {
  const [session, setSession] = useState(null)

  if(!session){
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center" dir="rtl">
        <Login onLogin={setSession} />
      </div>
    )
  }

  if(session.role === 'teacher'){
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-6" dir="rtl">
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold">منصة ماما عيدة</h1>
            <button onClick={()=>setSession(null)} className="bg-gray-800 text-white px-4 py-2 rounded-xl">خروج</button>
          </header>
          <TeacherDashboard />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold">مرحباً {session.student?.name}</h1>
          <button onClick={()=>setSession(null)} className="bg-gray-800 text-white px-4 py-2 rounded-xl">خروج</button>
        </header>
        <StudentDashboard student={session.student} />
      </div>
    </div>
  )
}

export default App