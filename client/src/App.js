import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Base from './Layout/Base'
import Authenticate from './Layout/Authenticate'
import TimeLine from './pages/TimeLine'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AuthenticationProvider, Authoraization } from './utils/Authentication'

function App() {
  return (
    <AuthenticationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Authoraization><Base/></Authoraization>}>
            <Route path="" element={<TimeLine/>}/>
          </Route>
          <Route path="/auth" element={<Authenticate/>}>
            <Route path="" element={<Login/>}/>
            <Route path="signup" element={<Signup/>}/>
          </Route>
        </Routes>
      </Router>
    </AuthenticationProvider>
  )
}

export default App;
