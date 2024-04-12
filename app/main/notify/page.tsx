'use client'

import React, { useRef, useEffect, useState } from 'react';
import { FaX ,FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import { motion } from 'framer-motion';
import supabase from "@/app/server/supabaseClient";
import './style.css'
import { join } from 'path';
import { faX } from '@fortawesome/free-solid-svg-icons';

export default function Notify() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [userData, setUserData] = useState<any[]>([]);
    const [isLike, setIsLike] = useState(false);    

    useEffect(() => {
        fetchNotifData();
        fetchState();
        console.log(isLike)
    }, [isLike]);

    const getTimeAgoString = (createdAt: string): string => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const timeDifference = currentDate.getTime() - createdDate.getTime();
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
        
        if (years > 0) {
            return `${years}y`;
        } else if (months > 0) {
            return `${months}m`;
        } else if (days > 0) {
            return `${days}d`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}m`;
        }
    };
    
    
    function decryptEmail(encryptedEmail: string): string {
        const reversedEncryptedEmail = encryptedEmail.split('').reverse().join('');
        const originalEmail = Buffer.from(reversedEncryptedEmail, 'base64').toString();
        return originalEmail;
    }

    const fetchState = async () => {
        const like = await getUserLike();
        const comment = await getUserComment();
        if (like) {
            setIsLike(true)
        } if (comment) {
            setIsLike(false)
        }
    }

    const getUserIdPost = async () => {
        const id = await getUserId();
        const { data, error } = await supabase
            .from('posting')
            .select('id')
            .eq('id_user', id);

        if (error) {
            // console.error('Error fetching user id:', error.message);
            return null;
        }

        if (data.length === 0) {
            // console.error(error);
            return null;
        }
        return data[0].id;
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

    const getUsernameById = async (userId: string) => {
        const { data, error } = await supabase
            .from('Users')
            .select('username')
            .eq('id', userId);

        if (error) {
            console.error('Error fetching username:', error.message);
            return null;
        }

        if (data.length === 0) {
            // console.error('User not found');
            return null;
        }

        return data[0].username;
    }

    const getThumbnailById = async (postingId: string) => {
        const { data, error } = await supabase
            .from('posting')
            .select('thumbnail')
            .eq('id', postingId);

        if (error) {
            console.error('Error fetching username:', error.message);
            return null;
        }

        if (data.length === 0) {
            // console.error('User not found');
            return null;
        }

        return data[0].thumbnail;
    }

    const getUserLike = async() => {
        const { data, error } = await supabase
            .from('notif')
            .select('*')
            .eq('like', true)
            .neq('comment', true)

        if (error) {
            console.error('Error fetching user id:', error.message);
            return null;
        }

        if (data.length === 0) {
            console.error(error);
            return null;
        }
        return data[0].like;
    }

    const getUserComment = async() => {
        const { data, error } = await supabase
            .from('notif')
            .select('*')
            .eq('comment', true)
            .neq('like', true)

        if (error) {
            console.error('Error fetching user id:', error.message);
            return null;
        }

        if (data.length === 0) {
            console.error(error);
            return null;
        }
        return data[0];
    }
    
    const fetchNotifData = async () => {
        const idUser = await getUserId();
        const idUserPost = await getUserIdPost();
        try {
            const { data, error } = await supabase
                .from('notif')
                .select('*')
                .neq('id_user', idUser)

            if (error) {
                // console.error('Error fetching user id:', error.message);
                return null;
            }
        
            if (data.length === 0) {
                // console.error(error);
                return null;
            }

            const userDataWithUsername = await Promise.all(data.map(async (user) => {
                const username = await getUsernameById(user.id_user);
                const thumbnail = await getThumbnailById(user.id_posting); 
                return { ...user, username, thumbnail };
            }));

            setUserData(userDataWithUsername);
        } catch (error) {
            // console.error('Error fetching user data:', error);
        }
    };  
    

    return (
        <>
            <div className="background">
                <div className="fakeHeader"></div>
                <div className="content">
                    {userData.slice().reverse().map((user, index) => (
                        <div className="profileAccount" key={index}>
                            <img src={user.like ? `https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_notif/liked.png` : 'https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_notif/comment.png'} alt="" className="fotoAccount" />
                            {user.like ? (
                                <div className="usernameNameBio">
                                    <p className="username">
                                        <b>
                                            @{user.username}
                                        </b> liked your post. <span className='time'>{getTimeAgoString(user.created_at)}</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="usernameNameBio">
                                    <p className="username">
                                        <b>
                                            @{user.username}
                                        </b> commented on your post:
                                    </p>
                                    {user.message_comment && (
                                        <p className="fullname">
                                            {user.message_comment}. <span className='time'>{getTimeAgoString(user.created_at)}</span>
                                        </p>
                                    )}
                                </div>
                            )}
                            {user.thumbnail && (
                                <img src={user.thumbnail} alt="" className="thumbnail" />
                            )}
                        </div>
                    ))}
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
                <a href="/main/user" className="iconDesc">
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
                <a href="/main/notify" className="iconDesc iconDesc5">
                    <motion.div animate={{translateY: -13, opacity: 1}} className="round">
                        <FaBell size={15} />
                    </motion.div>
                    <motion.p animate={{color: "#7FA1F8"}} >
                        Notify
                    </motion.p>
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