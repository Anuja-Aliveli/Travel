import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import HeaderMain from '../HeaderMain'
import Footer from '../Footer'
import './index.css'

const logConstants = {
  login: 'LOGIN',
  user: 'USER',
  question: 'QUESTION',
  reset: 'RESET',
}

class Login extends Component {
  state = {
    logStatus: logConstants.login,
    username: '',
    password: '',
    confirmPassword: '',
    message: '',
    userMsg: '',
    ansErr: '',
    pwdErr: '',
    isLoading: false,
    userLoading: false,
    pwdloading: false,
    answer: '',
    apiAnswer: '',
    question: '',
  }

  onUsername = event => {
    this.setState({username: event.target.value, message: '', userMsg: ''})
  }

  onAnswer = event => {
    this.setState({answer: event.target.value, ansErr: ''})
  }

  onPassword = event => {
    this.setState({password: event.target.value})
  }

  onConfirmPassword = event => {
    this.setState({confirmPassword: event.target.value})
  }

  onReset = async () => {
    const {password, confirmPassword, username} = this.state
    this.setState({pwdloading: true})
    if (password === confirmPassword) {
      const url = `https://anujatravelserver.cyclic.cloud/forgot/reset`
      const bodyObj = {username, password}
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyObj),
      }
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok === true) {
        this.setState({
          message: '',
          userMsg: '',
          pwdErr: '',
          password: '',
          username: '',
          logStatus: logConstants.login,
        })
      } else {
        this.setState({pwdErr: data.error, pwdloading: false})
      }
    } else {
      this.setState({pwdErr: 'Password Did not match', pwdloading: false})
    }
  }

  onQuestion = async () => {
    const {answer, apiAnswer} = this.state
    if (answer === apiAnswer) {
      this.setState({logStatus: logConstants.reset})
    } else {
      this.setState({ansErr: 'Invalid Answer'})
    }
  }

  onUser = async () => {
    const {username} = this.state
    this.setState({userLoading: true})
    if (username === '') {
      // eslint-disable-next-line no-alert
      alert('Please Enter Username')
      this.setState({userLoading: false})
    } else {
      const url = `https://anujatravelserver.cyclic.cloud/forgot/question?username=${username}`
      const response = await fetch(url)
      const data = await response.json()
      if (response.ok === true) {
        this.setState({
          question: data.question,
          apiAnswer: data.answer,
          userLoading: false,
          logStatus: logConstants.question,
        })
      } else {
        this.setState({userMsg: data.error, userLoading: false})
      }
    }
  }

  onForgot = () => {
    this.setState({
      username: '',
      password: '',
      message: '',
      logStatus: logConstants.user,
    })
  }

  onLogin = async event => {
    event.preventDefault()
    this.setState({isLoading: true})
    const {username, password} = this.state
    const url = `https://anujatravelserver.cyclic.cloud/login/`
    const bodyObj = {username, password}
    if (username === '' || username === '') {
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
        const {jwtToken} = data
        Cookies.set('jwt_token', jwtToken, {expires: 30})
        this.setState({isLoading: false})
        const {history} = this.props
        history.replace('/home')
      } else {
        this.setState({isLoading: false, message: data.error})
      }
    }
  }

  renderQuestion = () => {
    const {question, ansErr, answer} = this.state
    return (
      <>
        <p className="question">{question}</p>
        <input
          className="input-login"
          type="text"
          placeholder="Your Answer"
          value={answer}
          onChange={this.onAnswer}
        />
        <button className="signup" type="button" onClick={this.onQuestion}>
          Ok
        </button>
        {ansErr !== '' && <p className="red">{ansErr}</p>}
      </>
    )
  }

  renderReset = () => {
    const {password, confirmPassword, pwdErr, pwdloading} = this.state
    return (
      <>
        <p className="register-head">Reset</p>
        <input
          className="input-login"
          type="password"
          placeholder="Password"
          value={password}
          onChange={this.onPassword}
        />
        <input
          className="input-login"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={this.onConfirmPassword}
        />
        <button type="button" className="signup" onClick={this.onReset}>
          {pwdloading === true ? (
            <Loader type="Oval" color="#ffffff" height={25} width={25} />
          ) : (
            'Ok'
          )}
        </button>
        {pwdErr !== '' && <p className="red">{pwdErr}</p>}
      </>
    )
  }

  renderUser = () => {
    const {username, userMsg, userLoading} = this.state
    return (
      <>
        <p className="question">Enter Username?</p>
        <input
          type="text"
          className="input-login"
          placeholder="Username"
          value={username}
          onChange={this.onUsername}
        />
        <button type="button" className="signup" onClick={this.onUser}>
          {userLoading === true ? (
            <Loader type="Oval" color="#ffffff" height={25} width={25} />
          ) : (
            'Ok'
          )}
        </button>
        {userMsg !== '' && <p className="red">{userMsg}</p>}
      </>
    )
  }

  renderLogin = () => {
    const {username, password, isLoading, message} = this.state
    return (
      <>
        <p className="register-head">Login</p>
        <form className="register-container" onSubmit={this.onLogin}>
          <input
            className="input-login"
            type="text"
            value={username}
            placeholder="Username"
            onChange={this.onUsername}
          />
          <input
            className="input-login"
            type="password"
            value={password}
            placeholder="Password"
            onChange={this.onPassword}
          />
          <p className="login-forgot" type="button" onClick={this.onForgot}>
            Forgot Password?
          </p>
          <button type="submit" className="signup">
            {isLoading === true ? (
              <Loader type="Oval" color="#ffffff" height={25} width={25} />
            ) : (
              'Login'
            )}
          </button>
          {message !== '' && <p className="red">{message}</p>}
        </form>
      </>
    )
  }

  renderResult = () => {
    const {logStatus} = this.state

    switch (logStatus) {
      case logConstants.login:
        return this.renderLogin()
      case logConstants.user:
        return this.renderUser()
      case logConstants.question:
        return this.renderQuestion()
      case logConstants.reset:
        return this.renderReset()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="login-page">
        <HeaderMain />
        <div className="login-section">
          <img
            className="login-image"
            alt="login"
            src="https://res.cloudinary.com/dgkw0cxnh/image/upload/v1692001312/Travel/start/login_fgdjgc.avif"
          />
          <div className="register-container">{this.renderResult()}</div>
        </div>
        <Footer />
      </div>
    )
  }
}
export default Login
