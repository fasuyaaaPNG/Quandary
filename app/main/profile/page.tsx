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
    const [photoURL, setPhotoURL] = useState('');

    function decryptEmail(encryptedEmail: string): string {
        const reversedEncryptedEmail = encryptedEmail.split('').reverse().join('');
        const originalEmail = Buffer.from(reversedEncryptedEmail, 'base64').toString();
        return originalEmail;
    }

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
            const decryptedEmail = isLogin ? decryptEmail(isLogin) : '';

            if (!isLogin || !decryptedEmail) {
                window.location.href = '/auth/login';
                return;
            }

            const { data, error } = await supabase
                .from('Users')
                .select('username, name_profile, bio, foto_profile')
                .eq('email', decryptedEmail);

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

            if (!userProfile.foto_profile) {
                setPhotoURL('https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/profile.png');
            } else {
                setPhotoURL("https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/"+userProfile.foto_profile);
            }
        };

        fetchUserProfile();
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
            <img loading='lazy' src={photoURL} alt="" className="fotoProfile" />
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