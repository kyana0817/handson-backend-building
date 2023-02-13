import PostContent from "./Content"

const PostItem = ({post, handleClick}) => (
  <button onClick={handleClick}>
    <div className="paper post-item">
      <PostContent post={post}/>
    </div>
  </button>
)

export default function PostList({posts, handleClick}) {
  return (
    <div className="post-list">
      {posts.map(post => (
        <PostItem key={post.id} post={post} handleClick={handleClick(post.id)}/>
      ))}
    </div>
  )
}
