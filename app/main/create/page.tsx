'use client'

import "./style.css"
import React, { useState } from "react";
import { motion } from "framer-motion";
import {FaX, FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";

export default function Create() {
    const [text, setText] = useState("");

    function autoGrow(event:React.ChangeEvent<HTMLTextAreaElement>) {
        const element = event.target;
        element.style.height = "50vw";
        element.style.height = (element.scrollHeight) + "px";
        setText(event.target.value);
    }

    return (
        <>
            <div className="background">
                <a className="back" href="/main">
                    <FaX size={20}/>
                </a>
                <form action="" method="post">
                    <textarea
                        placeholder="Ask a question"
                        value={text}
                        onChange={autoGrow}
                        className="textArea"
                    />
                </form>
                <button>
                        <FaPlus/>
                        Add
                </button>
                {/* navbar */}
                <div className="navbar">
                    <a href="/main" className="iconDesc">
                        {/* <img src="/assets/main/icon/icon_home.png" className='iconImage' id="iconImage1" alt="" /> */}
                        <motion.div className="iconImage" id="iconImage1">
                            <FaHouse size={15} />
                        </motion.div>
                        <motion.p >
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
                    <a href="/main/create" className="iconDesc iconDesc3">
                        {/* <img src="/assets/main/icon/icon_new post.png" className='iconImage' alt="" /> */}
                        <motion.div animate={{translateY: -25, opacity: 1}} className="round">
                            <FaPlus size={20} />
                        </motion.div>
                        {/* <motion.div animate={{translateY: -10}} className="iconImage" id="iconImage3">
                            
                        </motion.div> */}
                        <motion.p animate={{color: "#7FA1F8"}} >
                            New Post
                        </motion.p>
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
                        {/* <img src="/assets/main/icon/icon_profile.png" className='iconImage' alt="" /> */}
                        <motion.div className="iconImage" id="iconImage5">
                            <FaRegUser size={15} />
                        </motion.div>
                        <motion.p className='iconText1'>
                            Account
                        </motion.p>
                    </a>
                </div>
            </div>
        </>
    )
}