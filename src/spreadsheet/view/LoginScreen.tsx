import React, { Component, useContext } from "react";
import "./styles/LoginScreen.css";
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { SHA256, enc } from "crypto-js";
import db from "../db";
import { useNavigate } from "react-router-dom";
import { AppContext, AppContextType } from "../../context";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/login";

class LoginScreen extends Component<IProps, IState> {
  static contextType = AppContext;

  constructor(props: IProps) {
    super(props);
    this.state = { authenticated: false, isSigningUp: false };
  }

  handleSubmit = (event: any) => {
    const { setLogin, navigate } = this.context as AppContextType;
    event.preventDefault();
    const dispatch = useDispatch();
    
    // Not currently secure method, should send server to request instead of using interanl db

    if (this.state.isSigningUp) {
      // post login data to server db
      this.setState({...this.state, isSigningUp: false });
    } else {
      const passHash = SHA256(event.target.password.value).toString(enc.Hex);
      const user = db.users.filter(
        (user) =>
          user.email === event.target.username.value &&
          user.password_hash === passHash
      );
      if (user.length === 1) {
        console.log("Login Successful");
  
        setLogin({
          id: user[0].id,
        });

        dispatch(loginUser(user[0].id))

        navigate("/Dashboard");
      } else {
        console.log("Login Failed");
      }

    }
  };

  render() {
    return (
      <div className="login-container">
        <div className="card m-5 py-5 login-box">
          <div className="card-header bg-white">
            <h1>{this.state.isSigningUp ? "Sign Up" : "Login"}</h1>
          </div>
          <div className="card-body">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className={`${this.state.isSigningUp ? '' : 'hidden'}`}>Full Name</label>
                <input
                  type="text"
                  className={`form-control ${this.state.isSigningUp ? '' : 'hidden'} input-field rounded`}
                  id="name"
                  name="name"
                  required={this.state.isSigningUp}
                />
                <label htmlFor="username">Email</label>
                <input
                  type="email"
                  className="form-control input-field rounded"
                  id="username"
                  name="username"
                  required
                />
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control input-field"
                  id="password"
                  name="password"
                  required
                />
                <button 
                type="button"
                className={`link-button ${this.state.isSigningUp ? 'hidden': ''}`} 
                onClick={() => {
                  this.setState({...this.state, isSigningUp: true})
                }} >
                  Sign up</button>
              </div>
              <button
                type="submit"
                className="mt-3 btn-primary btn btn-rounded"
              >
                {this.state.isSigningUp ? "Sign Up" : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

interface IProps {}

interface IState {
  authenticated: boolean;
  isSigningUp: boolean;
}

export default LoginScreen;
