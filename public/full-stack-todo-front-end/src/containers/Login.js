import React, { Component } from 'react';
import App from './App';
import axios from 'axios';

const { localStorage } = window;

class Login extends Component{
  constructor(props){
    super(props);

    this.state = {
      showSignIn: true,
      emailText: '',
      passwordText: '',
      retypePasswordText: '',
      isLoggedIn: false
    }
  }

  componentDidMount = () => {
    if (localStorage.getItem('x-auth')) this.setState({ isLoggedIn: true });
  }

  sendSignUpData = (e) => {
    e.preventDefault();
    axios.post(`/users/`, {
      email: this.state.emailText,
      password: this.state.passwordText
    })
    .then(data =>{
      // save token to local storage
      localStorage.setItem('x-auth', data.headers['x-auth']);
      console.log(data.headers);
      this.setState({ isLoggedIn: true });
    })
    .catch(e => console.log(e));
  }

  sendLoginData = (e) => {
    e.preventDefault();
    axios.post(`/users/login`, {
      email: this.state.emailText,
      password: this.state.passwordText
    })
    .then(data => {
      //save token to local storage
      localStorage.setItem('x-auth', data.headers['x-auth']);
      console.log(data.headers)
      // show rest of app
      this.setState({ isLoggedIn: true });
    })
    .catch(e => console.log(e));
  }

  togglePage = (e) => {
    e.preventDefault();
    this.setState({
      showSignIn: !this.state.showSignIn
    })
  }

  renderSignIn = () =>
    (
      <form className="form-horizontal">
        <fieldset>
          <legend>Form Name</legend>

          <div className="form-group">
            <label className="col-md-4 control-label">Email:</label>
            <div className="col-md-4">
            <input id="Email"
              name="Email"
              type="text"
              placeholder="myemail@domain.com"
              className="form-control input-md"
              required=""
              value={ this.state.emailText }
              onChange={ (e) => { this.setState({ emailText: e.target.value }); } }
            />
            </div>
          </div>

          <div className="form-group">
            <label className="col-md-4 control-label">Password:</label>
            <div className="col-md-4">
              <input id="Password"
                name="Password"
                type="password"
                className="form-control input-md"
                required=""
                value={ this.state.passwordText }
                onChange={ (e) => { this.setState({ passwordText: e.target.value }) } }
              />
            </div>
          </div>

          <div className="form-group">
            <label className="col-md-4 control-label"></label>
            <div className="col-md-8">
              <button
                id="button1"
                name="button1"
                className="btn btn-info"
                onClick={this.sendLoginData}
                >Sign In </button>
              <button
                id="button2"
                name="button2"
                className="btn btn-success"
                onClick={this.togglePage}
                >Sign-Up</button>
            </div>
          </div>

        </fieldset>
      </form>
    )

  renderSignUp = () => (
    <form className="form-horizontal">
      <fieldset>
        <legend>Form Name</legend>

        <div className="form-group">
          <label className="col-md-4 control-label">Email:</label>
          <div className="col-md-4">
          <input
            id="Email"
            name="Email"
            type="text"
            placeholder="myemail@domain.com"
            className="form-control input-md"
            required=""
            value={ this.state.emailText }
            onChange={ (e) => { this.setState({ emailText: e.target.value }); } }
          />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label">Password:</label>
          <div className="col-md-4">
            <input
              id="Password"
              name="Password"
              type="password"
              className="form-control input-md"
              required=""
              value={ this.state.passwordText }
              onChange={ (e) => { this.setState({ passwordText:e.target.value }) } }
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label">Re-type Password:</label>
          <div className="col-md-4">
            <input id="Password"
              name="Password"
              type="text"
              className="form-control input-md"
              required=""
              value={ this.state.retypePasswordText }
              onChange={ (e) => { this.setState({ retypePasswordText: e.target.value }) } }
            />
          </div>
        </div>

        <div className="form-group">
          <label className="col-md-4 control-label"></label>
          <div className="col-md-8">
            <button
              id="button1"
              name="button1"
              className="btn btn-info"
              onClick={this.togglePage}
              >Sign In </button>
            <button
              id="button2"
              name="button2"
              className="btn btn-success"
              onClick={this.sendSignUpData}
              >Sign-Up</button>
          </div>
        </div>

      </fieldset>
    </form>
  )

  render(){
    if (!this.state.isLoggedIn){
    return (
      <div>
          {
            this.state.showSignIn ?
            this.renderSignIn()
            :
            this.renderSignUp()
          }
        </div>
      )
    }
    else{
      return <App />;
    }
  }
}

export default Login;
