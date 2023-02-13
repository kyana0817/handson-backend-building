export default function UserInfo({user, children}) {
  return (
    <div className="paper">
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <div className="follower-counter">
        <p>フォロー: {user.target}</p>
        <p>フォロワー: {user.source}</p>
      </div>
      <div className="topright">
        {children}
      </div>
    </div>
  )
}
