import {Component} from 'react'
import {Link} from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-loading-skeleton/dist/skeleton.css'
import {AiFillStar, AiOutlineStar} from 'react-icons/ai'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

class Home extends Component {
  state = {
    destinations: [],
    gallery: [],
    reviews: [],
    isLoading: false,
  }

  componentDidMount = () => {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({isLoading: true})
    const url = `https://anujatravelserver.cyclic.cloud/home/`
    const jwtToken = Cookies.get('jwt_token')
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
      let {destinations, gallery, reviews} = data
      gallery = gallery.map(each => ({
        galId: each.gal_id,
        url: each.url,
      }))
      reviews = reviews.map(each => ({
        reviewId: each.review_id,
        name: each.name,
        review: each.review,
      }))
      // eslint-disable-next-line no-self-assign
      destinations = destinations
      this.setState({destinations, gallery, reviews, isLoading: false})
    } else {
      this.setState({isLoading: false})
    }
  }

  heroSection = () => (
    <div className="start-home">
      <p className="start-head">Take only memories, leave only footprints.</p>
      <p className="start-para">Choose your destinations</p>
      <Link to="/packages">
        <button type="button" className="explore">
          Explore Packages
        </button>
      </Link>
    </div>
  )

  destinations = () => {
    const {destinations} = this.state
    return (
      <>
        <p className="service">50% Discount</p>
        <div className="destination-container">
          {destinations.map(each => (
            <div className="location-container" key={each.id}>
              <div className="package-image-container">
                <img
                  className="package-image"
                  src={each.image}
                  alt={each.location}
                />
              </div>
              <div className="details-container">
                <div className="star-container">
                  <p className="package-name">{each.location}</p>
                  <div className="stars">
                    <AiFillStar color="hsl(26,96%,50%)" size={20} />
                    <AiFillStar color="hsl(26,96%,50%)" size={20} />
                    <AiFillStar color="hsl(26,96%,50%)" size={20} />
                    <AiFillStar color="hsl(26,96%,50%)" size={20} />
                    <AiOutlineStar color="hsl(26,96%,50%)" size={20} />
                  </div>
                </div>
                <p className="package-bio">{each.bio}</p>
                <Link to={`/packages/${each.id}`} className="read-more-link">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  gallery = () => {
    const {gallery} = this.state
    return (
      <>
        <p className="service">Our Gallery</p>
        <div className="gallery-container">
          {gallery.map(each => (
            <div key={each.galId} className="gallery-image-container">
              <img className="gallery-image" src={each.url} alt="gallery" />
            </div>
          ))}
        </div>
      </>
    )
  }

  reviews = () => {
    const {reviews} = this.state
    return (
      <>
        <p className="service">Reviews</p>
        <div className="review-container-home">
          {reviews.map(eachItem => (
            <div
              className={
                eachItem.reviewId === 2 || eachItem.reviewId === 4
                  ? 'review-container end'
                  : 'review-container'
              }
            >
              <div className="review-item">
                <p className="review-name">{eachItem.name}</p>
                <p className="review-para">{eachItem.review}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  renderLoading = () => {
    const destinationArray = [0, 1, 2, 3, 4, 5]
    const stars = [0, 1, 2, 3, 4]
    const galleryArray = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const reviewArray = [0, 1, 2, 3]
    return (
      <>
        <div className="start-home" style={{background: 'none'}}>
          <Skeleton className="start-head" width={300} />
          <Skeleton className="start-para" width={200} />
          <Skeleton className="explore" width={100} />
        </div>
        <Skeleton className="service" width={150} style={{margin: '10px'}} />
        <div className="destination-container">
          {destinationArray.map(each => (
            <div className="location-container size" key={each}>
              <div className="package-image-container">
                <Skeleton className="package-image" />
              </div>
              <div className="details-container">
                <div className="star-container">
                  <Skeleton width={120} />
                  <div className="stars">
                    {stars.map(eachStar => (
                      <Skeleton
                        width={20}
                        height={20}
                        key={eachStar}
                        style={{marginRight: '3px'}}
                      />
                    ))}
                  </div>
                </div>
                <Skeleton
                  className="package-bio"
                  width="100%"
                  height={20}
                  count={2}
                />
                <Skeleton
                  className="read-more-link"
                  width={100}
                  style={{marginTop: '10px'}}
                />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="service" width={150} style={{margin: '10px'}} />
        <div className="gallery-container">
          {galleryArray.map(each => (
            <div key={each} className="gallery-image-container">
              <Skeleton className="gallery-image" />
            </div>
          ))}
        </div>
        <Skeleton className="service" width={150} style={{margin: '10px'}} />
        <div className="review-container-home">
          {reviewArray.map(eachItem => (
            <div className="review-container" key={eachItem}>
              <div className="review-item" style={{textAlign: 'center'}}>
                <Skeleton className="review-name" width={150} />
                <Skeleton className="review-para" width="100%" count={4} />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  render() {
    const {isLoading} = this.state
    return (
      <div className="home-page">
        <Header />
        {isLoading && this.renderLoading()}
        {!isLoading && this.heroSection()}
        {!isLoading && this.destinations()}
        {!isLoading && this.gallery()}
        {!isLoading && this.reviews()}
        <Footer />
      </div>
    )
  }
}
export default Home
