import { Link } from 'react-router-dom'

export default function PostContent({post}) {
  return (
    <div className="detail-post">
      <p className="post-title">{post.title}</p>
      <p className="post-content">{post.content}</p>
      <p className="post-username"><Link to={`/user/${post.user_id}`}>{post.username}</Link></p>
    </div>
  )
}
