import { useState } from 'react'
import { Link } from 'react-router-dom' 

import { signup } from '../lib/auth'

export default function Signup() {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(form.email, form.password)
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