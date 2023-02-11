import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { signup } from '../lib/auth'
import apiClient from '../lib/apiClient'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
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
      await signup(form.email, form.password)
      await apiClient.post('/register', form)
      navigate('/')
    } catch {
      //todo
    }

  }
  
  return (
    <div>
      <h2 className="authenticate_heading">サインアップ フォーム</h2>
      <form action="/" onSubmit={handleSubmit}>
        <label>
          ユーザーネーム
          <input name="username" type="text" onChange={handleChange}/>
        </label>
        <label>
          メールアドレス
          <input name="email" type="email" onChange={handleChange}/>
        </label>
        <label>
          パスワード
          <input name="password" type="password" onChange={handleChange}/>
        </label>
        <label>
          確認パスワード
          <input name="confirm_password" type="password" onChange={handleChange}/>
        </label>
        <div className='authenticate_subitem'>

          <Link to="../">ログイン</Link>
        </div>
        <div className="authenticate_button">
          <input type="submit" value="入力"/>
        </div>
      </form>
    </div>
  )
}