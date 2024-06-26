'use client'

import "./style.css";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMinus, FaX, FaHouse, FaMagnifyingGlass, FaPlus, FaBell, FaRegUser } from "react-icons/fa6";
import supabase from '@/app/server/supabaseClient';

export default function Create() {
    const [text, setText] = useState("");
    const [formDisabled, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputCount, setInputCount] = useState(1);
    const [isShareable, setIsShareable] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);

    function checkShareable() {
        if (text.trim() !== "" && inputCount >= 1) {
            const inputs = document.querySelectorAll<HTMLInputElement>('input[type="text"], textarea');
            let allFilled = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    allFilled = false;
                }
            });
            setIsShareable(allFilled);
        } else {
            setIsShareable(false);
        }
    }

    function removeInput() {
        if (inputCount > 1) {
            setInputCount(inputCount - 1);
            // Hapus tag terakhir dari state
            setTags(tags.slice(0, -1)); // Hapus tag terakhir dari array tags
            // Periksa apakah semua tag terisi setelah menghapus tag terakhir
            checkIfAllTagsFilled(tags.slice(0, -1)); // Periksa apakah semua tag terisi dengan tag yang tersisa
        }
    }

    function autoGrow(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const element = event.target;
        element.style.height = "50vw";
        element.style.height = (element.scrollHeight) + "px";
        element.style.paddingBottom = "3vw"
        setText(event.target.value);
    }

    function checkIfAllTagsFilled(updatedTags: string[]) {
        const allFilled = updatedTags.every(tag => tag.trim() !== '');
        setIsShareable(allFilled);
    }

    function addInput() {
        if (inputCount < 3) {
            setInputCount(inputCount + 1);
            // Tambahkan tag kosong untuk input baru
            setTags([...tags, '']); // Tambahkan tag kosong ke array tags
            // Periksa apakah semua tag terisi setelah menambahkan tag baru
            checkIfAllTagsFilled([...tags, '']); // Periksa apakah semua tag terisi dengan menambahkan tag kosong
        }
    }

    const inputElements = [];
    for (let i = 0; i < inputCount; i++) {
        inputElements.push(
            <input
                onKeyDown={(event) => {
                    if (event.key === " ") {
                        event.preventDefault();
                    }
                }}
                key={i} 
                onInput={checkShareable} 
                required 
                placeholder="Content tag" 
                type="text" 
                id={`tag${i}`} 
                name={`tag${i}`}
                value={tags[i] || ''} 
                onChange={(event) => handleTagChange(i, event)}
            />
        );
    }       

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
            console.error('Error fetching user id:', error.message);
            return null;
        }

        if (data.length === 0) {
            console.error(error);
            return null;
        }

        return data[0].id;
    }; 

    // const getPostingId = async () => {
    //     const cookies = document.cookie;
    //     const cookieArray = cookies.split(';');
    //     const cookieObject: Record<string, string> = {};
    
    //     cookieArray.forEach(cookie => {
    //         const [name, value] = cookie.trim().split('=');
    //         cookieObject[name] = decodeURIComponent(value);
    //     });
    
    //     const isLogin = cookieObject['is_login'];
    //     const decryptedEmail = isLogin ? decryptEmail(isLogin) : '';
    
    //     if (!isLogin || !decryptedEmail) {
    //         window.location.href = '/auth/login';
    //         return null;
    //     }
    
    //     const { data, error } = await supabase
    //         .from('posting')
    //         .select('id')
    //         .order('id', { ascending: false })
    //         .limit(1);
    
    //     if (error) {
    //         console.error('Error fetching posting data:', error.message);
    //         return null;
    //     }
    
    //     if (data.length === 0) {
    //         console.error('Posting not found');
    //         return null;
    //     }
    
    //     const postingId = data[0].id+1;

    //     const insertTagPosting = async (postingId: number) => {
    //         const { error } = await supabase
    //             .from('tag_posting')
    //             .insert([{ id_posting: postingId }]);
    
    //         if (error) {
    //             console.error('Error inserting tag posting:', error.message);
    //             return null;
    //         }
    //     };

    //     await insertTagPosting(postingId);

    // return postingId;
    // };
    
    const getTagId = async () => {
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
            console.error('User not found');
            return null;
        }

        return data[0].id;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        setFormSubmitted(true);

        event.preventDefault();
        
        const userId = await getUserId();
        const tagId = await getTagId();
    
        if (!userId || !tagId) {
            return;
        }
    
        // Menghapus file dari bucket jika sudah ada dengan nama yang sama
        let thumbnailFileName = '';
        if (selectedImage) {
            const fileName = selectedImage.name;
            const { data: existingFiles, error: existingFilesError } = await supabase.storage
                .from('foto_post')
                .list();
        
            if (existingFilesError) {
                console.error('Error listing existing files:', existingFilesError.message);
                return;
            }    
    
            const existingFile = existingFiles?.find(file => file.name === fileName);
    
            if (existingFile) {
                const { error: deleteError } = await supabase.storage
                    .from('foto_post')
                    .remove([selectedImage.name]);
    
                if (deleteError) {
                    console.error('Error deleting existing file:', deleteError.message);
                    return;
                }
            }
    
            // Mengunggah file baru ke bucket penyimpanan
            const { data, error } = await supabase.storage
                .from('foto_post')
                .upload(selectedImage.name, selectedImage);
    
            if (error) {
                console.error('Error uploading image:', error.message);
                return;
            }
    
            thumbnailFileName = "https://tyldtyivzeqiedyvaulp.supabase.co/storage/v1/object/public/foto_post/"+fileName;
        }
    
        // Insert posting to database
        const { data: postingData, error: insertError } = await supabase
            .from('posting')
            .insert([{ pesan: text, id_user: userId, thumbnail: thumbnailFileName }]);
    
        if (insertError) {
            console.error('Error inserting posting:', insertError.message);
            return;
        }
    
        // Mendapatkan ID dari posting yang baru saja dimasukkan
        const { data: latestPostingIdData, error: latestPostingIdError } = await supabase
            .from('posting')
            .select('id')
            .order('id', { ascending: false })
            .limit(1);
    
        if (latestPostingIdError) {
            console.error('Error fetching latest posting ID:', latestPostingIdError.message);
            return;
        }
    
        if (!latestPostingIdData || latestPostingIdData.length === 0) {
            console.error('Latest posting ID not found');
            return;
        }
    
        const postingId = latestPostingIdData[0].id;
    
        const existingTags = await Promise.all(tags.map(async (tag) => {
            const { data, error } = await supabase
                .from('tag')
                .select('id')
                .eq('tag', tag);
    
            if (error) {
                console.error('Error fetching tag:', error.message);
                return null;
            }
    
            return data.length > 0 ? data[0].id : null;
        }));
    
        // Filter tag yang tidak ada di tabel tag
        const newTags = tags.filter((tag, index) => existingTags[index] === null);
    
        // Insert tag baru ke tabel tag
        if (newTags.length > 0) {
            const { error: tagInsertError } = await supabase
                .from('tag')
                .insert(newTags.map(tag => ({ tag })));
    
            if (tagInsertError) {
                console.error('Error inserting new tags:', tagInsertError.message);
                return;
            }
        }
    
        // Ambil kembali ID tag yang sudah ada dan ID tag baru
        const tagIds = existingTags.filter(tagId => tagId !== null) as number[];
        const newTagIds = await Promise.all(newTags.map(async (tag) => {
            const { data, error } = await supabase
                .from('tag')
                .select('id')
                .eq('tag', tag);
    
            if (error) {
                console.error('Error fetching new tag id:', error.message);
                return null;
            }
    
            return data.length > 0 ? data[0].id : null;
        }));
    
        newTagIds.forEach(tagId => {
            if (tagId !== null) {
                tagIds.push(tagId);
            }
        });

       // Insert tag_posting to database
        const tagPostingInsertPromises = tagIds.map(tagId => 
            supabase.from('tag_posting').insert([{ id_posting: postingId, id_tag: tagId }])
        );

        const tagPostingInsertResults = await Promise.all(tagPostingInsertPromises);

        // Cek apakah ada kesalahan saat memasukkan data ke dalam tabel 
        tagPostingInsertResults.forEach((result, index) => {
            if (result.error) {
                console.error(`Error inserting tag ${tagIds[index]} into tag_posting:`, result.error.message);
            }
        });

        // Insert tag_posting to database for new tags
        // const newTagPostingInsertPromises = newTagIds.map(tagId => 
        //     supabase.from('tag_posting').insert([{ id_posting: postingId, id_tag: tagId }])
        // );

        // const newTagPostingInsertResults = await Promise.all(tagPostingInsertPromises);

        // Cek apakah ada kesalahan saat memasukkan data ke dalam tabel tag_posting untuk tag baru
        tagPostingInsertResults.forEach((result, index) => {
            if (result.error) {
                console.error(`Error inserting new tag ${newTagIds[index]} into tag_posting:`, result.error.message);
            }
        });

        window.location.href = '/main'; // Redirect ke halaman utama setelah berhasil submit
    };    

    React.useEffect(() => {
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
        }
    }, []);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Generate unique filename using timestamp
            const timestamp = Date.now();
    
            // Jika ada gambar yang sudah dipilih sebelumnya, hapus gambar tersebut
            if (selectedImage) {
                const existingFileName = selectedImage.name;
                const { data: existingFiles, error: existingFilesError } = await supabase.storage
                    .from('foto_post')
                    .list();
                
                if (existingFilesError) {
                    console.error('Error listing existing files:', existingFilesError.message);
                    return;
                }
        
                const existingFile = existingFiles?.find(file => file.name === existingFileName);
        
                if (existingFile) {
                    const { error: deleteError } = await supabase.storage
                        .from('foto_post')
                        .remove([selectedImage.name]);
            
                    if (deleteError) {
                        console.error('Error deleting existing file:', deleteError.message);
                        return;
                    }
                }
            }
    
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
    
            // Mengunggah file baru ke bucket penyimpanan dengan nama unik
            const { data, error } = await supabase.storage
                .from('foto_post')
                .upload(file.name, file);
    
            if (error) {
                console.error('Error uploading image:', error.message);
                return;
            }
        } else {
            console.error('No file selected');
        }
    };
    
    
    
    function handleTagChange(index: number, event: React.ChangeEvent<HTMLInputElement>) {
        // Salin array tags
        const updatedTags = [...tags];
        // Perbarui nilai tag di indeks yang sesuai dengan nilai dari input
        updatedTags[index] = event.target.value;
        // Perbarui state tags dengan nilai yang baru
        setTags(updatedTags);
        // Periksa apakah semua tag terisi setelah perubahan tag
        checkIfAllTagsFilled(updatedTags);
    };

    return (
        <>
            <div className="background">
                <div className="backFixed">
                    <a className="back" href="/main">
                        <FaX size={20}/>
                    </a>
                </div>
                <div className="backTop"></div>
                <div className="over">
                    <form action="" method="post" onSubmit={handleSubmit}>
                        <div className="imgUpload">
                            <label className="thumbnailClass" htmlFor="thumbnail">
                                <FaPlus className={"buttonIcon"} />
                                Add thumbnail
                            </label>
                            <input id="thumbnail" type="file" accept="image/*" style={{display: "none"}} onChange={handleImageChange} />
                        </div>
                        <img src={previewImage ? previewImage : ""} alt="" className="Thumbnail" />
                        <textarea
                            onInput={checkShareable}
                            placeholder="Ask a question"
                            value={text}
                            onChange={autoGrow}
                            className="textArea"
                            required
                        />
                        <div id="new_chq">
                            {inputElements}
                        </div>
                        {/* <input type="hidden" value={inputCount} id="total_chq"/> */}
                        <button disabled={isSubmitting} className={`share ${isSubmitting ? 'submitting' : ''}`}>
                            {isSubmitting ? 'Submitting...' : 'Share'}
                        </button>
                    </form>
                    <div className="button">
                        {inputCount < 3 && ( 
                            <button onClick={addInput}>
                                <FaPlus className={"buttonIcon"} />
                                Add tag
                            </button>
                        )}
                        {inputCount > 1 && ( 
                            <button onClick={removeInput}>
                                <FaMinus className={"buttonIcon"} />
                                Remove tag
                            </button>
                        )}
                    </div>
                </div>
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
                    <a href="/main/user" className="iconDesc">
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