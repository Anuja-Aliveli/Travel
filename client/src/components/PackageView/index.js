import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {
  AiOutlinePlusSquare,
  AiOutlineMinusSquare,
  AiOutlineStar,
  AiFillStar,
} from 'react-icons/ai'
import Slider from 'react-slick'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'slick-carousel/slick/slick.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'slick-carousel/slick/slick-theme.css'
import Skeleton from 'react-loading-skeleton'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-loading-skeleton/dist/skeleton.css'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const array = [false, false, false, false, false]

class PackageView extends Component {
  state = {
    packageDetails: {},
    reviews: [],
    date: '',
    price: 0,
    persons: 1,
    bookLoading: false,
    bookMsg: '',
    starIcons: array,
    userReview: '',
    ratingCount: 0,
    reviewLoading: false,
    loading: false,
  }

  componentDidMount = () => {
    this.getDetails()
  }

  componentDidUpdate(prevProps, prevState) {
    const {packageDetails} = this.state
    if (prevState.packageDetails !== packageDetails) {
      this.getImages()
      this.packageOverview()
      this.booknow()
    }
  }

  getDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({loading: true})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://anujatravelserver.onrender.com/packages/${id}`
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
      this.setState({
        packageDetails: data.packageDetails,
        reviews: data.reviews,
        price: data.packageDetails.price,
        loading: false,
      })
    } else {
      this.setState({loading: false})
    }
  }

  getImages = () => {
    const {packageDetails} = this.state
    const {images} = packageDetails
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2500,
    }
    if (images) {
      return (
        <>
          <Slider {...settings}>
            {images.map((image, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} className="slide-container">
                <img src={image} alt="location" className="slick-image" />
              </div>
            ))}
          </Slider>
        </>
      )
    }
    return null
  }

  packageOverview = () => {
    const {packageDetails} = this.state
    const {
      location,
      description,
      rating,
      places,
      price,
      inclusion,
    } = packageDetails
    if (places && inclusion) {
      return (
        <div className="package-detail-container">
          <p className="package-name center">{location}</p>
          <p className="package-name">
            Rating: <span>{rating}</span>
          </p>
          <p className="package-name">
            Description: <span>{description}</span>
          </p>
          <ul className="package-name">
            Places Covered:
            {places.map((each, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>{each}</li>
            ))}
          </ul>
          <ul className="package-name column">
            Inclusions:
            {inclusion.map((each, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>{each}</li>
            ))}
          </ul>
          <p className="package-name">
            Price: <span>{price}</span>
          </p>
        </div>
      )
    }
    return null
  }

  onMinus = () => {
    const {persons, packageDetails} = this.state
    const singlePerson = packageDetails.price
    if (persons > 1) {
      this.setState({persons: persons - 1, price: (persons - 1) * singlePerson})
    }
  }

  onPlus = () => {
    const {persons, packageDetails} = this.state
    const singlePerson = packageDetails.price
    this.setState({persons: persons + 1, price: (persons + 1) * singlePerson})
  }

  onDate = event => {
    this.setState({date: event.target.value})
  }

  onBookTour = async () => {
    const {price, date, persons, packageDetails} = this.state
    this.setState({bookLoading: true})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://anujatravelserver.onrender.com/bookings/`
    const bodyObj = {
      price: price + 200,
      date,
      persons,
      location: packageDetails.location,
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(bodyObj),
    }
    if (date === '') {
      // eslint-disable-next-line no-alert
      alert('Please Fill All details')
      this.setState({bookLoading: false})
    } else {
      const response = await fetch(url, options)
      if (response.ok === true) {
        const data = await response.json()
        this.setState({
          bookLoading: false,
          bookMsg: data.message,
          price: packageDetails.price,
          date: '',
          persons: 1,
        })
        setTimeout(() => {
          this.setState({bookMsg: ''})
        }, 3000)
      } else {
        this.setState({
          bookLoading: false,
          bookMsg: 'Try Again. Booking Failed',
        })
      }
    }
  }

  booknow = () => {
    const {
      packageDetails,
      date,
      persons,
      price,
      bookLoading,
      bookMsg,
    } = this.state
    if (price) {
      return (
        <>
          <p className="package-name center">Book Now</p>
          <p className="input">{packageDetails.location}</p>
          <input
            value={date}
            type="date"
            className="input"
            placeholder="Date"
            onChange={this.onDate}
          />
          <div className="plus-minus-container">
            <p className="persons">No.of Persons: </p>
            <AiOutlineMinusSquare
              size={30}
              cursor="pointer"
              type="button"
              onClick={this.onMinus}
            />
            <p className="number">{persons}</p>
            <AiOutlinePlusSquare
              size={30}
              cursor="pointer"
              type="button"
              onClick={this.onPlus}
            />
          </div>
          <p className="price">
            Price: <span>{price}/-</span>
          </p>
          <p className="price">
            Tax: <span>200/-</span>
          </p>
          <hr />
          <p className="price">
            <b>Total: </b>
            <span>
              <b>{price + 200}</b>
            </span>
          </p>
          <button
            type="button"
            className="signup auto"
            onClick={this.onBookTour}
          >
            {bookLoading ? (
              <Loader type="Oval" color="#ffff" height={20} width={20} />
            ) : (
              'Book Now'
            )}
            {bookMsg && <p className="msg">{bookMsg}</p>}
          </button>
        </>
      )
    }
    return null
  }

  onRating = count => {
    this.setState(prevState => ({
      starIcons: prevState.starIcons.map((eachStar, index) => index < count),
      ratingCount: count,
    }))
  }

  onReview = event => {
    this.setState({userReview: event.target.value})
  }

  onAddReview = async () => {
    const {ratingCount, userReview} = this.state
    this.setState({reviewLoading: true})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://anujatravelserver.onrender.com/packages/${id}/feedback`
    const bodyObj = {rating: ratingCount, review: userReview}
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(bodyObj),
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      this.setState(
        {
          reviewLoading: false,
          ratingCount: 0,
          starIcons: array,
          userReview: '',
        },
        this.getDetails,
      )
    } else {
      this.setState({
        reviewLoading: false,
      })
    }
  }

  getRandomColor = () => {
    const red = Math.floor(Math.random() * 256)
    const green = Math.floor(Math.random() * 256)
    const blue = Math.floor(Math.random() * 256)
    const alpha = Math.random()
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }

  getReviews = () => {
    const {reviews, starIcons, reviewLoading, userReview} = this.state
    const reviewCount = reviews.length
    return (
      <div className="reviews-container-package">
        <p className="package-name center">Reviews({reviewCount})</p>
        <div className="stars">
          {starIcons.map((eachStar, index) =>
            eachStar === true ? (
              <AiFillStar
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                color="hsl(26,96%,50%)"
                size={30}
                cursor="pointer"
              />
            ) : (
              <AiOutlineStar
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                color="hsl(26,96%,50%)"
                size={30}
                cursor="pointer"
                onClick={() => this.onRating(index + 1)}
              />
            ),
          )}
        </div>
        <input
          className="input-login style"
          type="text"
          placeholder="Your Review"
          onChange={this.onReview}
          value={userReview}
        />
        <button type="button" className="signup" onClick={this.onAddReview}>
          {reviewLoading ? (
            <Loader type="Oval" height={25} width={25} color="#fff" />
          ) : (
            'Add'
          )}
        </button>
        {reviews.map((each, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className="review-person" key={index}>
            <div className="name-rating">
              <div className="username">
                <p
                  style={{backgroundColor: this.getRandomColor()}}
                  className="random-color"
                >
                  {each.username[0]}
                </p>
                <p>
                  <b>{each.username}</b>
                </p>
              </div>
              <p className="rating-icon">
                <b>{each.rating}</b>
                <span>
                  <AiFillStar size={25} color="hsl(26, 96%, 50%)" />
                </span>
              </p>
            </div>
            <p className="user-review">{each.review}</p>
          </div>
        ))}
      </div>
    )
  }

  renderLoading = () => {
    const placesArray = [0, 1, 2, 3, 4]
    return (
      <div className="package-view-section">
        <div className="package-content">
          {/* Shimmer animation for images */}
          <div className="slide-container">
            <Skeleton className="slick-image" />
          </div>
          <div className="package-detail-container">
            <Skeleton className="package-name center" width={100} />
            <Skeleton className="package-name" width={100} />
            <p className="package-name" style={{width: '100%'}} />
            <Skeleton className="package-name" width={100} />
            {placesArray.map(each => (
              <Skeleton key={each} />
            ))}
            <Skeleton className="package-name column" />
          </div>
        </div>
        <div className="booknow-container">
          <Skeleton className="package-name center" width={200} />
          <Skeleton className="input" width={300} />
          <Skeleton className="input" width={300} />
          <div className="plus-minus-container">
            <Skeleton className="persons" width={100} />
            <Skeleton width={30} height={30} />
            <Skeleton className="number" width={30} height={30} />
            <Skeleton width={30} height={30} />
          </div>
          <Skeleton className="price" width={300} />
          <Skeleton className="price" width={300} />
          <Skeleton width={300} height={10} />
          <Skeleton className="price" width={300} />
          <Skeleton className="signup auto" />
        </div>
      </div>
    )
  }

  renderPackage = () => {
    const {loading} = this.state

    if (loading) {
      return this.renderLoading()
    }

    return (
      <div className="package-view-section">
        <div className="package-content">
          {this.getImages()}
          {this.packageOverview()}
          {this.getReviews()}
        </div>
        <div className="booknow-container">{this.booknow()}</div>
      </div>
    )
  }

  render() {
    return (
      <div className="view-page">
        <Header />
        {this.renderPackage()}
        <Footer />
      </div>
    )
  }
}

export default PackageView
