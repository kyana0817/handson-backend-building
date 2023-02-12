import { useState } from "react"

import apiClient from "../lib/apiClient"


const Form = () => {
  const [form, setForm] = useState({
    title: '',
    content: ''
  })

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    await apiClient.post('/post', form)
  }

  return (
    <div className="paper">
      <form className="base-form" onSubmit={handleSubmit}>
        <label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="タイトル"
          />
        </label>
        <label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="コンテンツ"
          />
        </label>
        <div className="form-button-area">
          <input
            type="submit"
            value="投稿"
          />
        </div>
      </form>
    </div>
  )
}

export default function TimeLine() {


  return (
    <>
      <h2>
        フォーム
      </h2>
      <Form/>
      <h2>
        ポスト
      </h2>
    </>
  )
  
}
