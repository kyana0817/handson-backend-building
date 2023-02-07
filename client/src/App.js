import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Base from './Layout/Base'
import Authenticate from './Layout/Authenticate'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Base/>}>
          <Route path="" element={<Home/>}/>
        </Route>
        <Route path="/auth" element={<Authenticate/>}>
          <Route path="" element={<Login/>}/>
          <Route path="signup" element={<Signup/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
