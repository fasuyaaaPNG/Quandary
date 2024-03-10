'use client'

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import "./style.css";

export default function Profile() {
    useEffect(() => {
        const usernameAkun = document.querySelector(".usernameAkun");
        const bioAkun = document.querySelector(".bioAkun")
        if (usernameAkun !== null && usernameAkun.innerHTML.trim() === "") {
            usernameAkun.remove();
        };
        if (bioAkun !== null && bioAkun.innerHTML.trim() === "") {
            bioAkun.remove();
        };
    }, []);

    return (
        <>
            <h1 className="profile">
                Profile
            </h1>
            <img src="/assets/main/image1.jpg" alt="" className="fotoProfile" />
            <div className="deskProfile">
                <p className="namaAkun">
                    Dhavin Fasya A
                </p>
                <p className="usernameAkun">
                    @fasuyaaa
                </p>
                <p className="bioAkun">
                    hi! im a weaboo 😈
                </p>
            </div>
            <a href="/main/profile/edit" className="editProfile">
                <p className="text">
                    Edit profile
                </p>
                <img src="/assets/profile/iconEdit.png" alt="" className="icon" />
            </a>
            {/* navbar */}
            <div className="navbar">
                <motion.div animate={{translateY: -25, opacity: 1}} className="round"></motion.div>
                <a href="/main" className="iconDesc">
                    {/* <img src="/assets/main/icon/icon_home.png" className='iconImage' id="iconImage1" alt="" /> */}
                    <motion.div className="iconImage" id="iconImage1">
                        <FaHouse size={20} />
                    </motion.div>
                    <motion.p id='iconText1'>
                        Home
                    </motion.p>
                </a>
                <a href="/main/search" className="iconDesc">
                    {/* <img src="/assets/main/icon/icon_search.png" className='iconImage' id='iconImage2' alt="" /> */}
                    <div className="iconImage" id="iconImage2">
                        <FaMagnifyingGlass size={20} />
                    </div>
                    <p>
                        Search
                    </p>
                </a>
                <a href="/main/create" className="iconDesc">
                    {/* <img src="/assets/main/icon/icon_new post.png" className='iconImage' alt="" /> */}
                    <div className="iconImage" id="iconImage3">
                        <FaPlus size={20} />
                    </div>
                    <p>
                        New Post
                    </p>
                </a>
                <a href="/main/notify" className="iconDesc">
                    {/* <img src="/assets/main/icon/icon_notip.png" className='iconImage' alt="" /> */}
                    <div className="iconImage" id="iconImage4">
                        <FaBell size={20} />
                    </div>
                    <p>
                        Notify
                    </p>
                </a>
                <a href="/main/profile" className="iconDesc">
                    {/* <img src="/assets/main/icon/icon_profile.png" className='iconImage' alt="" /> */}
                    <motion.div animate={{translateY: -10}} className="iconImage" id="iconImage5">
                        <FaRegUser size={20} />
                    </motion.div>
                    <motion.p animate={{color: "#7FA1F8"}} >
                        Account
                    </motion.p>
                </a>
            </div>
        </>
    )
}