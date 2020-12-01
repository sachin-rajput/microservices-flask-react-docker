import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import moment from 'moment'

import UsersList from './components/UsersList'
import About from './components/About'
import NavBar from './components/NavBar'
import Form from './components/forms/Form'
import Logout from './components/Logout'
import UserStatus from './components/UserStatus'
import Message from './components/Message'

const cookies = new Cookies()

class App extends Component {
  constructor() {
    super()
    this.state = {
      users: [],
      title: 'TestDriven.io',
      isAuthenticated: false,
      messageName: null, // new
      messageType: null // new
    }
    this.logoutUser = this.logoutUser.bind(this)
    this.loginUser = this.loginUser.bind(this)
    this.createMessage = this.createMessage.bind(this)
    this.removeMessage = this.removeMessage.bind(this)
  }

  componentDidMount() {
    this.getUsers()

    if (cookies.get('authToken')) {
      this.setState({ isAuthenticated: true })
    }
  }

  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => {
        this.setState({ users: res.data.data.users })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  logoutUser() {
    cookies.remove('authToken')
    this.setState({ isAuthenticated: false })
  }

  loginUser(token) {
    cookies.set('authToken', token, {
      path: '/',
      expires: moment(new Date()).add(1, 'hour').toDate()
    })
    this.setState({ isAuthenticated: true })
    this.getUsers()
    this.createMessage('Welcome!', 'success') // new
  }

  createMessage(name = 'Sanity Check', type = 'success') {
    this.setState({
      messageName: name,
      messageType: type
    })
    // new
    setTimeout(() => {
      this.removeMessage()
    }, 3000)
  }

  removeMessage() {
    this.setState({
      messageName: null,
      messageType: null
    })
  }

  render() {
    const { isAuthenticated } = this.state
    return (
      <div>
        <NavBar title={this.state.title} isAuthenticated={isAuthenticated} />
        <section className="section">
          <div className="container">
            {/* new */}
            {this.state.messageName && this.state.messageType && (
              <Message
                messageName={this.state.messageName}
                messageType={this.state.messageType}
                removeMessage={this.removeMessage} // new
              />
            )}
            <div className="columns">
              <div className="column is-half">
                <br />

                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => <UsersList users={this.state.users} />}
                  />
                  <Route exact path="/about" component={About} />
                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <Form
                        formType={'Register'}
                        isAuthenticated={this.state.isAuthenticated}
                        loginUser={this.loginUser}
                        createMessage={this.createMessage} // new
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <Form
                        formType={'Login'}
                        isAuthenticated={this.state.isAuthenticated}
                        loginUser={this.loginUser}
                        createMessage={this.createMessage} // new
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/logout"
                    render={() => (
                      <Logout
                        logoutUser={this.logoutUser}
                        isAuthenticated={this.state.isAuthenticated}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/status"
                    render={() => (
                      <UserStatus
                        isAuthenticated={this.state.isAuthenticated}
                      />
                    )}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default App
