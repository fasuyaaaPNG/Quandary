'use client'

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import React, { useRef, useState, ChangeEvent, useEffect } from 'react';
import supabase from '@/app/server/supabaseClient';
import { motion } from "framer-motion";
import './style.css';

const Home: React.FC = () => {
  const [photoURL, setPhotoURL] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearInput = () => {
    setInputValue('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const decryptEmail = (encryptedEmail: string): string => {
    const reversedEncryptedEmail = encryptedEmail.split('').reverse().join('');
    const originalEmail = Buffer.from(reversedEncryptedEmail, 'base64').toString();
    return originalEmail;
  }

  useEffect(() => {
    const cookies = document.cookie;
    const cookieArray = cookies.split(';');
    const cookieObject: Record<string, string> = {};
  
    cookieArray.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookieObject[name] = decodeURIComponent(value);
    });
    
    const isLogin = cookieObject['is_login'];
    const decryptedEmail = isLogin ? decryptEmail(isLogin) : '';

    const fetchUserProfile = async () => {
      const { data: userDataa, error: userError } = await supabase
        .from('Users')
        .select('username, name_profile, bio, foto_profile')
        .eq('email', decryptedEmail);

      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }

      if (!userDataa || userDataa.length === 0) {
        console.error('User data not found');
        return;
      }

      const userProfile = userDataa[0];
      if (!userProfile.foto_profile) {
        setPhotoURL('https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/profile.png');
      } else {
        setPhotoURL(`https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/${userProfile.foto_profile}`);
      }
    };
  
    if (!isLogin || !decryptedEmail) {
      window.location.href = '/auth/login';
    } else {
      fetchUserProfile();
    }
    const fetchData = async () => {
      const { data: tagPostingData, error: tagPostingError } = await supabase
        .from('tag_posting')
        .select('id_posting, id_tag');
    
      if (tagPostingError) {
        console.error('Error fetching tag_posting:', tagPostingError.message);
        return;
      }
      
      const groupedPosts: Record<string, boolean> = {};
      const postData = [];
    
      for (const tagPosting of tagPostingData) {
        const idPosting = tagPosting.id_posting;
    
        // Jika id_posting belum ditampilkan sebelumnya, maka tampilkan postingnya
        if (!groupedPosts[idPosting]) {
          const { data: postDataResult, error: postError } = await supabase
            .from('posting')
            .select('pesan, thumbnail, created_at, id_user')
            .eq('id', idPosting);
    
          if (postError) {
            console.error('Error fetching posting:', postError.message);
            continue;
          }
    
          const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('username, name_profile, bio, foto_profile')
            .eq('id', postDataResult[0].id_user);
    
          if (userError) {
            console.error('Error fetching user:', userError.message);
            continue;
          }
    
          const { data: tagData, error: tagError } = await supabase
            .from('tag')
            .select('tag')
            .eq('id', tagPosting.id_tag);
    
          if (tagError) {
            console.error('Error fetching tag:', tagError.message);
            continue;
          }
    
          const post = {
            pesan: postDataResult[0].pesan,
            thumbnail: postDataResult[0].thumbnail,
            created_at: postDataResult[0].created_at,
            username: userData[0].username,
            tag: tagData.map((tag: any) => tag.tag).join(', '),
            foto_profile: `https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/${userData[0].foto_profile}`
          };
    
          postData.push(post);
          groupedPosts[idPosting] = true; // tandai id_posting sudah ditampilkan
        }
      }
    
      setPosts(postData);
    };
  fetchData();
}, []);

  return (
    <>
      <div className="container">
        <div className="searchProfil">
          <div className="search">
            <div className="searchIcon" onClick={handleSearchIconClick}>
              <FontAwesomeIcon
                style={{ fontSize: '3.5vw' }}
                icon={faMagnifyingGlass}
              />
            </div>
            <input type="text" ref={inputRef} value={inputValue} onChange={handleInputChange} placeholder="Search post" className="searchBar"/>
            {inputValue !== '' && (
              <button className="clear-input" onClick={clearInput}>
                X
              </button>
            )}
          </div>
          <a href="/main/profile" className="profilImage">
            <img loading="lazy" src={photoURL} className="profil" alt="" />
          </a>
        </div>
        {/* content */}
        <div className="content">
          {posts.map((post, index) => (
            <div key={index} className="content1">
              <div className="profilUser">
                <img src={post.foto_profile} alt="" className="profilUserImage" />
                <div className="userTime">
                  <p className="username">
                    {post.username}
                  </p>
                  <p className="time">
                    {post.created_at}
                  </p>
                </div>
              </div>
              <img src={post.thumbnail} alt="" className="thumbnail" />
              <div className="deskripsi">
                <p>
                  {post.pesan}
                </p>
              </div>
              <div className="kategori">
                  <div className="kategori1">
                    {post.tag}
                  </div>
              </div>
              <div className="garis"></div>
              <div className="likeComment">
                <div className="like">
                  <img src="/assets/main/icon/like.svg" alt="" className="iconLikeComment" />
                  <p className="countLike">
                    13.895 likes
                  </p>
                </div>
                <div className="comment">
                  <img src="/assets/main/icon/comment.svg" alt="" className="iconLikeComment" />
                  <p className="countComment">
                    378 replies
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* navbar */}
      <div className="navbar">
        <a href="/main" className="iconDesc iconDesc1">
          <motion.div animate={{translateY: -28, opacity: 1}} className="round">
            <FaHouse size={20}/>
          </motion.div>
          <motion.p animate={{color: "#7FA1F8"}} >
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
    </>
  );
}

export default Home;
