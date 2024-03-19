'use client'

import "./style.css";
import { useState, useEffect } from 'react';

const Redirect = () => {
    const [background, setBackground] = useState('/assets/Redirect/background_redirect.jpg');
      
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;

            if (screenWidth >= 1024 && screenWidth <= 1920) {
                setBackground('/assets/Redirect/background_landscape.jpg');
            } else {
                setBackground('/assets/Redirect/background_redirect.jpg');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function decryptEmail(encryptedEmail: string): string {
      const reversedEncryptedEmail = encryptedEmail.split('').reverse().join('');
      const originalEmail = Buffer.from(reversedEncryptedEmail, 'base64').toString();
      return originalEmail;
    }

    useEffect(() => {
        const cookies = document.cookie;
        const cookieArray = cookies.split(';');
        const cookieObject: Record<string, string> = {};

        cookieArray.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookieObject[name] = decodeURIComponent(value);
        });

        const isLogin = cookieObject['is_login'];
        const decryptedEmail = isLogin ? decryptEmail(isLogin) : '';

        if (!isLogin || !decryptedEmail) {
            window.location.href = '/auth/login';
            return;
        }


        const redirectTimer = setTimeout(() => {
          const cookies = document.cookie;
          const cookieArray = cookies.split(';');
          const cookieObject: Record<string, string> = {};
  
          cookieArray.forEach(cookie => {
              const [name, value] = cookie.trim().split('=');
              cookieObject[name] = decodeURIComponent(value);
          });
            
          const isLogin = cookieObject['is_login'];
          const decryptedEmail = isLogin ? decryptEmail(isLogin) : '';

          if (isLogin || decryptedEmail) {
            window.location.href = '/main'; 
          } else {
            window.location.href = '/auth/login';
          }
        }, 3000);

        return () => clearTimeout(redirectTimer);
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
    );
};

export default Redirect;
