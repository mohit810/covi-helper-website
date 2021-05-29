import React,{ useEffect, useState } from "react";
import firebaseConnection from "./Firebase";
import Loader from "../components/loaders/Loader";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] =useState(null)
    const [pending,setPending] = useState(true)

    useEffect(() => {
        firebaseConnection.auth().onAuthStateChanged((user)=> {
            setCurrentUser(user)
            setPending(false)
        });
    }, []);

    if (pending) {
        return (
            <Loader/>
        )
    }
    return (
        <AuthContext.Provider
            value={{
                currentUser
            }}>
            {children}
        </AuthContext.Provider>
    );


};