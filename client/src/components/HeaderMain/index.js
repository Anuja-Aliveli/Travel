import {Link, withRouter} from 'react-router-dom'
import './index.css'

const HeaderMain = props => {
  const {match} = props
  const {path} = match
  let names = []
  if (path === '/') {
    names = []
    names.push('Login', 'Sign Up', '/login', '/register')
  } else if (path === '/register') {
    names = []
    names.push('Login', 'Explore', '/login', '/')
  } else {
    names = []
    names.push('Explore', 'Sign Up', '/', '/register')
  }
  return (
    <div className="nav-intro-container">
      <p className="logo">
        <b>
          Tr<span>av</span>el
        </b>
      </p>
      <div>
        <Link to={names[2]}>
          <button type="button" className="login">
            {names[0]}
          </button>
        </Link>
        <Link to={names[3]}>
          <button type="button" className="signup">
            {names[1]}
          </button>
        </Link>
      </div>
    </div>
  )
}

export default withRouter(HeaderMain)
