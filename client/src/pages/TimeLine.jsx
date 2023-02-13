import { useEffect, useState } from 'react'

import Modal from '../components/utils/Modal'
import PostForm from '../components/post/Form'
import PostList from '../components/post/List'
import PostDetail from '../components/post/Detail'
import apiClient from '../lib/apiClient'


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
