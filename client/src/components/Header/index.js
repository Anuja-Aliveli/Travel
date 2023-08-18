import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BiHomeHeart, BiPackage, BiCalendarEvent} from 'react-icons/bi'
import {RiLogoutBoxRLine} from 'react-icons/ri'
import './index.css'

const Header = props => {
  const {match} = props
  const {path} = match
  const links = ['/home', '/packages', '/bookings']
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="nav-home-container">
      <p className="logo">
        <b>
          Tr<span>av</span>el
        </b>
      </p>
      <div className="link-container-desktop">
        <Link
          to={links[0]}
          className={path === links[0] ? 'link-item active' : 'link-item'}
        >
          Home
        </Link>
        <Link
          to={links[1]}
          className={path === links[1] ? 'link-item active' : 'link-item'}
        >
          Packages
        </Link>
        <Link
          to={links[2]}
          className={path === links[2] ? 'link-item active' : 'link-item'}
        >
          Bookings
        </Link>
        <button type="button" className="signup" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div className="link-container-mobile">
        <Link
          to={links[0]}
          className={path === links[0] ? 'link-item active' : 'link-item'}
        >
          <BiHomeHeart size={40} />
        </Link>
        <Link
          to={links[1]}
          className={path === links[1] ? 'link-item active' : 'link-item'}
        >
          <BiPackage size={40} />
        </Link>
        <Link
          to={links[2]}
          className={path === links[2] ? 'link-item active' : 'link-item'}
        >
          <BiCalendarEvent size={40} />
        </Link>
        <RiLogoutBoxRLine size={40} color="#ffffff" onClick={onLogout} />
      </div>
    </nav>
  )
}

export default withRouter(Header)
