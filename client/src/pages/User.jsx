import { useState, useEffect } from 'react'

import Modal from '../components/utils/Modal'
import PostDetail from '../components/post/Detail'
import PostList from '../components/post/List'
import UserInfo from '../components/user/Info'
import apiClient from '../lib/apiClient'
import { useAuth } from '../utils/Authentication'

export default function User() {
  const [user, setUser] = useState({})
  const [posts, setPosts] = useState([])
  const [post, setPost] = useState({})
  const [open, setOpen] = useState(false)
  const { dispatch } = useAuth()
  
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleClick = (id) => (e) => {
    console.log(id)
    handleOpen()
    setPost(posts.find(post => post.id === id))
  }

  const fetchUser = async () => {
    const res = await apiClient.get('/currentUser')
    setUser(res)
  }

  const fetchPost = async () => {
    const res = await apiClient.get('/currentUser/post')
    setPosts(res)
  }

  const handleLogout = () => {
    dispatch({type: 'logout'})
  }

  useEffect(() => {
    (async () => {
      await Promise.all([fetchUser(), fetchPost()])
    })()
  }, [])

  return (
    <>
      <section>
        <h2>あなたの情報</h2>
        <UserInfo user={user}>
          <button className="logout" onClick={handleLogout}>
            ログアウト
          </button>
        </UserInfo>
      </section>
      <section>
        <h2>投稿した記事</h2>
        <PostList posts={posts} handleClick={handleClick}/>
      </section>
      <Modal open={open} handleClose={handleClose}>
        <PostDetail post={post}/>
      </Modal>
    </>
  )
}