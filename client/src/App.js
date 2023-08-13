import {Switch, Route} from 'react-router-dom'
import Intro from './components/Intro'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/" component={Intro} />
  </Switch>
)
export default App
