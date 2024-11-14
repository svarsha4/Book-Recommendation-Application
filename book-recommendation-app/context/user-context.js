/*This file enables the username of the user, as well as the images generated
for their list of books, to be stored as global variables, so they can
be used for adding new books to the appropriate user*/
"use client";

import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [images, setImages] = useState({});

    return (
        <UserContext.Provider value={{ user, setUser, images, setImages}}>
            {/*Whatever it specified in the UserProvider function will be given access to*/}
            {children}
        </UserContext.Provider>
    );
};

//Exports the user context of saving their username
export const useUser = () => useContext(UserContext);



