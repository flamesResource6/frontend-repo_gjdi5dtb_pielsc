import { useState } from 'react'

export default function Login({ onLogin }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${backend}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      if (!res.ok) throw new Error('رمز الدخول غير صحيح')
      const data = await res.json()
      onLogin(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">مرحبا بكم في منصة ماما عيدة</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-4">
        <label className="block text-right">ادخل رمز الدخول</label>
        <input
          dir="rtl"
          inputMode="numeric"
          className="w-full border rounded-xl p-3 text-right"
          placeholder="مثال: 1234"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {error && <p className="text-red-600 text-right">{error}</p>}
        <button disabled={loading} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl">
          {loading ? 'جاري التحقق...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}
