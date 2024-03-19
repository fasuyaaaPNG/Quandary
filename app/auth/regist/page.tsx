'use client';

import "./style.css";
import { useState, useEffect } from 'react';
import supabase from "../../server/supabaseClient";
import { setCookie, parseCookies } from 'nookies';

const Regist = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [emailExistsError, setEmailExistsError] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!username || !email || !password) {
      setFormError('All fields are required');
      const errorContainer = document.getElementById('error');
      if (errorContainer) {
        errorContainer.classList.add('error-show');
      }
      return;
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from('Users')
      .select('email')
      .eq('email', email);
  
    if (existingUserError) {
      console.error(existingUserError);
      setFormError('Error checking existing email');
      return;
    }
  
    if (existingUser && existingUser.length > 0) {
      setEmailExistsError(true);
      return;
    }

    const { data, error } = await supabase
      .from('Users')
      .insert([{ username, email, password }]);
  
    if (error) {
      console.error(error);
      setFormError('Error creating user');
      const errorContainer = document.getElementById('error');
      if (errorContainer) {
        errorContainer.classList.add('error-show');
      }
    } else {
      setCookie(null, 'is_login', email, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      console.log('Sesi aktif:', parseCookies().is_login);
      window.location.href = '/redirect';
      console.log(data)
    }
  };
  
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
          Already have an account? <a href="/auth/login" className="signin">Login</a>
        </p>
      </div>
        <form onSubmit={handleSubmit}>
          <div className="input">
            <input type="text" placeholder="Username" className="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" className="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" className="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="submit">
            <button className="enter">
              Sign up
            </button>
          </div>
          <div id="error">
            <img className="alert" src="/assets/LoginRegister/alert.png" alt="" />
            {formError && <p>{formError}</p>}
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
          Already have an account? <a href="/auth/login" className="signin">Login</a>
        </p>
      </div>
    </div>
  )
}

export default Regist