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

    useEffect(() => {
        const cookies = document.cookie;
        const cookieArray = cookies.split(';');
        const cookieObject: Record<string, string> = {};

        cookieArray.forEach(cookie => {
          const [name, value] = cookie.trim().split('=');
          cookieObject[name] = decodeURIComponent(value);
        });
            
        const is_login = cookieObject['is_login'];
        if (!is_login) {
          window.location.href = '/auth/login';
        }
        
        const redirectTimer = setTimeout(() => {
          const cookies = document.cookie;
          const cookieArray = cookies.split(';');
          const cookieObject: Record<string, string> = {};

          cookieArray.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookieObject[name] = decodeURIComponent(value);
          });
            
          const is_login = cookieObject['is_login'];
          if (is_login) {
            window.location.href = '/main'; // Jika ada is_login, redirect ke /main
          } else {
            window.location.href = '/auth/login'; // Jika tidak ada is_login, redirect ke /auth/login
          }
        }, 3500); // Delay 4 detik sebelum redirect

        return () => clearTimeout(redirectTimer); // Membersihkan timer saat komponen unmount
    }, []); // useEffect ini akan dipanggil hanya saat komponen pertama kali dirender

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
