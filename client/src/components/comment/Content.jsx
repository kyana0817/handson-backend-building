export default function CommentContent({comment}) {
  return (
    <div>
      <p>{comment.username}:</p>
      <p>{comment.content}</p>            
    </div>
  )
}
