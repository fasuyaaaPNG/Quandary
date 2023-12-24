'use client';

import "./style.css";
import { useState, useEffect } from 'react';

export default function Regist() {

  const [logo, setlogo] = useState('/assets/LoginRegister/QUANDARY.png');
  const [google, setgoogle] = useState('/assets/LoginRegister/google.png');
      
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
            START FOR FREE
          </p>
        </div>
        <div className="info">
          <p className="register">
            Create your account
          </p>
        </div>
        <div className="already2">
        <p>
          Already have an account? <a href="/login" className="signin">Login</a>
        </p>
      </div>
        <form action="">
          <div className="input">
            <input type="text" placeholder="Username" className="username" />
            <input type="email" placeholder="Email" className="email" />
            <input type="password" placeholder="Password" className="password" />
          </div>
          <div className="submit">
            <button className="enter">
              Sign up
            </button>
          </div>
        </form>
        <div className="google">
          <a href="" className="withgoogle">
            <div className="iconback">
              <img src={google} alt="" className="icon"/>
            </div>
            <button className="with">
              Sign up with Google
            </button>
          </a>
        </div>
      </div>
      <div className="already">
        <p>
          Already have an account? <a href="/login" className="signin">Login</a>
        </p>
      </div>
    </div>
  )
}
