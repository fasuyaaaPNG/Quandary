'use client'

import "./style.css"
import { FaDoorOpen , FaRocketchat , FaReceipt, FaTrash  } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from 'framer-motion';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import React, { useRef, useEffect, useState } from 'react';
import supabase from "@/app/server/supabaseClient";

export default function User() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [userData, setUserData] = useState<any[]>([]);

    useEffect(() => {
        const cookies = document.cookie;
        const cookieArray = cookies.split(';');
        const cookieObject: Record<string, string> = {};

        cookieArray.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookieObject[name] = decodeURIComponent(value);
        });

        const isLogin = cookieObject['is_admin'];
        const decryptedEmail = isLogin ? decryptEmail(isLogin) : '';

        if (!isLogin || !decryptedEmail) {
            window.location.href = '/auth/login';
        }

        fetchUserData();
    }, []);

    const decryptEmail = (encryptedEmail: string): string => {
        const reversedEncryptedEmail = encryptedEmail.split('').reverse().join('');
        const originalEmail = Buffer.from(reversedEncryptedEmail, 'base64').toString();
        return originalEmail;
    }

    const handleLogout = () => {
        document.cookie = 'is_admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/auth/login';
    };

    const fetchUserData = async () => {
        try {
            const { data, error } = await supabase
                .from('Advice')
                .select('id, name_sender, email, message');

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
            const filteredUsers = userData.filter(user => user.name_sender.includes(searchTerm));
            setUserData(filteredUsers);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const { data, error } = await supabase
                .from('Advice')
                .delete()
                .eq('id', id);

            if (error) {
                throw new Error('Failed to delete user data');
            }
            // Filter out the deleted item from userData
            const updatedUserData = userData.filter(user => user.id !== id);
            setUserData(updatedUserData);
        } catch (error) {
            console.error('Error deleting user data:', error);
        }
    };

    return (
        <>
            <div className="background">
                <div className="fakeHeader"></div>
                <div className="content">
                    {userData.map((user, index) => (
                        <div key={index} className="profileAccount">
                            <button onClick={() => handleDelete(user.id)} className="deleteButton">
                                <FaTrash />
                            </button>
                            <div className="usernameEmailPesan">
                                <p className="username">
                                    From: <b>{user.name_sender}</b>
                                </p>
                                <p className="email">
                                    Email: {user.email}
                                </p>
                                <p className="pesan">
                                    Advice: {user.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* navbar */}
            <div className="navbar">
                <a href="/admin" className="iconDesc">
                    <div className="iconImage" id="iconImage5">
                        <FaRocketchat  size={15}/>
                    </div>
                    <p>
                        Content
                    </p>
                </a>
                <a onClick={handleLogout} className="iconDesc">
                    <div className="iconImage" id="iconImage3">
                        <FaDoorOpen size={15} />
                    </div>
                    <p>
                        Logout
                    </p>
                </a>
                <a href="/admin/advice" className="iconDesc iconDesc1">
                    <motion.div animate={{translateY: -28, opacity: 1}} className="round">
                        <FaReceipt size={20} />
                    </motion.div>
                    <motion.p  animate={{color: "#7FA1F8"}}>
                        Advice
                    </motion.p>
                </a>
            </div>
        </>
    )
};
