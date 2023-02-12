import { Outlet, Link } from 'react-router-dom'

export default function Base () {
  
  return (
    <div className='base-wrap'>
      <nav className='base-tab'>
        <li><Link to="/">タイムライン</Link></li>
        <li><Link to="detail">ユーザー詳細</Link></li>
      </nav>
      <Outlet/>
    </div>
  )
}