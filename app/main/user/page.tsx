'use client'

import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FaAnglesLeft , FaAnglesRight ,FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import { motion } from 'framer-motion';
import supabase from "@/app/server/supabaseClient";
import './style.css'

export default function User() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [userData, setUserData] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchUserData();
    }, [currentPage]);
    
    useEffect(() => {
        // console.log("Total Pages:", totalPages);
    }, [totalPages]);

    function decryptEmail(encryptedEmail: string): string {
        const reversedEncryptedEmail = encryptedEmail.split('').reverse().join('');
        const originalEmail = Buffer.from(reversedEncryptedEmail, 'base64').toString();
        return originalEmail;
    }

    const getUserId = async () => {
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
            return null;
        }

        const { data, error } = await supabase
            .from('Users')
            .select('id')
            .eq('email', decryptedEmail);

        if (error) {
            console.error('Error fetching user id:', error.message);
            return null;
        }

        if (data.length === 0) {
            console.error(error);
            return null;
        }
        return data[0].id;
    };
    
    const fetchUserData = async () => {
        const idUser = await getUserId();
        try {
            const { data, error, count } = await supabase
                .from('Users')
                .select('*', { count: 'exact' })
                .neq('id', idUser)
                .range((currentPage - 1) * 10, currentPage * 10 - 1);
            if (error) {
                throw new Error('Failed to fetch user data');
            }
            setUserData(data);

            const totalPages = Math.ceil((count ?? 0) / 10); 
            setTotalPages(totalPages);
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
                        <a key={user.id} href={`/main/user/${user.id}`} className="profileLink">
                            <div className="profileAccount">
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
                        </a>
                    ))}
                </div>
                <div className="pagination">
                    {currentPage > 1 && (
                        <button onClick={() => handlePageChange(currentPage - 1)}>
                            <FaAnglesLeft className='pageIcon'/>
                        </button>
                    )}
                    {currentPage < totalPages && (
                        <button onClick={() => handlePageChange(currentPage + 1)}>
                            <FaAnglesRight className='pageIcon'/>
                        </button>
                    )}
                </div>
            </div>
            {/* navbar */}
            <div className="navbar">
                <a href="/main" className="iconDesc">
                    <motion.div className="iconImage" id="iconImage1">
                        <FaHouse size={15} />
                    </motion.div>
                    <motion.p id='iconText1'>
                        Home
                    </motion.p>
                </a>
                <a href="/main/user" className="iconDesc iconDesc5">
                    <motion.div animate={{translateY: -13, opacity: 1}} className="round">
                        <FaMagnifyingGlass size={15} />
                    </motion.div>
                    <motion.p animate={{color: "#7FA1F8"}} >
                        Search
                    </motion.p>
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
                <a href="/main/profile" className="iconDesc">
                    <div className="iconImage" id="iconImage5">
                        <FaRegUser size={15} className="userIcon" />
                    </div>
                    <p>
                        Account
                    </p>
                </a>
            </div>
        </>
    )
};
