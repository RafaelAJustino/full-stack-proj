import React from 'react'
import {  Navigate } from 'react-router-dom';
import { getJwtToken } from '../../../utils/token';

function PrivateRoute({ children, redirectTo }: any) {
    const isAuthenticated = getJwtToken() !== null;

    return (
        isAuthenticated ? children : <Navigate to={redirectTo} />
    );
}

export default PrivateRoute
