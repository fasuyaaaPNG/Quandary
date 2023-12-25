'use client';

import "./style.css";
import { useState, useEffect } from 'react';
import supabase from "../server/supabaseClient";

const Regist = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!username || !email || !password) {
      setFormError('Please fill all fields');

      const errorContainer = document.getElementById('error');
      if (errorContainer) {
        errorContainer.classList.add('error-show');
      }
      return;
    }
  
    // Cek apakah email sudah ada dalam database
    const { data: existingUser, error: existingUserError } = await supabase
      .from('Users')
      .select('email')
      .eq('email', email)
      .single();
  
    if (existingUserError) {
      console.error('Error checking existing user:', existingUserError.message);
      setFormError('');
      return;
    }
  
    if (existingUser) {
      setFormError('Email already exists');
  
      // Add a class to the error container for styling
      const errorContainer = document.getElementById('error');
      if (errorContainer) {
        errorContainer.classList.add('error-show');
      }
  
      return;
    }
  
    // Jika email belum ada, lakukan penyisipan data
    const { data, error } = await supabase
      .from('Users')
      .insert([{ username, email, password }]);
  
    if (error) {
      console.error('Error inserting user:', error.message);
      setFormError('Please fill in all the fields correctly');
  
      // Add a class to the error container for styling
      const errorContainer = document.querySelector('error');
      if (errorContainer) {
        errorContainer.classList.add('error-show');
      }
  
      return;
    }
  
    if (data) {
      console.log('User inserted successfully:', data);
      setFormError('Account created');
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
          Already have an account? <a href="/login" className="signin">Login</a>
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
            {formError && <p>{formError}</p>}
          </div>
        </form>
        <div className="google" tabIndex={-1}>
          <a href="" className="withgoogle" tabIndex={-1}>
            <div className="iconback" tabIndex={-1}>
              <img src={google} alt="" tabIndex={-1} className="icon"/>
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

export default Regist
