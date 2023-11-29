import React, { useState } from "react";
import "./styles/LoginScreen.css";
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { SHA256, enc } from "crypto-js";
import db from "../db";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/login";
import { pb } from "../../App";
import { switchLoading } from "../../redux/loading";
import LoadingScreen from "./LoadingScreenView";

interface IProps {}

const LoginScreen: React.FC<IProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSigningUp) {
      // post login data to server db
      const newUser = {
        username: (event.target as any).name.value,
        email: (event.target as any).username.value,
        password: (event.target as any).password.value,
        passwordConfirm: (event.target as any).password.value,
      }
      dispatch(switchLoading());
      pb.collection("users").create(newUser).then((res) => {
        dispatch(switchLoading());
      }).catch(err => {
        alert("Error signing up");
      });

      setIsSigningUp(false);
    } else {
      try {
        dispatch(switchLoading());
        pb
          .collection("users")
          .authWithPassword((event.target as any).username.value, (event.target as any).password.value).then((res) => {
            dispatch(loginUser(res.record.id));
            dispatch(switchLoading());
            navigate("/Dashboard");
          }).catch(err => {
            dispatch(switchLoading());
            alert("Invalid Credentials, try again")
          });

      } catch (error) {
        console.log(error);
        console.log("Login Failed");
      }

      // -----
      // const passHash = SHA256((event.target as any).password.value).toString(
      //   enc.Hex
      // );
      // const user = db.users.filter(
      //   (user) =>
      //     user.email === (event.target as any).username.value &&
      //     user.password_hash === passHash
      // );
      // if (user.length === 1) {
      //   console.log("Login Successful");

      //   dispatch(loginUser(user[0].id));

      //   navigate("/Dashboard");
      // } else {
      //   console.log("Login Failed");
      // }
    }
  };

  return (
    <div>
    <LoadingScreen />
    <div className="login-container">
      <div className="card m-5 py-5 login-box">
        <div className="card-header bg-white">
          <h1>{isSigningUp ? "Sign Up" : "Login"}</h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label
                htmlFor="name"
                className={`${isSigningUp ? "" : "hidden"}`}
              >
                Full Name
              </label>
              <input
                type="text"
                className={`form-control ${
                  isSigningUp ? "" : "hidden"
                } input-field rounded`}
                id="name"
                name="name"
                required={isSigningUp}
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
                className={`link-button ${isSigningUp ? "hidden" : ""}`}
                onClick={() => {
                  setIsSigningUp(true);
                }}
              >
                Sign up
              </button>
            </div>
            <button type="submit" className="mt-3 btn-primary btn btn-rounded">
              {isSigningUp ? "Sign Up" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginScreen;
