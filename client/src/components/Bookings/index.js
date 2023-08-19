import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Skeleton from 'react-loading-skeleton'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-loading-skeleton/dist/skeleton.css'
import {AiOutlineDelete} from 'react-icons/ai'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const bookingArray = [0, 1, 2, 3, 4, 5]

class Bookings extends Component {
  state = {
    bookings: [],
    loading: false,
    deleteLoading: false,
  }

  componentDidMount = () => {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({loading: true})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://anujatravelserver.cyclic.cloud/bookings/`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      this.setState({bookings: data.bookings, loading: false})
    } else {
      this.setState({loading: false})
    }
  }

  renderEmpty = () => (
    <div className="empty-container">
      <p className="book">No Bookings Found!</p>
      <Link to="/packages">
        <button type="button" className="signup">
          Book Now
        </button>
      </Link>
    </div>
  )

  onDelete = async (location, date) => {
    this.setState({deleteLoading: true})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://anujatravelserver.cyclic.cloud/cancel?location=${location}&date=${date}`
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      this.setState({deleteLoading: false}, this.getDetails)
    } else {
      this.setState({deleteLoading: false})
    }
  }

  renderBookings = () => {
    const {bookings, deleteLoading} = this.state
    return (
      <>
        <div className="bookings-main">
          {bookings.map(eachItem => (
            <div className="tour-details" key={eachItem.location}>
              <p className="book">
                <b>Name: </b>
                {eachItem.username}
              </p>
              <p className="book">
                <b>Location: </b>
                {eachItem.location}
              </p>
              <p className="book">
                <b>Start Date: </b>
                {eachItem.date}
              </p>
              <p className="book">
                <b>No.of Persons: </b>
                {eachItem.persons}
              </p>
              <p className="book">
                <b>Price: </b>
                {eachItem.price}
              </p>
              {deleteLoading && (
                <Loader
                  type="Oval"
                  width={30}
                  height={30}
                  color="hsl(26,96%,50%)"
                />
              )}
              {!deleteLoading && (
                <AiOutlineDelete
                  size={30}
                  color="hsl(26,96%,50%)"
                  cursor="pointer"
                  title="Cancel Tour"
                  onClick={() =>
                    this.onDelete(eachItem.location, eachItem.date)
                  }
                />
              )}
            </div>
          ))}
        </div>
      </>
    )
  }

  renderResults = () => {
    const {bookings} = this.state
    // eslint-disable-next-line prefer-destructuring
    const length = bookings.length === 0
    return (
      <>
        <p className={length === true ? 'service margin' : 'service'}>
          Your Bookings
        </p>
        {length && this.renderEmpty()}
        {!length && this.renderBookings()}
      </>
    )
  }

  renderLoading = () => (
    <>
      <Skeleton className="service" width={200} style={{margin: '20px'}} />
      <div className="bookings-main">
        {bookingArray.map(eachItem => (
          <div className="tour-details" key={eachItem}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Skeleton width={150} style={{marginRight: '10px'}} height={25} />
              <Skeleton width={80} height={25} />
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Skeleton width={150} style={{marginRight: '10px'}} height={25} />
              <Skeleton width={80} height={25} />
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Skeleton width={150} style={{marginRight: '10px'}} height={25} />
              <Skeleton width={80} height={25} />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Skeleton width={150} style={{marginRight: '10px'}} height={25} />
              <Skeleton width={80} height={25} />
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Skeleton width={150} style={{marginRight: '10px'}} height={25} />
              <Skeleton width={80} height={25} />
            </div>
          </div>
        ))}
      </div>
    </>
  )

  render() {
    const {loading} = this.state
    return (
      <div className="bookings-page">
        <Header />
        {loading && this.renderLoading()}
        {!loading && this.renderResults()}
        <Footer />
      </div>
    )
  }
}

export default Bookings
