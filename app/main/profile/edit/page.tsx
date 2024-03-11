'use client'

import { motion } from "framer-motion";
import {FaArrowLeft, FaCheck, FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import "./style.css"
import React, { useEffect, useState } from "react";

export default function Edit() {
    const [fullnameLength, setFullnameLength] = useState(0);
    const [usernameLength, setUsernameLength] = useState(0);
    const [bioLength, setBioLength] = useState(0);

    useEffect(() => {
        if (fullnameLength === 0) document.getElementById('fullnameLength')!.innerText = "0/30";
        if (usernameLength === 0) document.getElementById('usernameLength')!.innerText = "0/10";
        if (bioLength === 0) document.getElementById('bioLength')!.innerText = "0/30";
    }, [fullnameLength, usernameLength, bioLength]);

    function countTextBio() {
        const bioInput = document.querySelector<HTMLInputElement>("form[name=form_main] input[name=bio]");
        const text = bioInput!.value;
        setBioLength(text.length);
        document.getElementById('bioLength')!.innerText = text.length.toString() + "/30";
    }
    
    function countTextName() {
        const nameInput = document.querySelector<HTMLInputElement>("form[name=form_main] input[name=fullname]");
        const text = nameInput!.value;
        setFullnameLength(text.length);
        document.getElementById('fullnameLength')!.innerText = text.length.toString() + "/30";
    }
    
    function countTextUsername() {
        const usernameInput = document.querySelector<HTMLInputElement>("form[name=form_main] input[name=username]");
        const text = usernameInput!.value;
        setUsernameLength(text.length);
        document.getElementById('usernameLength')!.innerText = text.length.toString() + "/10";
    }

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
                <form name="form_main" action="/main" method="POST">
                    <div className="inputNameDiv">
                        <div className="labelChar">
                            <label className="inputNameLabel" htmlFor="fullname">
                                Profile name
                            </label>
                            <label className="inputchar" htmlFor="fullname">
                                <span id="fullnameLength"></span>
                            </label>
                        </div>
                        <input maxLength={30} onInput={countTextName} className="inputName" name="fullname" id="fullname" type="text" />
                    </div>
                    <div className="inputNameDiv">
                        <div className="labelChar">
                            <label className="inputNameLabel" htmlFor="username">
                            Username
                            </label>
                            <label className="inputchar" htmlFor="username">
                                <span id="usernameLength"></span>
                            </label>
                        </div>
                        <input onInput={countTextUsername} maxLength={10} className="inputName" name="username" id="username" type="text" />
                    </div>
                    <div className="inputNameDiv">
                        <div className="labelChar">
                            <label className="inputNameLabel" htmlFor="bio">
                                Bio
                            </label>
                            <label className="inputchar" htmlFor="bio">
                                <span id="bioLength"></span>
                            </label>
                        </div>
                        <input onInput={countTextBio} maxLength={30} className="inputName" name="bio" id="bio" type="text" />
                    </div>
                    <div className="inputNameDiv">
                        <label className="inputNameLabelCreated">
                            Created Account at
                        </label>
                        <input className="inputName" type="text" />
                    </div>
                    <button type="submit" className="submit">
                        <FaCheck size={25} className="centang"/>
                    </button>
                </form>
                {/* navbar */}
                <div className="navbar">
                    <a href="/main" className="iconDesc">
                        {/* <img src="/assets/main/icon/icon_home.png" className='iconImage' id="iconImage1" alt="" /> */}
                        <motion.div animate={{translateY: 0}} className="iconImage" id="iconImage1">
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
                        <motion.div animate={{translateY: 0, opacity: 1}} className="round">
                            <FaRegUser size={20} />
                        </motion.div>
                        {/* <img src="/assets/main/icon/icon_profile.png" className='iconImage' alt="" /> */}
                        {/* <div className="iconImage" id="iconImage5">
                            
                        </div> */}
                        <p className="blue">
                            Account
                        </p>
                    </a>
                </div>
            </div>
        </>
    )
}
