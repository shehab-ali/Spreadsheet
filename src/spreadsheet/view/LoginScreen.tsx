import React, { Component } from 'react';
import './styles/LoginScreen.css';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import { FaEnvelope, FaLock} from 'react-icons/fa';
import { SHA256, enc } from 'crypto-js';
import db from '../db';
import { useNavigate } from 'react-router-dom';
import { FileSystemView } from './FileSystemView';


class LoginScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { authenticated: false};
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    // Not currently secure method, should send server to request instead of using interanl db  

    const passHash = SHA256(event.target.password.value).toString(enc.Hex);
    const user = db.users.filter(user => user.email === event.target.username.value && user.password_hash === passHash);
    if (user.length === 1) {
      console.log("Login Successful");
      this.setState({authenticated: true});

    } else {
      console.log("Login Failed");
    }

  }

  render() {
    return (
      <div className="login-container">
          <div className="card m-5 py-5 login-box">
            <div className="card-header bg-white"><h1>Login</h1></div>
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
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
                </div>
                <button type="submit" className="mt-3 btn-primary btn btn-rounded">Login</button>
              </form>
            </div>
          </div>
      </div>
    );
  }
}

interface IProps {
}

interface IState {
    authenticated: boolean;
}



export default LoginScreen;