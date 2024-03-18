'use client';

import supabase from "@/app/server/supabaseClient";
import "./style.css";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie, parseCookies } from 'nookies';

export default function Login() {

  const [logo, setlogo] = useState('/assets/LoginRegister/QUANDARY.png');
  const [google, setgoogle] = useState('/assets/LoginRegister/google.png');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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
      return;
    }

    const userData = usersData[0];
    console.log('User data:', userData);

    setCookie(null, 'is_login', email, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    console.log('Sesi aktif:', parseCookies().is_login);
    window.location.href = '/main/profile';
  }

  useEffect(() => {
    console.log('Sesi saat ini:', parseCookies().is_login);
    const isLoggedIn = parseCookies().is_login;
    if (isLoggedIn) {
      window.location.href = '/main/profile';
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
          Don't have an account yet? <a href="/auth/regist" className="signin">Sign up</a>
        </p>
      </div>
    </div>
  )
}