import { useState } from 'react'

import apiClient from '../../lib/apiClient'

export default function CommentForm({post, fetchFn}) {
  const [form, setForm] = useState({
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
    await apiClient.post(`/post/${post.id}/comment`, form)
    setForm({content: ''})
    fetchFn()
  }
  
  return (
    <>
      <form className="base-form" onSubmit={handleSubmit}>
        <label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="コメント"
          />
        </label>
        <div className="form-button-area">
          <input
            type="submit"
            value="コメント"
          />
        </div>
      </form>
    </>
  )
}
