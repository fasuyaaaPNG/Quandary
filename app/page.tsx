'use client';

import supabase from "./server/supabaseClient";
import "./style.css"
import { VscStarFull } from "react-icons/vsc";
import { useState, useEffect } from 'react';

const Home = () => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const advice = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: existing, error: existingError } = await supabase
      .from('Advice')
      .select('nama, email, message')
      .eq('email', email);

    if (existingError) {
      console.error(existingError);
      return;
    }

    if (existing && existing.length > 0) {
      console.error('Email already exists');
      return;
    }

    const { error } = await supabase
      .from('Advice')
      .insert([{ nama, email, message }]);

    if (error) {
      console.error(error);
      return;
    }

    console.log('Advice submitted successfully');
  };

  return (
    <>
      <div className="backHitam">
        <div className="headerLogoNav">
          <img src="/assets/Landing/Logo.svg" className="headerLogo" alt="" />
          <div className="headerNav">
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
        </div>
        <div className="container1" id="Home">
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
            <img className="miniIcon1" src="/assets/Landing/Vector.svg" alt="" />
            <img className="miniIcon2" src="/assets/Landing/Vector2.svg" alt="" />
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
          <div className="garis1" id="About">
          </div>
          <div className="whiteBackground">
            <img src="/assets/Landing/kiri.svg" className="garisKiri" alt="" />
            <img src="/assets/Landing/kanan.svg" className="garisKanan" alt="" />
            <img src="/assets/Landing/IlustContent2.svg" alt="" className="ilustContent2" />
            <div className="content2">
              <div className="content2Judul">
                <h1>
                  What Sets <span className="span1">Quandary</span> Apart?
                </h1>
              </div>
              <div className="decorLingkaran">
                <img src="/assets/Landing/lingkaran1.svg" alt="" className="decorLingkaran1" />
                <img src="/assets/Landing/lingkaran2.svg" alt="" className="decorLingkaran2" />
                <img src="/assets/Landing/lingkaran3.svg" alt="" className="decorLingkaran3" />
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
              <div className="createPost">
                <img src="/assets/Landing/createPost.svg" alt="" className="createPostText" />
                <img src="/assets/Landing/createPostIcon.svg" alt="" className="createPostIcon" />
                <p className="createPostTextDesk">
                  Utilize our website's forum feature to create engaging posts and foster discussions within the community
                </p>
              </div>
            </div>
            <div className="content4">
              <div className="content4LingkaranBiru">
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
              </div>
              <div className="content4LingkaranHitam">
                <div className="content4LingkaranHitamIsi">
                  <div className="content4LingkaranHitamIsiAtas">
                    7 million+
                  </div>
                  <div className="content4LingkaranHitamIsiBawah">
                    post
                  </div>
                </div>
              </div>
              <div className="content4LingkaranBiruMuda">
                <div className="content4LingkaranBiruMudaIsi">
                  <div className="content4LingkaranBiruMudaIsiAtas">
                    200.000+
                  </div>
                  <div className="content4LingkaranBiruMudaIsiBawah">
                    user
                  </div>
                </div>
              </div>
            </div>
            <div className="content5">
              <fieldset className="content5Fieldset">
                <legend className="content5Legend">
                  Lets <span className="content5SpanDark">Join Now!!!</span>
                </legend>
                <div className="content5IsiIcon">
                  <p className="content5Isi">
                    Come on, create an account and share the beauty of Indonesian culture
                  </p>
                  <div className="content5Icon">
                    <img src="/assets/Landing/content5Chat.svg" alt="" className="content5Chat" />
                    <img src="/assets/Landing/content5Cursor.svg" alt="" className="content5Cursor" />
                  </div>
                </div>
                <div className="content5BorderSignUp">
                  <a href="/auth/regist" className="content5SignUp">
                    Create Account
                  </a>
                </div>
              </fieldset>
            </div>
            <div className="content6">
              <h1 className="content6Judul">
                Give us advice
              </h1>
              <div className="decorLingkaran22">
                <img src="/assets/Landing/lingkaran1.svg" alt="" className="decorLingkaran1" />
                <img src="/assets/Landing/lingkaran2.svg" alt="" className="decorLingkaran2" />
                <img src="/assets/Landing/lingkaran3.svg" alt="" className="decorLingkaran3" />
              </div>
              <div className="content6Form">
                <form onSubmit={advice} className="content6Form">
                  <fieldset className="Content6FormField Content6FormFieldName">
                    <legend className="Content6FormLegendName">Name</legend>
                    <input
                      className="Content6FormLegendNameInput"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      type="text"
                    />
                  </fieldset>
                  <fieldset className="Content6FormField Content6FormFieldEmail">
                    <legend className="Content6FormLegendEmail">Email</legend>
                    <input
                      className="Content6FormLegendEmailInput"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                    />
                  </fieldset>
                  <fieldset className="Content6FormField Content6FormFieldMessage">
                    <legend className="Content6FormLegendMessage">Message</legend>
                    <textarea
                      name=""
                      id=""
                      cols={0}
                      rows={10}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="Content6FormLegendMessageInput"
                    ></textarea>
                  </fieldset>
                  <button type="submit" className="content6FormSubmit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="isiFooter">
              <img src="/assets/Landing/footerLogo.svg" alt="" className="logoFooter" />
              <img src="/assets/Landing/footerPipe.svg" alt="" className="footerPipe" />
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