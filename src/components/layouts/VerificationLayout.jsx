import React from 'react';
import { Outlet } from 'react-router-dom';

export default function VerificationWrapper({ children }) {
    return (
        <div className="w-full h-screen flex-center">
            {children}
            <Outlet />
        </div>
    );
}