import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        
        const handleAuth = async () => {
            if (token) {
                // Determine layout behavior:
                // If the backend sets an HttpOnly cookie, we might not strictly need to store this token locally 
                // unless we are using it for an Authorization header.
                // However, the backend logic sends it for a reason.
                
                // Save the token to localStorage to prevent cross-origin issues
                // relying only on cookies fails on Safari/Brave due to 3rd-party cookie blocking
                localStorage.setItem('token', token);
                
                try {
                    await fetchUser();
                    navigate('/dashboard'); // or /resume
                } catch (err) {
                    console.error("Auth Success Verification Failed:", err);
                    navigate('/login?error=verification_failed');
                }
            } else {
                navigate('/login?error=no_token');
            }
        };

        handleAuth();
    }, [searchParams, navigate, fetchUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Completing Sign In...</h2>
                <p className="text-gray-500 mt-2">Please wait while we log you in.</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
