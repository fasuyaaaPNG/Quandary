'use client';

import "./style.css";
import { useState, useEffect } from 'react';

const Redirect = () => {

    const [background, setbackground] = useState('/assets/Redirect/background_redirect.jpg');
      
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;

     
      if (screenWidth >= 1024 && screenWidth <= 1920) {
        setbackground('/assets/Redirect/background_landscape.png');
      } else {
        setbackground('/assets/Redirect/background_redirect.jpg');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const backgroundImageStyle = {
    backgroundImage: `url(${background})`,
  };

    return (
        <>
            <div className="background" style={backgroundImageStyle}></div>
            <div className="container">
                <img src="/assets/Redirect/valid.png" className="logo" alt="" />
                <div className="text">
                    <p className="textAtas">
                        Successfully create an account
                    </p>
                    <p className="textBawah">
                        Wait a few moments to return to the login page
                    </p>
                </div>
            </div>
        </>
    )
}

export default Redirect
