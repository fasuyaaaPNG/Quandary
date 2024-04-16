'use client';

import supabase from "@/app/server/supabaseClient";
import "./style.css";
import { useState, useEffect } from 'react';
import { setCookie, parseCookies } from 'nookies';

export default function Login() {
  const [logo, setlogo] = useState('/assets/LoginRegister/QUANDARY.png');
  const [google, setgoogle] = useState('/assets/LoginRegister/google.png');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null); // State untuk menampilkan pesan error

  function encryptEmail(email: string): string {
    const encryptedEmail = Buffer.from(email).toString('base64');
    return encryptedEmail.split('').reverse().join('');
  }

  async function  signInGithub() {
    await  supabase.auth.signInWithOAuth({
      provider:  "github",
    });
  }

  async function  signInGoogle() {
    await  supabase.auth.signInWithOAuth({
      provider:  "google",
    });
  }

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { data: adminData, error: adminError } = await supabase
      .from('admin')
      .select('*')
      .eq('email', email)
      .eq('password', password);

    if (adminError) {
      console.error('Error retrieving admin data:', adminError.message);
      return;
    }

    if (adminData && adminData.length > 0) {
      const encryptedEmail = encryptEmail(email);
      setCookie(null, 'is_admin', encryptedEmail, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      window.location.href = '/admin'; 
      return;
    }

    const { data: usersData, error: usersError } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email);
  
    if (usersError) {
      console.error('Error retrieving user data:', usersError.message);
      return;
    }
  
    if (!usersData || usersData.length === 0 || usersData[0].password !== password) {
      console.error('Invalid email or password');
      setFormError('Invalid email or password');
      const errorContainer = document.getElementById('error');
      if (errorContainer) {
        errorContainer.classList.add('error-show');
      }
      return;
    }

    const userData = usersData[0];
    const encryptedEmail = encryptEmail(email);
    setCookie(null, 'is_login', encryptedEmail, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    window.location.href = '/main';
  }

  useEffect(() => {
    const isLoggedIn = parseCookies().is_login;
    const isLoggedInAdmin = parseCookies().is_admin;
    if (isLoggedIn) {
      window.location.href = '/main';
    } if (isLoggedInAdmin) {
      window.location.href = '/admin'
    }
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
          New user? <a href="/auth/regist" className="signin">Sign up</a>
        </p>
      </div>
      <form onSubmit={handleSignIn}>
        <div className="input">
          <input type="email" placeholder="Email" className="email" onChange={(e) => setEmail(e.target.value)} value={email} />
          <input type="password" placeholder="Password" className="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
        </div>
        <div className="submit">
          <button className="enter">
            Login
          </button>
        </div>
        <div id="error">
          <img className="alert" src="/assets/LoginRegister/alert.png" alt="" />
          {formError && <p className="errorText">{formError}</p>}
        </div>
      </form>
        <div className="google">
          <div className="iconback">
            <img src={google} alt="" className="icon"/>
          </div>
          <button onClick={signInGoogle} className="with">
            Login with Google
          </button>
        </div>
      </div>
      <div className="already">
        <p>
          Don't have an account yet? <a href="/auth/regist" className="signin">Sign up</a>
        </p>
      </div>
    </div>
  )
}