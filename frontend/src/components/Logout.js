import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import React from 'react';
export default function Logout() {
    const auth = useContext(AuthContext);
    useEffect(() => {
        auth.logout();
    });
    return <></>;
}
