'use client'

import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import { motion } from "framer-motion";
import supabase from '@/app/server/supabaseClient';
import "./style.css";

export default function Edit() {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [createat, setCreate] = useState('');
    const [fullnameLength, setFullnameLength] = useState(0);
    const [usernameLength, setUsernameLength] = useState(0);
    const [bioLength, setBioLength] = useState(0);

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
            
            if (!isLogin) {
                window.location.href = '/auth/login';
             }

            const { data, error } = await supabase
                .from('Users')
                .select('username, name_profile, bio, created_at')
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
            setFullname(userProfile.name_profile);
            setUsername(userProfile.username);
            setBio(userProfile.bio);
            setCreate(userProfile.created_at);
        };
        fetchUserProfile();
    }, []);

    function countTextBio(event: React.ChangeEvent<HTMLInputElement>) {
        const text = event.target.value;
        setBio(text);
        setBioLength(text.length);
    }
    
    function countTextName(event: React.ChangeEvent<HTMLInputElement>) {
        const text = event.target.value;
        setFullname(text);
        setFullnameLength(text.length);
    }
    
    function countTextUsername(event: React.ChangeEvent<HTMLInputElement>) {
        const text = event.target.value;
        setUsername(text);
        setUsernameLength(text.length);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const cookies = document.cookie;
        const cookieArray = cookies.split(';');
        const cookieObject: Record<string, string> = {};
        
        cookieArray.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookieObject[name] = decodeURIComponent(value);
        });            
        const isLogin = cookieObject['is_login'];

        const { data: existingUserData, error: existingUserError } = await supabase
            .from('Users')
            .select('id')
            .eq('email', isLogin);
    
        if (existingUserError) {
            console.error('Error checking existing user:', existingUserError.message);
            return;
        }
    
        if (existingUserData.length === 0) {
            const { error: insertError } = await supabase
                .from('Users')
                .insert([{ email: isLogin, name_profile: fullname, username, bio }]);
    
            if (insertError) {
                console.error('Error inserting new user profile:', insertError.message);
                return;
            }
        } else {
            const { error: updateError } = await supabase
                .from('Users')
                .update({ name_profile: fullname, username, bio })
                .eq('email', isLogin);

            if (updateError) {
                console.error('Error updating user profile:', updateError.message);
                return;
            }
        }
        window.location.href = '/main/profile';
    };


    return (
        <> 
            <div className="background">
                <div className="profileAtas">
                    <a href="/main/profile" className="back">
                        <FaArrowLeft size={20} className="back"/>
                    </a>
                    <h1 className="profile">
                        Edit profile
                    </h1>
                </div>
                <label className="inputImage" htmlFor="uploadInput">
                    <img src="/assets/main/image1.jpg" alt="" className="profileImage" />
                    <img src="/assets/editProfile/iconImage.png" className="iconProfile" alt="" />
                </label>
                <input type="file" id="uploadInput" className="image" style={{ display: "none" }} />
                <p className="profileDesk">
                    Change profile picture
                </p>
                <form name="form_main" onSubmit={handleSubmit}>
                    <div className="inputNameDiv">
                        <div className="labelChar">
                            <label className="inputNameLabel" htmlFor="fullname">
                                Profile name
                            </label>
                            <label className="inputchar" htmlFor="fullname">
                                <span id="fullnameLength">{fullnameLength}/30</span>
                            </label>
                        </div>
                        <input maxLength={30} onChange={countTextName} value={fullname} className="inputName" name="fullname" id="fullname" type="text" />
                    </div>
                    <div className="inputNameDiv">
                        <div className="labelChar">
                            <label className="inputNameLabel" htmlFor="username">
                            Username
                            </label>
                            <label className="inputchar" htmlFor="username">
                                <span id="usernameLength">{usernameLength}/10</span>
                            </label>
                        </div>
                        <input onChange={countTextUsername} value={username} maxLength={10} className="inputName" name="username" id="username" type="text" />
                    </div>
                    <div className="inputNameDiv">
                        <div className="labelChar">
                            <label className="inputNameLabel" htmlFor="bio">
                                Bio
                            </label>
                            <label className="inputchar" htmlFor="bio">
                                <span id="bioLength">{bioLength}/30</span>
                            </label>
                        </div>
                        <input onChange={countTextBio} value={bio} maxLength={30} className="inputName" name="bio" id="bio" type="text" />
                    </div>
                    <div className="inputNameDiv">
                        <label className="inputNameLabelCreated">
                            Created Account at
                        </label>
                        <input className="inputName" value={createat} readOnly type="text" />
                    </div>
                    <button type="submit" className="submit">
                        <FaCheck size={25} className="centang"/>
                    </button>
                </form>
                {/* navbar */}
                <div className="navbar">
                    <a href="/main" className="iconDesc">
                        <motion.div animate={{translateY: 0}} className="iconImage" id="iconImage1">
                            <FaHouse size={15} />
                        </motion.div>
                        <motion.p id='iconText1'>
                            Home
                        </motion.p>
                    </a>
                    <a href="/main/search" className="iconDesc">
                        <div className="iconImage" id="iconImage2">
                            <FaMagnifyingGlass size={15} />
                        </div>
                        <p>
                            Search
                        </p>
                    </a>
                    <a href="/main/create" className="iconDesc">
                        <div className="iconImage" id="iconImage3">
                            <FaPlus size={15} />
                        </div>
                        <p>
                            New Post
                        </p>
                    </a>
                    <a href="/main/notify" className="iconDesc">
                        <div className="iconImage" id="iconImage4">
                            <FaBell size={15} />
                        </div>
                        <p>
                            Notify
                        </p>
                    </a>
                    <a href="/main/profile" className="iconDesc iconDesc5">
                        <motion.div animate={{translateY: 0, opacity: 1}} className="round">
                            <FaRegUser size={20} />
                        </motion.div>
                        <p className="blue">
                            Account
                        </p>
                    </a>
                </div>
            </div>
        </>
    )
}