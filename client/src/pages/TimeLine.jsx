import { useEffect, useState } from 'react'

import Modal from '../components/Modal'
import apiClient from '../lib/apiClient'


const PostForm = ({fetchFn}) => {
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

const CommentForm = () => {
  const [form, setForm] = useState({
    content: ''
  })

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // await apiClient.post('')
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

const PostDetail = ({post}) => {
  return (
    <div className="paper post-detail">
      <div className="detail-content">
        <p className="post-title">{post.title}</p>
        <p className="post-content">{post.content}</p>
        <p className="post-username">{post.username}</p>
      </div>
      <div>
        <h3>コメント</h3>
        <CommentForm/>
      </div>
    </div>
  )
}

const PostItem = ({post, handleClick}) => {
  return (
    <button onClick={handleClick}>
      <div className="paper post-item" key={post.id}>
        <div className="detail-content">
          <p className="post-title">{post.title}</p>
          <p className="post-content">{post.content}</p>
          <p className="post-username">{post.username}</p>
        </div>
      </div>
    </button>
  )

}

const PostList = ({posts, handleClick}) => {
  return (
    <div className="post-list">
      {posts.map(post => (
        <PostItem key={post.id} post={post} handleClick={handleClick(post.id)}/>
      ))}
    </div>
  )
}


export default function TimeLine() {
  const [posts, setPosts] = useState([])
  const [post, setPost] = useState({})
  const [open, setOpen] = useState(false)

  const fetchPost = async () => {
    const res = await apiClient.get('/post')
    setPosts(res)
  }
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleClick = (id) => (e) => {
    console.log(id)
    handleOpen()
    setPost(posts.find(post => post.id === id))
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
        <PostForm fetchFn={fetchPost}/>
      </section>
      <section>
        <h2>
          ポスト
        </h2>
        <PostList posts={posts} handleClick={handleClick}/>
      </section>
      <Modal open={open} handleClose={handleClose}>
        <PostDetail post={post}/>
      </Modal>
    </>
  )
}
