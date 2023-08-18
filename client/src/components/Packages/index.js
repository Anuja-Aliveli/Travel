import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillStar, AiOutlineStar} from 'react-icons/ai'
import Skeleton from 'react-loading-skeleton'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-loading-skeleton/dist/skeleton.css'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const tabs = [
  'India',
  'International',
  'Wildlife',
  'Adventure',
  'Beach',
  'Nature',
]

class Packages extends Component {
  state = {
    national: [],
    international: [],
    activeId: 0,
    loading: false,
  }

  componentDidMount = () => {
    this.getDetails()
  }

  getDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({loading: true})
    const url = `https://anujatravelserver.onrender.com/packages/`
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
        national: data.national,
        international: data.international,
        loading: false,
      })
    } else {
      this.setState({loading: false})
    }
  }

  onTab = index => {
    this.setState({activeId: index})
  }

  tabSection = () => {
    const {activeId} = this.state
    return (
      <div className="tabs-section">
        {tabs.map((each, index) => (
          <button
            className={activeId === index ? 'signup tab' : 'login tab'}
            type="button"
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={() => this.onTab(index)}
          >
            {each}
          </button>
        ))}
      </div>
    )
  }

  renderDisplay = array => (
    <div className="destination-container">
      {array.map(each => (
        <div className="location-container size" key={each.id}>
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
  )

  renderNational = () => {
    const {national} = this.state
    return this.renderDisplay(national)
  }

  renderInternational = () => {
    const {international} = this.state
    return this.renderDisplay(international)
  }

  renderWildLife = () => {
    const {national, international} = this.state
    const wildlife = [national[9], international[7], international[11]]
    return this.renderDisplay(wildlife)
  }

  renderAdventure = () => {
    const {national, international} = this.state
    const adventure = [
      national[7],
      national[8],
      international[0],
      international[6],
      international[10],
    ]
    return this.renderDisplay(adventure)
  }

  renderBeach = () => {
    const {national, international} = this.state
    const beach = [
      national[0],
      national[4],
      national[1],
      international[4],
      international[3],
      international[1],
    ]
    return this.renderDisplay(beach)
  }

  renderNature = () => {
    const {national, international} = this.state
    const nature = [
      national[6],
      national[3],
      national[8],
      international[8],
      international[5],
      international[9],
    ]
    return this.renderDisplay(nature)
  }

  displayPackages = () => {
    const {activeId} = this.state
    switch (activeId) {
      case 0:
        return this.renderNational()
      case 1:
        return this.renderInternational()
      case 2:
        return this.renderWildLife()
      case 3:
        return this.renderAdventure()
      case 4:
        return this.renderBeach()
      case 5:
        return this.renderNature()
      default:
        return null
    }
  }

  renderLoading = () => {
    const arraySize = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const stars = [0, 1, 2, 3, 4]
    return (
      <>
        <div className="tabs-section">
          {tabs.map((each, index) => (
            <button
              className="tab"
              type="button"
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              style={{
                marginRight: '20px',
                borderRadius: '10px',
                border: 'none',
              }}
            >
              <Skeleton />
            </button>
          ))}
        </div>
        <div className="destination-container">
          {arraySize.map((each, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className="location-container size" key={index}>
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
      </>
    )
  }

  render() {
    const {loading} = this.state
    return (
      <div className="packages-page">
        <Header />
        {loading && this.renderLoading()}
        {!loading && this.tabSection()}
        {!loading && this.displayPackages()}
        <Footer />
      </div>
    )
  }
}
export default Packages
