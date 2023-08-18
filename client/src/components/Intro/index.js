import {Link} from 'react-router-dom'
import {
  FaHiking,
  FaMapMarkedAlt,
  FaHotel,
  FaUtensils,
  FaPlane,
} from 'react-icons/fa'
import {GiLightBackpack, GiCampingTent, GiCampfire} from 'react-icons/gi'
import HeaderMain from '../HeaderMain'
import Footer from '../Footer'
import './index.css'

const results = [
  {
    reviewId: 5,
    review:
      "The Maldives, a tropical paradise nestled in the heart of the Indian Ocean, is a dream destination that surpasses all expectations. With its overwater bungalows, pristine white-sand beaches, and turquoise waters teeming with vibrant marine life, the Maldives offers a surreal escape from the ordinary. Snorkeling and diving enthusiasts are treated to a world-class underwater playground, exploring coral reefs and encountering gentle giants like manta rays and whale sharks. The tranquil ambiance, luxurious resorts, and stunning sunsets make the Maldives a romantic haven for couples and a serene retreat for anyone seeking solace in nature's embrace.",
    reviewImage:
      'https://res.cloudinary.com/dgkw0cxnh/image/upload/v1691674151/Travel/video/beach_rgljdh.jpg',
    reviewVideo:
      'https://res.cloudinary.com/dgkw0cxnh/video/upload/v1691673320/Travel/video/video1_hjdcz0.mp4',
  },
  {
    reviewId: 6,
    review:
      "Europe, a tapestry of rich history and diverse cultures, beckons travelers with its timeless allure. From the romantic streets of Paris to the historic ruins of Rome, Europe boasts a myriad of experiences that cater to every taste. Explore the quaint villages of the Swiss Alps, marvel at the architectural marvels of Barcelona, or immerse yourself in the artistic heritage of Florence. The continent's efficient transportation networks allow you to hop between countries and languages effortlessly. With a blend of ancient charm and modern sophistication, Europe invites you to indulge in its art, cuisine, and traditions, all while traversing landscapes that have inspired countless tales throughout the ages.",
    reviewImage:
      'https://res.cloudinary.com/dgkw0cxnh/image/upload/v1691674161/Travel/video/adventure_louzz5.jpg',
    reviewVideo:
      'https://res.cloudinary.com/dgkw0cxnh/video/upload/v1691673321/Travel/video/video2_eilnrf.mp4',
  },
]

const Intro = () => {
  const renderIntro = () => (
    <>
      <div className="success-container" key={results[0].reviewId}>
        <div className="review-container align-media">
          <p className="content-head">Maldives</p>
          <p className="content-para">{results[0].review}</p>
        </div>
        <div className="data-container">
          <div className="video-image align">
            <video autoPlay loop muted className="video">
              <source src={results[0].reviewVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="video-image">
            <div className="image-container">
              <img
                className="image-front"
                src={results[0].reviewImage}
                alt="maldives"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="success-container" key={results[1].reviewId}>
        <div className="review-container order">
          <p className="content-head">Europe</p>
          <p className="content-para">{results[1].review}</p>
        </div>
        <div className="data-container">
          <div className="video-image order">
            <video autoPlay loop muted className="video">
              <source src={results[1].reviewVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="video-image align">
            <div className="image-container">
              <img
                className="image-front"
                src={results[1].reviewImage}
                alt="europe"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const services = () => (
    <div className="service-section">
      <p className="service">Our Services</p>
      <ul className="service-list">
        <li>
          <FaHiking className="icon" />
          <p className="service-name">Adventure</p>
        </li>
        <li>
          <FaHotel className="icon" />
          <p className="service-name">Hotels</p>
        </li>
        <li>
          <FaMapMarkedAlt className="icon" />
          <p className="service-name">Tour Guide</p>
        </li>
        <li>
          <FaUtensils className="icon" />
          <p className="service-name">Food & Drinks</p>
        </li>
        <li>
          <FaPlane className="icon" />
          <p className="service-name">Fastest Travel</p>
        </li>
        <li>
          <GiLightBackpack className="icon" />
          <p className="service-name">Trekking</p>
        </li>
        <li>
          <GiCampingTent className="icon" />
          <p className="service-name">Camping</p>
        </li>
        <li>
          <GiCampfire className="icon" />
          <p className="service-name">Camp Fire</p>
        </li>
      </ul>
    </div>
  )

  return (
    <div className="intro-container">
      <HeaderMain />
      <div className="start-section">
        <p className="start-head">Take only memories, leave only footprints.</p>
        <p className="start-para">Choose your destinations</p>
        <Link to="/home">
          <button type="button" className="explore">
            Explore Now
          </button>
        </Link>
      </div>
      <h1 className="popular">Explore our Popular Destinations</h1>
      <p className="bio">
        The most beautiful in the world is, of course, the world itself
      </p>
      {renderIntro()}
      {services()}
      <Footer />
    </div>
  )
}

export default Intro
