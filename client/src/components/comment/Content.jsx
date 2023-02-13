export default function CommentContent({comment}) {
  return (
    <div className="detail-comment">
      <p className="comment-username">{comment.username}:</p>
      <p className="comment-content">{comment.content}</p>
    </div>
  )
}
