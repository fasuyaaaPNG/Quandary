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

  function encryptEmail(email: string): string {
    const encryptedEmail = Buffer.from(email).toString('base64');
    return encryptedEmail.split('').reverse().join('');
  }

  async function signInGithub() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
        });
    
        if (error) {
            throw error;
        }
    
        const { data: { user } } = await supabase.auth.getUser();
        const metadata = user?.user_metadata;
    
        if (metadata) {
            console.log("Avatar URL:", metadata.avatar_url);
            console.log("Email:", metadata.email);
            console.log('username:', metadata.username);
    
            // Cek apakah email sudah ada dalam tabel
            const { data: existingUserData, error: existingUserError } = await supabase
                .from('Users')
                .select('*')
                .eq('email', metadata.email);
            
            if (existingUserError) {
                throw existingUserError;
            }
    
            // Jika email belum ada dalam tabel, lakukan operasi insert
            if (!existingUserData || existingUserData.length === 0) {
                const { error: insertError } = await supabase
                    .from('Users')
                    .insert([{ username: metadata.username, email: metadata.email, foto_profile: metadata.avatar_url }]);
    
                if (insertError) {
                    throw insertError;
                }
            } else {
                console.log("User with this email already exists in the Users table.");
            }
             
        const encryptedEmail = encryptEmail(metadata.email);
        setCookie(null, 'is_login', encryptedEmail, {
            maxAge: 30 * 24 * 60 * 60, // Durasi cookie
            path: '/', // Jalur cookie
        });
        }
    } catch (error) {
        // console.error("Error signing in with GitHub:", error.message);
    }
}
 
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

    const encryptedEmail = encryptEmail(email);

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
      const errorContainer = document.getElementById('error');
      if (errorContainer) {
        errorContainer.classList.add('error-show');
      }
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
      setCookie(null, 'is_login', encryptedEmail, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      window.location.href = '/redirect';
      console.log(data)
    }
  };
  
  const [logo, setlogo] = useState('/assets/LoginRegister/QUANDARY.png');
  const [github, setgoogle] = useState('/assets/LoginRegister/git.png');
      
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

     
      if (screenWidth >= 1024 && screenWidth <= 1920) {
        setlogo('/assets/LoginRegister/QUANDARY_dark.png');
        setgoogle('/assets/LoginRegister/git.png');
      } else {
        setlogo('/assets/LoginRegister/QUANDARY.png');
        setgoogle('/assets/LoginRegister/git.png');
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
            {emailExistsError && <p className="errorText">Email already exists!</p>}
          </div>
        </form>
        <div className="google">
          <div className="iconback">
            <img src={github} alt="" className="icon"/>
          </div>
          <button onClick={signInGithub} className="with">
            Sign up with Github
          </button>
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