import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { login } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [ form, setForm ] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
   
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch {
      //todo
    }
  }
  
  return (
    <div>
      <h2 className="authenticate_heading">ログイン フォーム</h2>
      <form action="/" onSubmit={handleSubmit}>
        <label>
          メールアドレス
          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={form.email}
          />
        </label>
        <label>
          パスワード
          <input
            name="password"
            type="password"
            onChange={handleChange}
            value={form.password}
          />
        </label>
        <div className='authenticate_subitem'>

          <Link to="./signup">サインアップ</Link>
        </div>
        <div className="authenticate_button">
          <input type="submit" value="入力"/>
        </div>
      </form>
    </div>
  )
}