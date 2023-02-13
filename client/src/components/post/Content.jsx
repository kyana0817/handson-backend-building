export default function PostContent({post}) {
  return (
    <div className="detail-content">
      <p className="post-title">{post.title}</p>
      <p className="post-content">{post.content}</p>
      <p className="post-username">{post.username}</p>
    </div>
  )
}
