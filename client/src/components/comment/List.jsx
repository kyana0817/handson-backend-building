import CommentContent from "./Content"

export default function CommentList({comments}) {
  return (
    <div className="comment-list">
      {comments.map(comment => (
        <CommentContent key={comment.id} comment={comment}/>
      ))}
    </div>
  )
}