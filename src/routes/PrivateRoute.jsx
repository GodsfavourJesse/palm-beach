import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/firebase'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    
    const [user, loading] = useAuthState(auth);
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to='/login' />

    return children;
}

export default PrivateRoute;

// Another error
// Expected `onClick` listener to be a function, instead got a value of `object` type.