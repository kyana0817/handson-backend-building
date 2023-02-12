import { Outlet } from 'react-router-dom'

export default function Authenticate() {
  return (
    <div className="authenticate-wrap">
      <div className="paper">
        <Outlet/>
      </div>
    </div>
  )
}