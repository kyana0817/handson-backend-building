import { useEffect, useState } from 'react'

import Modal from '../components/Modal'
import PostContent from '../components/post/Content'
import PostForm from '../components/post/Form'
import CommentForm from '../components/comment/Form'
import CommentContent from '../components/comment/Content'
import apiClient from '../lib/apiClient'


const CommentList = ({comments}) => (
  <div className="comment-list">
    {comments.map(comment => (
      <CommentContent key={comment.id} comment={comment}/>
    ))}
  </div>
)

const PostDetail = ({post}) => {
  const [comments, setComments] = useState([])
  
  const fetchComment = async () => {
    const res = await apiClient.get(`/post/${post.id}/comment`)
    setComments(res)
  }

  useEffect(() => {
    fetchComment()
  }, [])
  
  return (
    <div className="paper post-detail">
      <PostContent post={post}/>
      <div>
        <h3>コメント</h3>
        <CommentList comments={comments}/>
        <CommentForm post={post} fetchFn={fetchComment}/>
      </div>
    </div>
  )
}

const PostItem = ({post, handleClick}) => (
  <button onClick={handleClick}>
    <div className="paper post-item">
      <PostContent post={post}/>
    </div>
  </button>
)

const PostList = ({posts, handleClick}) => (
  <div className="post-list">
    {posts.map(post => (
      <PostItem key={post.id} post={post} handleClick={handleClick(post.id)}/>
    ))}
  </div>
)


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
