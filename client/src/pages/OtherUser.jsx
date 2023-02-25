import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Modal from '../components/utils/Modal'
import PostDetail from '../components/post/Detail'
import PostList from '../components/post/List'
import UserInfo from '../components/user/Info'
import apiClient from '../lib/apiClient'

export default function OtherUser() {
  const [user, setUser] = useState({})
  const [posts, setPosts] = useState([])
  const [post, setPost] = useState({})
  const [open, setOpen] = useState(false)
  const { userId } = useParams() 
  
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleClick = (id) => (e) => {
    console.log(id)
    handleOpen()
    setPost(posts.find(post => post.id === id))
  }

  const fetchUser = async () => {
    const res = await apiClient.get(`/user/${userId}`)
    setUser(res)
  }

  const fetchPost = async () => {
    const res = await apiClient.get(`/user/${userId}/post`)
    setPosts(res)
  }

  const handleFollow = async () => {
    await apiClient.post(`/follow/${userId}`)
    fetchUser()
  }
  
  const handleUnfollow = async () => {
    await apiClient.delete(`/follow/${userId}`)
    fetchUser()
  }

  useEffect(() => {
    (async () => {
      await Promise.all([fetchUser(), fetchPost()])
    })()
  }, [])

  return (
    <>
      <section>
        <h2>{user.username}の情報</h2>
        <UserInfo user={user}>
          {user.is_follow? (
            <button className="follow" onClick={handleUnfollow}>
              フォローを外す
            </button>
          ): (
            <button className="follow" onClick={handleFollow}>
              フォローをする
            </button>
          )}
        </UserInfo>
      </section>
      <section>
        <h2>{user.username}が投稿した記事</h2>
        <PostList posts={posts} handleClick={handleClick}/>
      </section>
      <Modal open={open} handleClose={handleClose}>
        <PostDetail post={post}/>
      </Modal>
    </>
  )
}