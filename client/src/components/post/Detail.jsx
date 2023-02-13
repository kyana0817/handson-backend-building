import { useEffect, useState } from 'react'

import PostContent from './Content'
import CommentForm from '../comment/Form'
import CommentList from '../comment/List'
import apiClient from '../../lib/apiClient'

export default function PostDetail({post}) {
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
