import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useAuth } from '../utils/Authentication'
import { login } from '../lib/auth'

export default function Login() {
  const { dispatch } = useAuth()
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
      dispatch({type: 'login'})
      navigate('/')
    } catch {
      //todo
    }
  }
  
  return (
    <div>
      <h2 className="authenticate-heading">ログイン フォーム</h2>
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
        <div className='authenticate-subitem'>

          <Link to="./signup">サインアップ</Link>
        </div>
        <div className="authenticate-button">
          <input type="submit" value="入力"/>
        </div>
      </form>
    </div>
  )
}