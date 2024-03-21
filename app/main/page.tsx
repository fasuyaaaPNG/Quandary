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
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const getPostingId = async () => {
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
        .from('posting')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching posting data:', error.message);
    } else {
        if (data && data.length > 0) {
            const modifiedData = data.map(post => {
                post.id = post.id + 1;
                return post;
            });
            console.log('Modified Data:', modifiedData);
        } else {
            console.error('No posting data found.');
        }
    }

    if (error) {
        console.error('Error fetching posting id:', error.message);
        return null;
    }

    if (data.length === 0) {
        console.error('Posting not found');
        return null;
    }

    return data[0].id;
};

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

    // Function to handle like button click
    const handleLikeClick = async (postId: string) => {
    // Get user ID
    const userId = await getUserId();
    
    if (!userId) {
      console.error('Failed to get user id');
      return;
    }

    // Check if the user has already liked the post
    const { data: existingLikes, error: likeError } = await supabase
      .from('like')
      .select()
      .eq('id_user', userId)
      .eq('id_posting', postId);

    if (likeError) {
      console.error('Error fetching likes:', likeError.message);
      return;
    }

    if (existingLikes.length > 0) {
      // If the user has already liked the post, unlike it
      const { error } = await supabase
        .from('like')
        .delete()
        .eq('id_user', userId)
        .eq('id_posting', postId);

      if (error) {
        console.error('Error unliking post:', error.message);
        return;
      }

      // Update like count in state by decrementing
      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: (prevCounts[postId] || 0) - 1,
      }));

      // Update likedPosts state
      setLikedPosts((prevState) => {
        const updatedLikedPosts = { ...prevState, [postId]: false };
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
        return updatedLikedPosts;
      });
    } else {
      // If the user has not liked the post, like it
      const { error } = await supabase
        .from('like')
        .insert({ id_user: userId, id_posting: postId });

      if (error) {
        console.error('Error liking post:', error.message);
        return;
      }

      // Update like count in state by incrementing
      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: (prevCounts[postId] || 0) + 1,
      }));

      // Update likedPosts state and localStorage
      setLikedPosts((prevState) => {
        const updatedLikedPosts = { ...prevState, [postId]: true };
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
        return updatedLikedPosts;
      });

      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    }
  };

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

  const getTimeAgoString = (createdAt: string): string => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - createdDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };

  useEffect(() => {
    const cookies = document.cookie;
    const cookieArray = cookies.split(';');
    const cookieObject: Record<string, string> = {};

    const likedStatus = localStorage.getItem('likedPosts');
    if (likedStatus) {
      setLikedPosts(JSON.parse(likedStatus));
    }
  
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
    
      const groupedTags: Record<string, string[]> = {};

      tagPostingData.forEach(tagPosting => {
        const idPosting = tagPosting.id_posting;
        const idTag = tagPosting.id_tag;

        if (!groupedTags[idPosting]) {
          groupedTags[idPosting] = [idTag];
        } else {
          groupedTags[idPosting].push(idTag);
        }
      });

      const postData = [];
      for (const idPosting in groupedTags) {
        const { data: postDataResult, error: postError } = await supabase
          .from('posting')
          .select('id, pesan, thumbnail, created_at, id_user')
          .eq('id', idPosting);
    
        if (postError) {
          console.error('Error fetching posting:', postError.message);
          continue;
        }
    
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('username, name_profile, bio, foto_profile')
          .eq('id', postDataResult[0]?.id_user);
    
        if (userError) {
          console.error('Error fetching user:', userError.message);
          continue;
        }
    
        const tagIds = groupedTags[idPosting];
        const tagData = await Promise.all(tagIds.map(async (tagId: string) => {
        const { data: tagDataResult, error: tagError } = await supabase
          .from('tag')
          .select('tag')
          .eq('id', tagId);

        if (tagError) {
          console.error('Error fetching tag:', tagError.message);
          return '';
        }

        return tagDataResult[0]?.tag || ''; 
      }));

      const post = {
        id: postDataResult[0].id,
        pesan: postDataResult[0].pesan,
        thumbnail: postDataResult[0].thumbnail,
        created_at: postDataResult[0].created_at,
        username: userData[0].username,
        tag: tagData.join(', '),
        foto_profile: `https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/${userData[0].foto_profile}`
      }

      // Ambil jumlah "likes" dari tabel "like" untuk posting saat ini
      const { data: likeData, error: likeError } = await supabase
        .from('like')
        .select('id_posting')
        .eq('id_posting', idPosting);

      if (likeError) {
        console.error('Error fetching likes:', likeError.message);
        continue;
      }

      const likeCount = likeData ? likeData.length : 0;

      // Simpan jumlah "likes" ke dalam state
      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [idPosting]: likeCount,
      }));


      postData.push(post);
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
          {posts.slice().reverse().map((post, index) => (
            <div key={index} className="content1">
              <div className="profilUser">
                <img loading="lazy" src={post.foto_profile} alt="" className="profilUserImage" />
                <div className="userTime">
                  <p className="username">
                    {post.username} 
                  </p>
                  <p className="time">
                    {getTimeAgoString(post.created_at)}
                  </p>
                </div>
              </div>
              <img loading="lazy" src={post.thumbnail} alt="" className="thumbnail" />
              <div className="deskripsi">
                <p>
                  {post.pesan}
                </p>
              </div>  
              <div className="kategori">
                {post.tag.split(',').map((tag: any, tagIndex: any) => (
                  <div key={tagIndex} className="kategori1">
                    {tag}
                  </div>
                ))}
              </div>
              <div className="garis"></div>
              <div className="likeComment">
                <div className="like" onClick={() => handleLikeClick(post.id)} >
                  <img
                    src={`${likedPosts[post.id] ? "/assets/main/icon/liked.png" : "/assets/main/icon/like.svg"}`}
                    alt=""
                    className="iconLikeComment"
                  />
                  <p className="countLike">
                    {likeCounts[post.id] !== undefined ? `${likeCounts[post.id]} likes` : '0 likes'}
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
