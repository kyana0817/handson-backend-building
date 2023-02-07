import { Outlet } from 'react-router-dom'

export default function Authenticate() {
  return (
    <div className="authenticate_wrap">
      <div className="authenticate_paper">
        <Outlet/>
      </div>
    </div>
  )
}