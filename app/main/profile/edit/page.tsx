'use client'

import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import { motion } from "framer-motion";
import supabase from '@/app/server/supabaseClient';
import "./style.css";

function decryptEmail(encryptedEmail: string): string {
    if (!encryptedEmail) {
        return '';
    }
    const reversedEncryptedEmail = encryptedEmail.split('').reverse().join('');
    const originalEmail = Buffer.from(reversedEncryptedEmail, 'base64').toString();
    return originalEmail;
}

export default function Edit() {
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [createat, setCreate] = useState('');
    const [fullnameLength, setFullnameLength] = useState(0);
    const [usernameLength, setUsernameLength] = useState(0);
    const [bioLength, setBioLength] = useState(0);
    const [isLogin, setIsLogin] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [photoURL, setPhotoURL] = useState('');

    useEffect(() => {
        const cookies = document.cookie;
        const cookieArray = cookies.split(';');
        const cookieObject: Record<string, string> = {};

        cookieArray.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            cookieObject[name] = decodeURIComponent(value);
        });
        
        const encryptedSession = cookieObject['is_login'];
        const decryptedSession = decryptEmail(encryptedSession);
        setIsLogin(decryptedSession);

        if (!decryptedSession) { 
            window.location.href = '/auth/login';
        }

        const fetchUserProfile = async () => {
            const { data, error } = await supabase
                .from('Users')
                .select('username, name_profile, bio, created_at, foto_profile')
                .eq('email', decryptedSession);
          
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

            if (!userProfile.foto_profile) {
                setPhotoURL('https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/profile.png');
            } else {
                setPhotoURL("https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/"+userProfile.foto_profile);
            }
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

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let photoURL: string | null = null;

        if (selectedImage) {
            const { data, error } = await supabase.storage.from('foto_profile').upload(selectedImage.name, selectedImage);
            if (error) {
                console.error('Error uploading image:', error.message);
                alert(error.message)
            } else {
                if (data) {
                    photoURL = data.path;
                }
            }
        }

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
                .insert([{ email: isLogin, name_profile: fullname, username, bio, foto_profile: photoURL }]);
    
            if (insertError) {
                console.error('Error inserting new user profile:', insertError.message);
                return;
            }
        } else {
            const { error: updateError } = await supabase
                .from('Users')
                .update({ name_profile: fullname, username, bio, foto_profile: photoURL })
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
                    {previewImage ? (
                        <img loading="lazy" src={previewImage} alt="Profile" className="profileImage" />
                    ) : (
                        <img loading="lazy" src={photoURL} alt="" className="profileImage" />
                    )}
                    <img src="/assets/editProfile/iconImage.png" className="iconProfile" alt="" />
                </label>
                <input type="file" id="uploadInput" accept="image/*" className="image" style={{ display: "none" }} onChange={handleImageChange} />
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