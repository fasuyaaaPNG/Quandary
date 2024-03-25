'use client';

import supabase from "./server/supabaseClient";
import "./style.css";
import { VscStarFull } from "react-icons/vsc";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";

const Home = () => {
  const [photoURL, setPhotoURL] = useState('');
  const [name_sender, setName_sender  ] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false)

  
  const decryptEmail = (encryptedEmail: string): string => {
    const reversedEncryptedEmail = encryptedEmail.split('').reverse().join('');
    const originalEmail = Buffer.from(reversedEncryptedEmail, 'base64').toString();
    return originalEmail;
  }

  const directProfile = () => {
    window.location.href = '/main';
  }

  useEffect(() => {
    const cookies = document.cookie;
    const cookieArray = cookies.split(';');
    const cookieObject: Record<string, string> = {};

    cookieArray.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookieObject[name] = decodeURIComponent(value);
    });

    const islogin = cookieObject['is_login'];
    const decryptedEmail = islogin ? decryptEmail(islogin) : '';

    const fetchUserProfile = async () => {
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('foto_profile')
        .eq('email', decryptedEmail);

      if (userError) {
        // console.error('Error fetching user:', userError.message);
        return;
      }

      if (!userData || userData.length === 0) {
        // console.error('User data not found');
        return;
      }

      const userProfile = userData[0];
      if (!userProfile.foto_profile) {
        setPhotoURL('https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/profile.png');
      } else {
        setPhotoURL(`https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/${userProfile.foto_profile}`);
      }

    };
        
    const checkLoginStatus = () => {
      const isLoginCookie = document.cookie.split(';').some((item) => item.trim().startsWith('is_login'));
      setIsLogin(isLoginCookie);
    };

    fetchUserProfile();
    checkLoginStatus();
  }, []);

  const notifySuccsess = () => toast.success('😋 opinion successfully sent!', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    theme: "light",
    });

  const notifyError = () => toast.error('😰 opinion not sent!', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    theme: "light",
    });

  const advice = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('Advice')
        .insert([{ name_sender, email, message }]);
      
      if (error) {
        throw error;
      }

      notifySuccsess();
      setName_sender('');
      setEmail('');
      setMessage('');
      
    } catch (error) {
      notifyError();
    }
  };

  return (
    <>
      <div className="backHitam">
        <div className="headerLogoNav">
          <img src="/assets/Landing/Logo.png" className="headerLogo" alt="" />
          {isLogin ? ( 
            <div className="headerNav">
              <a className="navHome" href="/">
                Home
              </a>
              <a className="navAbout" href="#About">
                About
              </a>  
              <img src={photoURL} onClick={directProfile} loading="lazy" alt="" className="navImage" />
            </div>
          ) : (
            <div className="headerNav2">
              <a className="navHome" href="/">
                Home
              </a>
              <a className="navAbout" href="#About">
                About
              </a>  
              <a className="navLogin" href="/auth/login">
                Log in
              </a>
            </div>
          )}
        </div>
        <div className="container1">
          <div className="content1">
            <div className="content1Title">
              <h1>
                Join the <span className="span1">Conversation</span> at <span className="span1">Quandary</span>
              </h1>
            </div>
            <div className="content1Desk">
              <p>
                Your Premier Forum Destination for Thoughtful Discussions and Diverse Perspectives.
              </p>
            </div>
            <img className="miniIcon1" loading="lazy" src="/assets/Landing/Vector.svg" alt="" />
            <img className="miniIcon2" loading="lazy" src="/assets/Landing/Vector2.svg" alt="" />
            <div className="gridBox1">
              <div className="box1">
              </div>
              <div className="box2">
              </div>
            </div>
            <div className="gridBox2">
              <div className="box3">
              </div>
            </div>
          </div>
          <div className="garis1" >
          </div>
          <div className="whiteBackground" id="About">
            <img src="/assets/Landing/kiri.png" loading="lazy" className="garisKiri" alt="" />
            <img src="/assets/Landing/kanan.png" loading="lazy" className="garisKanan" alt="" />
            <motion.img initial={{opacity:0}} whileInView={{opacity:1}} src="/assets/Landing/IlustContent2.png  " loading="lazy" alt="" className="ilustContent2" />
            <div className="content2">
              <div className="content2Judul">
                <h1>
                  What Sets <span className="span1">Quandary</span> Apart?
                </h1>
              </div>
              <div className="decorLingkaran">
                <img src="/assets/Landing/lingkaran1.png" loading="lazy" alt="" className="decorLingkaran1" />
                <img src="/assets/Landing/lingkaran2.png" loading="lazy" alt="" className="decorLingkaran2" />
                <img src="/assets/Landing/lingkaran3.png" loading="lazy" alt="" className="decorLingkaran3" />
              </div>
              <div className="content2Desk">
                <div className="content2DeskJudul">
                  <p>
                    <b>Quandary</b> isn't just a forum
                  </p>
                </div>
                <div className="content2DeskParaf1">
                  <p>
                    It's a dedicated space crafted for the vibrant exchange of ideas, insights, and discussions centered around Indonesia. 
                  </p>
                </div>
                <div className="content2DeskParaf2">
                  <p>
                    Quandary aims to be the go-to platform for anyone seeking to explore, understand, and engage in conversations about Indonesia. 
                  </p>
                </div>
              </div>
            </div>
            <div className="content3">
              <motion.div initial={{opacity:0}} whileInView={{opacity:1}} className="createPost">
                <img src="/assets/Landing/createPost.png" loading="lazy" alt="" className="createPostText" />
                <img src="/assets/Landing/createPostIcon.png" loading="lazy" alt="" className="createPostIcon" />
                <p className="createPostTextDesk">
                  Utilize our website's forum feature to create engaging posts and foster discussions within the community
                </p>
              </motion.div>
            </div>
            <div className="content4">
              <motion.div initial={{opacity:0, scale:0}} whileInView={{opacity:1, scale: 1}} className="content4LingkaranBiru" animate={{opacity: 1}} transition={{ delay: 0.2 }}>
                <div className="content4LingkaranBiruIsi">
                  <div className="content4LingkaranBiruIsiAtasIcon">
                    <div className="content4LingkaranBiruIsiAtas">
                      4.4
                    </div>
                    <div className="content4LingkaranBiruIsiIcon">
                      <VscStarFull/>
                    </div>
                  </div>
                  <div className="content4LingkaranBiruIsiBawah">
                    rating
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{opacity:0, scale:0}} whileInView={{opacity:1, scale: 1}} className="content4LingkaranHitam" animate={{opacity: 1}} transition={{ delay: 0.1 }}>
                <div className="content4LingkaranHitamIsi">
                  <div className="content4LingkaranHitamIsiAtas">
                    7 million+
                  </div>
                  <div className="content4LingkaranHitamIsiBawah">
                    post
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{opacity:0, scale:0}} whileInView={{opacity:1, scale: 1}}  className="content4LingkaranBiruMuda" animate={{opacity: 1}} transition={{ delay: 0 }}>
                <div className="content4LingkaranBiruMudaIsi">
                  <div className="content4LingkaranBiruMudaIsiAtas">
                    200.000+
                  </div>
                  <div className="content4LingkaranBiruMudaIsiBawah">
                    user
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="content5">
              <fieldset className="content5Fieldset">
                <motion.legend initial={{opacity:0,scale:0}} whileInView={{opacity:1,scale:1}} className="content5Legend">
                  Lets <span className="content5SpanDark">Join Now!!!</span>
                </motion.legend>
                <div className="content5IsiIcon">
                  <p className="content5Isi">
                    Come on, create an account and share the beauty of Indonesian culture
                  </p>
                  <div className="content5Icon">
                    <img src="/assets/Landing/content5Chat.svg" loading="lazy" alt="" className="content5Chat" />
                    <img src="/assets/Landing/content5Cursor.svg" loading="lazy" alt="" className="content5Cursor" />
                  </div>
                </div>
                <div className="content5BorderSignUp">
                  <motion.a initial={{opacity:0,scale:2}} whileInView={{opacity:1,scale:1}} href="/auth/regist" className="content5SignUp">
                    Create Account
                  </motion.a>
                </div>
              </fieldset>
            </div>
            <div className="content6">
              <h1 className="content6Judul">
                Give us opinion
              </h1>
              <div className="decorLingkaran22">
                <img src="/assets/Landing/lingkaran1.svg" loading="lazy" alt="" className="decorLingkaran1" />
                <img src="/assets/Landing/lingkaran2.svg" loading="lazy" alt="" className="decorLingkaran2" />
                <img src="/assets/Landing/lingkaran3.svg" loading="lazy" alt="" className="decorLingkaran3" />
              </div>
              <div className="content6Form">
                <form onSubmit={advice} className="content6Form">
                  <fieldset className="Content6FormField Content6FormFieldName">
                    <legend className="Content6FormLegendName">
                      Name
                    </legend>
                    <input
                      className="Content6FormLegendNameInput"
                      value={name_sender}
                      onChange={(e) => setName_sender(e.target.value)}
                      type="text"
                      required
                    />
                  </fieldset>
                  <fieldset className="Content6FormField Content6FormFieldEmail">
                    <legend className="Content6FormLegendEmail">
                      Email
                    </legend>
                    <input
                      className="Content6FormLegendEmailInput"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                    />
                  </fieldset>
                  <fieldset className="Content6FormField Content6FormFieldMessage">
                    <legend className="Content6FormLegendMessage">
                      Message
                    </legend>
                    <textarea
                      name=""
                      id=""
                      cols={0}
                      rows={10}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="Content6FormLegendMessageInput"
                      required
                    >
                    </textarea>
                  </fieldset>
                  <button className="content6FormSubmit">
                    Submit
                  </button>
                </form>
                <ToastContainer />
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="isiFooter">
              <img src="/assets/Landing/footerLogo.png" loading="lazy" alt="" className="logoFooter" />
              <img src="/assets/Landing/footerPipe.svg" loading="lazy" alt="" className="footerPipe" />
            </div>
            <div className="isiFooter2">
              <div className="navFooter">
                <a href="/" className="Home">
                  Home
                </a>
                <a href="#About" className="About">
                  About
                </a>
                <a href="/auth/login" className="SignIn">
                  Sign In
                </a>
                <a href="/auth/regist" className="SignUp">
                  Sign Up
                </a>
              </div>
              <p className="copyright">
                ©2024 Quandary All right reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home