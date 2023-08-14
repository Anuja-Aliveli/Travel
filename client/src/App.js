import {Switch, Route} from 'react-router-dom'
import Intro from './components/Intro'
import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'

const App = () => (
  <Switch>
    <Route exact path="/" component={Intro} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/home" component={Home} />
  </Switch>
)
export default App
