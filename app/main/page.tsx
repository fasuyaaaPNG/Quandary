'use client'

import Skeleton from 'react-loading-skeleton';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPaperPlane, FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import React, {useRef, useState, ChangeEvent, useEffect } from 'react';
import supabase from '@/app/server/supabaseClient';
import { motion } from "framer-motion";
import './style.css';

const Home: React.FC = () => {
  const [photoURL, setPhotoURL] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [inputValue, setInputValue] = useState<string>('');
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [commentClickedId, setCommentClickedId] = useState<string | null>(null);
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [userId, setUserId] = useState<string | null>(null);

  interface Comment {
    id: string;
    id_posting: string;
    message: string;
    created_at: string;
    id_user: string;
    username: string;
    foto_profile: string;
  }
  
  const handleDeleteComment = async (commentId: string) => {
    if (!commentId) {
      // console.error('Comment ID is undefined');
      return;
    }
    
    const {data} = await supabase
      .from('comment')
      .select('message')
      .eq('id', commentId)

    if (!data || data.length === 0 || !data[0].message) {
      console.error('Data is empty or message is missing');
      return;
    }

    const { error: deleteComment } = await supabase
      .from('comment')
      .delete()
      .eq('id', commentId);
    
    const { error: deleteNotify } = await supabase
      .from('notif')
      .delete()
      .eq('message_comment', data[0].message);
  
    if (deleteComment || deleteNotify) {
      return;
    }
  
    // Perbarui tampilan komentar setelah menghapus
    fetchComments();
  };

  const fetchComments = async () => {
    const { data: commentsData, error: commentsError } = await supabase
      .from('comment')
      .select('id, id_posting, message, created_at, id_user')
      .order('created_at', { ascending: true });
  
    if (commentsError) {
      console.error('Error fetching comments:', commentsError.message);
      return;
    }
  
    commentsData.forEach(comment => {
      // console.log("Message dari comment:", comment.message);
    });
  
    // Kelompokkan komentar berdasarkan id postingan
    const groupedComments: Record<string, any[]> = {};
    const commentsCount: Record<string, number> = {};
  
    await Promise.all(commentsData.map(async (comment) => {
      const postId = comment.id_posting;
      if (!groupedComments[postId]) {
        groupedComments[postId] = [];
        commentsCount[postId] = 0;
      }
  
      // Fetch user profile based on id_user
      const userId = comment.id_user;
      const { data: userDataComment, error: userError } = await supabase
        .from('Users')
        .select('username, foto_profile')
        .eq('id', userId)
        .single();
  
      if (userError) {
        console.error('Error fetching user profile:', userError.message);
        return;
      }
  
      // Menambahkan informasi pengguna ke objek komentar
      const userComment = {
        ...comment,
        username: userDataComment?.username || 'Unknown User',
        foto_profile: "https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/"+userDataComment?.foto_profile || 'default_profile.jpg',
      };
  
      groupedComments[postId].push(userComment);
      commentsCount[postId]++;
    }));
  
    // Simpan data komentar ke dalam state
    setComments(groupedComments);
    setCommentsCount(commentsCount);
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
            // console.error('Error fetching user id:', error.message);
            return null;
        }

        if (data.length === 0) {
            // console.error(error);
            return null;
        }

        return data[0].id;
    };

    // Function to handle like button click
    const handleLikeClick = async (postId: string) => {
    // Get user ID
    const userId = await getUserId();
    
    if (!userId) {
      // console.error('Failed to get user id');
      return;
    }

    // Check if the user has already liked the post
    const { data: existingLikes, error: likeError } = await supabase
      .from('like')
      .select()
      .eq('id_user', userId)
      .eq('id_posting', postId);

    if (likeError) {
      // console.error('Error fetching likes:', likeError.message);
      return;
    }

    if (existingLikes.length > 0) {
      // If the user has already liked the post, unlike it
      const { error: like } = await supabase
        .from('like')
        .delete()
        .eq('id_user', userId)
        .eq('id_posting', postId);
      
      const { error: notif } = await supabase
        .from('notif')
        .delete()
        .eq('id_user', userId)
        .eq('id_posting', postId);

      if (like || notif) {
        // console.error('Error unliking post:', error.message);
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

      const { data } = await supabase
        .from('posting')
        .select('id_user')
        .eq('id', postId);

    if (!data || data.length === 0) {
        // Handle the case where data is null or empty
        // For example, you can return early or throw an error
        return null;
    }

    // If the user has not liked the post, like it
    const { error: likeError } = await supabase
        .from('like')
        .insert({ id_user: userId, id_posting: postId });

    const { error: notifError } = await supabase
        .from('notif')
        .insert({ id_adminPost: data[0].id_user, id_user: userId, id_posting: postId, comment: false, like: true });

    if (likeError || notifError) {
        // Handle errors if needed
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
    setInputValue(''); // Mengatur nilai input menjadi string kosong
  };
 const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim(); // Menghapus spasi dari awal dan akhir input
      setInputValue(value);

      if (value === '') {
        // Jika input kosong, ambil semua posting
        const { data: allPostData, error: allPostError } = await supabase
          .from('posting')
          .select('id, pesan, thumbnail, created_at, id_user');
        
        if (allPostError) {
          // console.error('Error fetching all posts:', allPostError.message);
          return;
        }

        // Ambil detail pengguna untuk setiap posting
        const postData = await Promise.all(allPostData.map(async (post) => {
            const { data: userData, error: userError } = await supabase
            .from('Users')
            .select('username, name_profile, bio, foto_profile')
            .eq('id', post.id_user);      
              
            if (userError) {
                // console.error('Error fetching user:', userError.message);
                return null;
            }

            // Ambil tag untuk posting
            const { data: tagData, error: tagError } = await supabase
                .from('tag_posting')
                .select('id_tag')
                .eq('id_posting', post.id);
            
            if (tagError) {
                console.error('Error fetching tag data:', tagError.message);
                return null;
            }

            // Mengelompokkan tag berdasarkan idPosting
            const tagIds = tagData.map(tag => tag.id_tag);

            // Ambil detail tag dari tagIds
            const tagDetails = await Promise.all(tagIds.map(async (tagId) => {
                const { data: tagDataResult, error: tagDataError } = await supabase
                    .from('tag')
                    .select('tag')
                    .eq('id', tagId);

                if (tagDataError) {
                    console.error('Error fetching tag data:', tagDataError.message);
                    return '';
                }

                return tagDataResult[0]?.tag || '';
            }));

            return {
                id: post.id,
                pesan: post.pesan,
                thumbnail: post.thumbnail,
                created_at: post.created_at,
                username: userData[0]?.username || '',
                foto_profile: `https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/${userData[0]?.foto_profile || ''}`,
                tag: tagDetails.join(', ')
            };
        }));

        // Hapus posting yang null (jika ada)
        const filteredPostData = postData.filter(post => post !== null);

        // Setel data posting ke dalam state
        setPosts(filteredPostData);
    } else {
      // Pisahkan kata-kata dari input
      const keywords = value.trim().split(" ");

      // Buat daftar tag yang sesuai dengan setiap kata
      const tagLists = await Promise.all(keywords.map(async (keyword) => {
          const { data: tagData, error: tagError } = await supabase
              .from('tag')
              .select('id')
              .eq('tag', keyword);

          if (tagError) {
              console.error('Error fetching tag:', tagError.message);
              return [];
          }

          return tagData.map(tag => tag.id);
      }));
  
      // Gabungkan semua tag yang sesuai menjadi satu set tag unik
      const tagIds = tagLists.flat();
  
      // Cari posting yang memiliki setidaknya satu dari tag tersebut
      const { data: tagPostingData, error: tagPostingError } = await supabase
        .from('tag_posting')
        .select('id_posting')
        .in('id_tag', tagIds);

      if (tagPostingError) {
          console.error('Error fetching tag_posting:', tagPostingError.message);
          return;
      }

      // Ambil ID posting dari hasil pencarian tag_posting
      const postIds = tagPostingData.map(tagPosting => tagPosting.id_posting);

      // Ambil detail posting berdasarkan ID yang ditemukan
      const postData = [];
      for (const idPosting of postIds) {
          const { data: postDataResult, error: postError } = await supabase
              .from('posting')
              .select('id, pesan, thumbnail, created_at, id_user')
              .eq('id', idPosting); // Mengambil posting yang memiliki ID sesuai hasil pencarian
  
          if (postError) {
              console.error('Error fetching posting:', postError.message);
              continue; // Lanjutkan ke posting berikutnya jika terjadi kesalahan
          }
  
          // Ambil data pengguna yang membuat posting
          const { data: userData, error: userError } = await supabase
              .from('Users')
              .select('username, name_profile, bio, foto_profile')
              .eq('id', postDataResult[0].id_user);
  
          if (userError) {
              console.error('Error fetching user:', userError.message);
              continue; // Lanjutkan ke posting berikutnya jika terjadi kesalahan
          }
  
          // Ambil tag dari posting
          const { data: tagData, error: tagError } = await supabase
              .from('tag_posting')
              .select('id_tag')
              .eq('id_posting', idPosting);
  
          if (tagError) {
              console.error('Error fetching tag data:', tagError.message);
              continue; // Lanjutkan ke posting berikutnya jika terjadi kesalahan
          }
  
          // Mengelompokkan tag berdasarkan idPosting
          const tagIds = tagData.map(tag => tag.id_tag);
  
          // Ambil detail tag dari tagIds
          const tagDetails = await Promise.all(tagIds.map(async (tagId) => {
              const { data: tagDataResult, error: tagDataError } = await supabase
                  .from('tag')
                  .select('tag')
                  .eq('id', tagId);
  
              if (tagDataError) {
                  console.error('Error fetching tag data:', tagDataError.message);
                  return '';
              }
  
              return tagDataResult[0]?.tag || '';
          }));
  
          // Buat objek posting dengan data yang diperoleh
          const post = {
              id: postDataResult[0].id,
              pesan: postDataResult[0].pesan,
              thumbnail: postDataResult[0].thumbnail,
              created_at: postDataResult[0].created_at,
              username: userData[0].username,
              tag: tagDetails.join(', '),
              foto_profile: `https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_profile/${userData[0].foto_profile}`
          };
  
          // Ambil jumlah "likes" dari tabel "like" untuk posting saat ini
          const { data: likeData, error: likeError } = await supabase
              .from('like')
              .select('id_posting')
              .eq('id_posting', idPosting);
  
          if (likeError) {
              console.error('Error fetching likes:', likeError.message);
              continue; // Lanjutkan ke posting berikutnya jika terjadi kesalahan
          }
  
          const likeCount = likeData ? likeData.length : 0;
  
          // Simpan jumlah "likes" ke dalam state
          setLikeCounts((prevCounts) => ({
              ...prevCounts,
              [idPosting]: likeCount,
          }));
  
          // Tambahkan posting ke array data posting
          postData.push(post);
      }
  
      // Setel data posting ke dalam state
      setPosts(postData);
  }
};
  

  const decryptEmail = (encryptedEmail: string): string => {
    const reversedEncryptedEmail = encryptedEmail.split('').reverse().join('');
    const originalEmail = Buffer.from(reversedEncryptedEmail, 'base64').toString();
    return originalEmail;
  }

  function autoGrow(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const element = event.target;
    element.style.height = "2vw";
    element.style.height = (element.scrollHeight) + "px";
    element.style.paddingBottom = "2vw"
    element.style.paddingTop = "2vw"
    element.style.paddingRight = "4vw"
    setText(event.target.value);
  }

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
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };


  const handleCommentClick = (postId: string) => {
    // Set the comment clicked ID
    setCommentClickedId(postId === commentClickedId ? null : postId);
  };
  
  const sendComment = async (postId: string) => {
    // Mendapatkan ID pengguna
    const userId = await getUserId();
    
    if (!userId) {
      // console.error('Failed to get user id');
      return;
    }

    const { data } = await supabase
        .from('posting')
        .select('id_user')
        .eq('id', postId);

    if (!data || data.length === 0) {
        // Handle the case where data is null or empty
        // For example, you can return early or throw an error
        return null;
    }
  
    // Mengirim komentar ke database
    const { error: commentError } = await supabase
      .from('comment')
      .insert({ id_user: userId, id_posting: postId, message: text });

    const { error: notifError } = await supabase
      .from('notif')
      .insert({ id_adminPost: data[0].id_user,id_user: userId, id_posting: postId, comment: true,  like: false, message_comment: text });
  
    if (commentError || notifError) {
      // console.error('Error sending comment:', error.message);
      return;
    }
  
    // Reset nilai text
    setText('');
  
    // Reload komentar setelah berhasil mengirim
    fetchComments();
  };
  
  const handleFormSubmit = (postId: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendComment(postId);
  };

  const fetchUserData = async () => {
    const id = await getUserId();
    if (id) {
      setUserId(id);
    }
  };
  fetchUserData();

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
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('username, name_profile, bio, foto_profile')
        .eq('email', decryptedEmail);
    
      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }
    
      if (!userData || userData.length === 0) {
        console.error('User data not found');
        return;
      }
    
      const userProfile = userData[0];
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
      // console.error('Error fetching tag_posting:', tagPostingError.message);
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

        // Periksa apakah postDataResult tidak kosong
        if (!postDataResult || postDataResult.length === 0) {
          // console.error('No data found for idPosting:', idPosting);
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
    
        const tagIds = groupedTags[idPosting];
        const tagData = await Promise.all(tagIds.map(async (tagId: string) => {
        const { data: tagDataResult, error: tagError } = await supabase
          .from('tag')
          .select('tag')
          .eq('id', tagId);

        if (tagError) {
          // console.error('Error fetching tag:', tagError.message);
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
        // console.error('Error fetching likes:', likeError.message);
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
  fetchComments();
}, []);

  return (
    <>
      <div className="container">
        <div className="searchProfil">
          <div className="search">
          <Skeleton height={40} width={40} circle={true} />
            <div className="searchIcon" onClick={handleSearchIconClick}>
              <FontAwesomeIcon
                style={{ fontSize: '3.5vw' }}
                icon={faMagnifyingGlass}
              />
            </div>
            <input type="search" ref={inputRef} value={inputValue} onChange={handleInputChange} placeholder="Search post from tag" className="searchBar"/>
            {/* {inputValue !== '' && (
              <button className="clear-input" onClick={clearInput}>
                X
              </button>
            )} */}
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
                {post.tag && post.tag.split(',').map((tag: any, tagIndex: any) => (
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
                <div className="comment" onClick={() => handleCommentClick(post.id)}>
                  <img src="/assets/main/icon/comment.svg" alt="" className="iconLikeComment" />
                  <p className="countComment">
                    {commentsCount[post.id] || 0} replies
                  </p>
                </div>
              </div>
              {comments[post.id] &&
                comments[post.id]
                  .slice()
                  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                  .map((comment, commentIndex) => (
                    <div key={commentIndex} className={`isiComment ${commentClickedId === post.id ? 'unhide' : ''}`}>
                      {userId === comment.id_user && ( // Tampilkan tombol hapus hanya jika pengguna adalah pemilik komentar
                        <button className="deleteComment" onClick={() => handleDeleteComment(comment.id)}>
                          Delete
                        </button>
                      )}
                      <div className="commentProfileUser">
                        <img src={comment.foto_profile} alt="" className="fotoComment" />
                        <div className="UserHour">
                          <p className="username">
                            {comment.username}
                          </p>
                          <p className="time">
                            {getTimeAgoString(comment.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="pesanComment">{comment.message}</p>
                    </div>
                ))
              }
              <form className={`formSend ${commentClickedId === post.id ? 'unhide2' : ''}`} onSubmit={handleFormSubmit(post.id)} action="">
                <textarea
                  placeholder="Ask a question"
                  value={text}
                  onChange={autoGrow}
                  className="inputComment"
                  required
                  onBeforeInput={autoGrow}
                />
                <button type="submit" className="sendIcon">
                  <FaPaperPlane size={15} />
                </button>
              </form>
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
        <a href="/main/user" className="iconDesc">
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
