'use client';

import "./style.css";
import { useState, useEffect } from 'react';

export default function Login() {

  const [logo, setlogo] = useState('/assets/LoginRegister/QUANDARY.png');
  const [google, setgoogle] = useState('/assets/LoginRegister/google.png');
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

     
      if (screenWidth >= 1024 && screenWidth <= 1920) {
        setlogo('/assets/LoginRegister/QUANDARY_dark.png');
        setgoogle('/assets/LoginRegister/google_dark.svg');
      } else {
        setlogo('/assets/LoginRegister/QUANDARY.png');
        setgoogle('/assets/LoginRegister/google.png');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container">
      <img src={logo}  alt="" className="logoAtas" />
      <img src="/assets/LoginRegister/background.jpg" className="background" alt="" />
      <div className="content">
        <div className="start">
          <p>
            WELCOME BACK
          </p>
        </div>
        <div className="info">
          <p className="register">
            Login to your account
          </p>
        </div>
        <div className="already2">
        <p>
          New user? <a href="/regist" className="signin">Sign up</a>
        </p>
      </div>
        <form >
          <div className="input">
            <input type="email" placeholder="Email" className="email"  />
            <input type="password" placeholder="Password" className="password"/>
          </div>
          <div className="submit">
            <button className="enter">
              Login
            </button>
          </div>
        </form>
        <div className="google">
          <a href="" className="withgoogle">
            <div className="iconback">
              <img src={google} alt="" className="icon"/>
            </div>
            <button className="with">
              Login with Google
            </button>
          </a>
        </div>
      </div>
      <div className="already">
        <p>
          Don't have an account yet? <a href="/regist" className="signin">Sign up</a>
        </p>
      </div>
    </div>
  )
}
