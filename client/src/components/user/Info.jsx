export default function UserInfo({user, children}) {
  return (
    <div className="paper">
      <h3>{user.username}</h3>
      <p>{user.email}</p>
      <div className="follower-counter">
        <p>フォロー: {user.source}</p>
        <p>フォロワー: {user.target}</p>
      </div>
      <div className="topright">
        {children}
      </div>
    </div>
  )
}
