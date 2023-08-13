import './index.css'
import {FaFacebook, FaTwitter, FaInstagram} from 'react-icons/fa'

const Footer = () => (
  <div className="back">
    <div className="footer-container">
      <div className="logo-container-footer">
        <p className="logo">
          <b>
            Tr<span className="white">av</span>el
          </b>
        </p>
        <p className="white">Take Only Memories, Leave Only Footprints</p>
        <div className="icons">
          <div className="icon-container-footer">
            <FaFacebook className="icon-footer" />
          </div>
          <div className="icon-container-footer">
            <FaTwitter className="icon-footer" />
          </div>
          <div className="icon-container-footer">
            <FaInstagram className="icon-footer" />
          </div>
        </div>
        <div className="row">
          <p className="white right">Sign Up</p>
          <p className="white">Login</p>
        </div>
      </div>
      <div className="links-container-footer">
        <div>
          <p className="white link-head">
            <b>Links</b>
          </p>
          <p className="white">Explore</p>
          <p className="white">Home</p>
          <p className="white">Packages</p>
          <p className="white">Bookings</p>
        </div>
        <div>
          <p className="white link-head">
            <b>Others</b>
          </p>
          <p className="white">Privacy</p>
          <p className="white">Terms and Conditions</p>
          <p className="white">Contact Us</p>
          <p className="white">Documentation</p>
        </div>
      </div>
    </div>
    <p className="white center">
      © 2023{' '}
      <span className="logo">
        Tr<span>av</span>el.
      </span>
      All Rights Reserved.
    </p>
  </div>
)
export default Footer
