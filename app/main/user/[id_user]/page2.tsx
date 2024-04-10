'use client'

import { useSearchParams, usePathname } from 'next/navigation'; // Menggunakan useSearchParams untuk mendapatkan id_user dari URL
import { useEffect, useState } from 'react';
import supabase from "@/app/server/supabaseClient";

export default function UserDetail() {
    const [userData, setUserData] = useState<any>(null);
    const pathname = usePathname();

    useEffect(() => {
        const userId = getIdFromPathname(pathname);
        fetchUserData(userId);
    });

    const getIdFromPathname = (pathname: string) => {
        const parts = pathname.split('/');
        return parts[parts.length - 1];
    };

    const fetchUserData = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('Users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                throw new Error('Failed to fetch user data');
            }
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    return (
        <div>
            <h1>User Detail</h1>
            {userData && (
                <>
                    <p>ID: {userData.id}</p>
                    <p>Username: {userData.username}</p>
                    <p>Name: {userData.name_profile}</p>
                    <p>Bio: {userData.bio}</p>
                </>
            )}
        </div>
    );
}
