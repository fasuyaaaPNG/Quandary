'use client'

import "./style.css"
import { FaPaperPlane, FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from 'framer-motion';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import React, {useRef,useEffect,useState} from 'react';
import supabase from "@/app/server/supabaseClient";

export default function User() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [userData, setUserData] = useState<any[]>([]);

    useEffect(() => {
        // Panggil fungsi untuk mengambil data pengguna
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .select('*');

            if (error) {
                throw new Error('Failed to fetch user data');
            }
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleSearchIconClick = () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
    };

    const handleChange = () => {
        const searchTerm = inputRef.current?.value.toLowerCase();
        if (!searchTerm) {
            fetchUserData();
        } else {
            const filteredUsers = userData.filter(user => user.username.includes(searchTerm));
            setUserData(filteredUsers);
        }
    };

    return (
        <>
            <div className="background">
                <div className="header">
                    <div className="search">
                        <div className="searchIcon" onClick={handleSearchIconClick}>
                            <FontAwesomeIcon
                                style={{ fontSize: '3.5vw' }}
                                icon={faMagnifyingGlass}
                            />
                        </div>
                        <input type="search" onChange={handleChange} placeholder="Search account from username" ref={inputRef} name="" id="" className="searchBar"/>
                    </div>
                </div>
                <div className="fakeHeader"></div>
                <div className="content">
                    {userData.map((user, index) => (
                        <div key={index} className="profileAccount">
                            <img src={user.foto_profile ? `https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/${user.foto_profile}` : 'https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/profile.png'} alt="" className="fotoAccount" />
                            <div className="usernameNameBio">
                                <p className="username">
                                    <b>
                                        @{user.username}
                                    </b>
                                </p>
                                {user.name_profile && (
                                    <p className="fullname">
                                        {user.name_profile}
                                    </p>
                                )}
                                {/* Tambahkan kondisi jika ada bio */}
                                {user.bio && (
                                    <p className="bio">
                                        {user.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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
                <a href="/main/user" className="iconDesc iconDesc5">
                    {/* <img src="/assets/main/icon/icon_search.png" className='iconImage' id='iconImage2' alt="" /> */}
                    <motion.div animate={{translateY: -13, opacity: 1}} className="round">
                        <FaMagnifyingGlass size={15} />
                    </motion.div>
                    <motion.p animate={{color: "#7FA1F8"}} >
                        Search
                    </motion.p>
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
                <a href="/main/profile" className="iconDesc">
                    <div className="iconImage" id="iconImage5">
                        <FaRegUser size={15} className="userIcon" />
                    </div>
                    {/* <img src="/assets/main/icon/icon_profile.png" className='iconImage' alt="" /> */}
                    {/* <motion.div animate={{translateY: -10}} className="iconImage" id="iconImage5">
                        
                    </motion.div> */}
                    <p>
                        Account
                    </p>
                </a>
            </div>
        </>
    )
};