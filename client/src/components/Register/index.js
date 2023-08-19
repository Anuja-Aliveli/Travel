import {Component} from 'react'
import Loader from 'react-loader-spinner'
import HeaderMain from '../HeaderMain'
import Footer from '../Footer'
import './index.css'

class Register extends Component {
  state = {
    username: '',
    name: '',
    password: '',
    gender: 'female',
    question: 'What is your Favorite Food?',
    answer: '',
    isLoading: false,
    message: '',
  }

  componentWillUnmount = () => {
    this.setState({
      username: '',
      name: '',
      password: '',
      gender: 'female',
      question: 'What is your Favorite Food?',
      answer: '',
      isLoading: false,
      message: '',
    })
  }

  onUsername = event => {
    this.setState({username: event.target.value})
  }

  onName = event => {
    this.setState({name: event.target.value})
  }

  onPassword = event => {
    this.setState({password: event.target.value})
  }

  onGender = event => {
    this.setState({gender: event.target.value})
  }

  onQuestion = event => {
    this.setState({question: event.target.value})
  }

  onAnswer = event => {
    this.setState({answer: event.target.value})
  }

  onRegister = async event => {
    event.preventDefault()
    this.setState({isLoading: true})
    const {username, name, gender, question, answer, password} = this.state
    const url = `https://anujatravelserver.cyclic.cloud/register/`
    const bodyObj = {username, name, gender, question, answer, password}
    console.log(bodyObj)
    let isEmpty = false
    // eslint-disable-next-line no-restricted-syntax
    for (const value of Object.values(bodyObj)) {
      if (value === '') {
        isEmpty = true
        break
      }
    }

    if (isEmpty) {
      // eslint-disable-next-line no-alert
      alert('Please Fill All Details')
      this.setState({isLoading: false})
    } else {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyObj),
      }

      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok === true) {
        this.setState({isLoading: false, message: data.message})
        setTimeout(() => {
          const {history} = this.props
          history.replace('/login')
        }, 2000)
      } else {
        this.setState({isLoading: false, message: data.error})
      }
    }
  }

  render() {
    const {
      isLoading,
      message,
      username,
      name,
      password,
      gender,
      question,
      answer,
    } = this.state
    const colorName = message[0] === 'S' ? 'green' : 'red'
    return (
      <div className="page-container">
        <HeaderMain />
        <div className="register-section">
          <img
            className="register-image"
            src="https://res.cloudinary.com/dgkw0cxnh/image/upload/v1691938551/Travel/start/register_gk35an.avif"
            alt="register"
          />
          <form className="register-container" onSubmit={this.onRegister}>
            <p className="register-head">Register</p>
            <input
              className="input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={this.onUsername}
            />
            <input
              className="input"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={this.onName}
            />
            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.onPassword}
            />
            <select className="input" onChange={this.onGender} value={gender}>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
            <select
              className="input"
              onChange={this.onQuestion}
              value={question}
            >
              <option value="What is your Favorite Food?">
                What is your Favorite Food?
              </option>
              <option value="What is your School Name?">
                What is your School Name?
              </option>
              <option value="What is your Best Friend Name?">
                What is your Best Friend Name?
              </option>
            </select>
            <input
              className="input"
              type="text"
              placeholder="Your Answer"
              value={answer}
              onChange={this.onAnswer}
            />
            <button type="submit" className="signup">
              {isLoading === true ? (
                <Loader type="Oval" color="#ffffff" height={25} width={25} />
              ) : (
                'Sign Up'
              )}
            </button>
            {message !== '' && <p className={colorName}>{message}</p>}
          </form>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Register
