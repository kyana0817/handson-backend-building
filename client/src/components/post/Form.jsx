import { useState } from 'react'

import apiClient from '../../lib/apiClient'

export default function PostForm({fetchFn}) {
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
    await fetchFn()
    setForm({
      title: '',
      content: ''
    })
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
