'use client'

import { useState, useEffect } from 'react';
import { FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import supabase from '@/app/server/supabaseClient';
import './style.css';

export default function Profile() {
    const [username, setUsername] = useState('');
    const [userProfileName, setUserProfileName] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const cookies = document.cookie;
            const cookieArray = cookies.split(';');
            const cookieObject: Record<string, string> = {};

            cookieArray.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookieObject[name] = decodeURIComponent(value);
            });
            
            const isLogin = cookieObject['is_login'];
            const { data, error } = await supabase
              .from('Users')
              .select('username, name_profile, bio')
              .eq('email', isLogin);
            
            if (error) {
              console.error('Error fetching user profile:', error.message);
              return;
            }
      
            if (data.length === 0) {
              console.error('User not found');
              return;
            }
      
            const userProfile = data[0];
            setUsername(userProfile.username);
            setUserProfileName(userProfile.name_profile);
            setBio(userProfile.bio);
        };
        fetchUserProfile();

        const cookies = document.cookie;
        const cookieArray = cookies.split(';');
        const cookieObject: Record<string, string> = {};

        cookieArray.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookieObject[name] = decodeURIComponent(value);
        });
        
        const isLogin = cookieObject['is_login'];
        // console.log('Is login:', isLogin);
        if (!isLogin) {
           window.location.href = '/auth/login';
        }

        const usernameAkun = document.querySelector(".usernameAkun");
        const bioAkun = document.querySelector(".bioAkun")
        if (usernameAkun !== null && usernameAkun.innerHTML.trim() === "") {
            usernameAkun.remove();
        };
        // if (bioAkun !== null && bioAkun.innerHTML.trim() === "") {
        //     bioAkun.remove();
        // };
    }, []);

    const handleLogout = () => {
        document.cookie = 'is_login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/auth/login';
    };

    return (
        <>
            <h1 className="profile">
                Profile
            </h1>
            <img src="/assets/main/image1.jpg" alt="" className="fotoProfile" />
            <div className="deskProfile">
                <p className="namaAkun">
                    {userProfileName}
                </p>
                <p className="usernameAkun">
                    @{username}
                </p>
                <p className="bioAkun">
                    {bio}
                </p>
            </div>
            <a href="/main/profile/edit" className="editProfile">
                <p className="text">
                    Edit profile
                </p>
                <img src="/assets/profile/iconEdit.png" alt="" className="icon" />
            </a>
            <img onClick={handleLogout} src="/assets/profile/logout.png" alt="" className="logoutButton" />
            {/* navbar */}
            <div className="navbar">
                <a href="/main" className="iconDesc">
                    {/* <img src="/assets/main/icon/icon_home.png" className='iconImage' id="iconImage1" alt="" /> */}
                    <motion.div className="iconImage" id="iconImage1">
                        <FaHouse size={15} />
                    </motion.div>
                    <motion.p id='iconText1'>
                        Home
                    </motion.p>
                </a>
                <a href="/main/search" className="iconDesc">
                    {/* <img src="/assets/main/icon/icon_search.png" className='iconImage' id='iconImage2' alt="" /> */}
                    <div className="iconImage" id="iconImage2">
                        <FaMagnifyingGlass size={15} />
                    </div>
                    <p>
                        Search
                    </p>
                </a>
                <a href="/main/create" className="iconDesc">
                    {/* <img src="/assets/main/icon/icon_new post.png" className='iconImage' alt="" /> */}
                    <div className="iconImage" id="iconImage3">
                        <FaPlus size={15} />
                    </div>
                    <p>
                        New Post
                    </p>
                </a>
                <a href="/main/notify" className="iconDesc">
                    {/* <img src="/assets/main/icon/icon_notip.png" className='iconImage' alt="" /> */}
                    <div className="iconImage" id="iconImage4">
                        <FaBell size={15} />
                    </div>
                    <p>
                        Notify
                    </p>
                </a>
                <a href="/main/profile" className="iconDesc iconDesc5">
                    <motion.div animate={{translateY: -13, opacity: 1}} className="round">
                        <FaRegUser size={20} className="userIcon" />
                    </motion.div>
                    {/* <img src="/assets/main/icon/icon_profile.png" className='iconImage' alt="" /> */}
                    {/* <motion.div animate={{translateY: -10}} className="iconImage" id="iconImage5">
                        
                    </motion.div> */}
                    <motion.p animate={{color: "#7FA1F8"}} >
                        Account
                    </motion.p>
                </a>
            </div>
        </>
    )
}