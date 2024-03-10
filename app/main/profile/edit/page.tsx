'use client'

import { motion } from "framer-motion";
import {FaArrowLeft, FaCheck, FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import "./style.css"

export default function Edit() {
    return (
        <> 
            <div className="background">
                <div className="profileAtas">
                    <FaArrowLeft size={20} className="back"/>
                    <h1 className="profile">
                        Edit profile
                    </h1>
                    <FaCheck size={25} className="centang"/>
                </div>
                <label htmlFor="uploadInput">
                    <img src="/assets/main/image1.jpg" alt="" className="profileImage" />
                    <img src="/assets/editProfile/iconImage.png" className="iconProfile" alt="" />
                </label>
                <input type="file" id="uploadInput" className="image" style={{ display: "none" }} />
                {/* navbar */}
                <div className="navbar">
                    <motion.div animate={{translateY: 0, opacity: 1}} className="round"></motion.div>
                    <a href="/main" className="iconDesc">
                        {/* <img src="/assets/main/icon/icon_home.png" className='iconImage' id="iconImage1" alt="" /> */}
                        <motion.div animate={{translateY: 0}} className="iconImage" id="iconImage1">
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
                        <div className="iconImage" id="iconImage5">
                            <FaRegUser size={20} />
                        </div>
                        <p className="blue">
                            Account
                        </p>
                    </a>
                </div>
            </div>
        </>
    )
}