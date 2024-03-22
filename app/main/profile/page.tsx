'use client'

import { useState, useEffect } from 'react';
import { FaEllipsis, FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import { motion } from 'framer-motion';
import supabase from '@/app/server/supabaseClient';
import './style.css';

export default function Profile() {
    const [username, setUsername] = useState('');
    const [userProfileName, setUserProfileName] = useState('');
    const [bio, setBio] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [posts, setPosts] = useState<any[]>([]);
    const [postLike, setPost] = useState<any[]>([]);
    const [optionVisible, setOptionVisible] = useState(true);
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

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
            localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts)); // Simpan updatedLikedPosts ke localStorage
            return updatedLikedPosts;
          });
    
        }
      };

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
            // console.error('Error fetching user id:', error.message);
            return null;
        }

        if (data.length === 0) {
            console.error(error);
            return null;
        }

        return data[0].id;
    };

    const deletePost = async (postId: string) => {
        const { error } = await supabase
            .from('posting')
            .delete()
            .eq('id', postId);
    
        if (error) {
            console.error('Error deleting post:', error.message);
            return;
        }
    
        // Perbarui daftar postingan setelah penghapusan berhasil dilakukan
        setPosts(posts.filter(post => post.id !== postId));
    };
    
    // Tambahkan event handler untuk menangani penghapusan postingan
    const handleDeletePost = async (postId: string) => {
        const confirmation = window.confirm('Are you sure you want to delete this post?');
    
        if (confirmation) {
            await deletePost(postId);
        }
    };

    const getLikedPostsFromLocalStorage = () => {
        const likedPostsFromStorage = localStorage.getItem('likedPosts');
            if (likedPostsFromStorage) {
                setLikedPosts(JSON.parse(likedPostsFromStorage));
            }
        };

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
        const fetchUserProfile = async () => {
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
                return;
            }

            const { data, error } = await supabase
                .from('Users')
                .select('username, name_profile, bio, foto_profile')
                .eq('email', decryptedEmail);

            if (error) {
                // console.error('Error fetching user profile:', error.message);
                return;
            }

            if (data.length === 0) {
                console.error('User not found');
                return;
            }

            const userProfile = data[0];
            setUsername(userProfile.username);
            setUserProfileName(userProfile.name_profile);
            setBio(userProfile.bio);

            if (!userProfile.foto_profile) {
                setPhotoURL('https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/profile.png');
            } else {
                setPhotoURL("https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/"+userProfile.foto_profile);
            }
        };

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
                // console.error('Error fetching user:', userError.message);
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
      
            const postL = {
                id: postDataResult[0].id,
                pesan: postDataResult[0].pesan,
                thumbnail: postDataResult[0].thumbnail,
                created_at: postDataResult[0].created_at,
                username: userData[0].username,
                tag: tagData.join(', '),
                foto_profile: `https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/${userData[0].foto_profile}`
            };
      
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
      
      
            postData.push(postL);
          }
      
          setPost(postData);
        };

        fetchData();
        getLikedPostsFromLocalStorage();
        fetchUserProfile();
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            getLikedPostsFromLocalStorage();
        };
        const fetchUserPosts = async () => {
            const userId = await getUserId();
    
            const { data: userPosts, error: postError } = await supabase
                .from('posting')
                .select('id, pesan, thumbnail, created_at')
                .eq('id_user', userId);
    
            if (postError) {
                // console.error('Error fetching user posts:', postError.message);
                return;
            }

            // Listen for changes in localStorage
            window.addEventListener('storage', handleStorageChange);
    
            // Iterate through userPosts to fetch and append tags for each post
            const postsWithData = await Promise.all(userPosts.map(async (post) => {
                // Fetch tags for the current post from tag_posting table
                const { data: tagPostingData, error: tagPostingError } = await supabase
                    .from('tag_posting')
                    .select('id_tag')
                    .eq('id_posting', post.id);
    
                if (tagPostingError) {
                    console.error('Error fetching tag_posting:', tagPostingError.message);
                    return { ...post, tags: [] }; // Return post with empty tags array
                }
    
                // Extract tag ids from tagPostingData
                const tagIds = tagPostingData.map(tagPosting => tagPosting.id_tag);
    
                // Fetch tag names from tag table using tag ids
                const { data: tagData, error: tagError } = await supabase
                    .from('tag')
                    .select('tag')
                    .in('id', tagIds);
    
                if (tagError) {
                    console.error('Error fetching tags:', tagError.message);
                    return { ...post, tags: [] }; // Return post with empty tags array
                }
    
                // Extract tag names from tagData
                const tags = tagData.map(tag => tag.tag);
    
                // Return post object with tags
                return { ...post, tags };
            }));
    
            setPosts(postsWithData);
        };
    
        fetchUserPosts();
    }, []);

    const handleLogout = () => {
        document.cookie = 'is_login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/auth/login';
    };


    return (
        <>
            <h1 className="profile">
                Profile
            </h1>
            <img loading='lazy' src={photoURL} alt="" className="fotoProfile" />
            <div className="deskProfile">
                <p className="namaAkun">
                    {userProfileName}
                </p>
                <p className="usernameAkun">
                    @{username}
                </p>
                <p className="bioAkun">
                    {bio}
                </p>
            </div>
            <a href="/main/profile/edit" className="editProfile">
                <p className="text">
                    Edit profile
                </p>
                <img src="/assets/profile/iconEdit.png" alt="" className="icon" />
            </a>
            <img onClick={handleLogout} src="/assets/profile/logout.png" alt="" className="logoutButton" />
            <div className="content">
                {posts.slice().reverse().map((post, postIndex) => (
                    <div key={post.id} className="content1">
                        <div className="profilUser">
                            <img loading="lazy" src={photoURL} alt="" className="profilUserImage" />
                            <div className="userTime">
                                <p className="username">
                                    {username}
                                </p>
                                <p className="time">
                                    {getTimeAgoString(post.created_at)}
                                </p>
                            </div>
                        </div>
                        <div id="option" className="optionMore">
                            <button onClick={() => handleDeletePost(post.id)} className='delete'>
                                Delete
                            </button>
                        </div>
                        <img loading="lazy" src={post.thumbnail} alt="" className="thumbnail" />
                        <div className="deskripsi">
                            <p>
                                {post.pesan}
                            </p>
                        </div>
                        <div className="kategori">
                            {post.tags.map((tag: string, tagIndex: number) => (
                                <div key={tagIndex} className="kategori1">
                                    {tag}
                                </div>
                            ))}
                        </div>
                        <div className="garis"></div>
                        <div className="likeComment">
                            <div className="like" onClick={() => handleLikeClick(post.id)}>
                                <img src={`${likedPosts[post.id] ? "/assets/main/icon/liked.png" : "/assets/main/icon/like.svg"}`} alt="" className="iconLikeComment"/>
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
            {/* navbar */}
            <div className="navbar">
                <a href="/main" className="iconDesc">
                    {/* <img src="/assets/main/icon/icon_home.png" className='iconImage' id="iconImage1" alt="" /> */}
                    <motion.div className="iconImage" id="iconImage1">
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
                    <motion.div animate={{translateY: -13, opacity: 1}} className="round">
                        <FaRegUser size={20} className="userIcon" />
                    </motion.div>
                    {/* <img src="/assets/main/icon/icon_profile.png" className='iconImage' alt="" /> */}
                    {/* <motion.div animate={{translateY: -10}} className="iconImage" id="iconImage5">
                        
                    </motion.div> */}
                    <motion.p animate={{color: "#7FA1F8"}} >
                        Account
                    </motion.p>
                </a>
            </div>
        </>
    )
}