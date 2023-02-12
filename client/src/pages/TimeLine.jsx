import { useEffect, useState } from "react"

import apiClient from "../lib/apiClient"


const Form = ({fetchFn}) => {
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

const PostItem = ({post}) => {
  return (
    <div className="paper post-item" key={post.id}>
      <p>{post.title}</p>
      <p>{post.content}</p>
      <p>{post.username}</p>
    </div>
  )

}

const PostList = ({posts}) => {

  return (
    <div className="post-list">
      {posts.map(post => (
        <PostItem key={post.id} post={post}/>
      ))}
    </div>
  )
}

export default function TimeLine() {
  const [posts, setPosts] = useState([])

  const fetchPost = async () => {
    const res = await apiClient.get('/post')
    setPosts(res)
  }

  useEffect(() => {
    fetchPost()
  }, [])

  return (
    <>
      <section>
        <h2>
          フォーム
        </h2>
        <Form fetchFn={fetchPost}/>
      </section>
      <section>
        <h2>
          ポスト
        </h2>
        <PostList posts={posts}/>
      </section>
    </>
  )
  
}
