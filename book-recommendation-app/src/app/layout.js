/*This file enables the use of global variables in the application, such as a given
/*user's username in this case*/
"use client";

import { UserProvider } from 'context/user-context';
//import { HelmetProvider } from 'react-helmet-async';
import './globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <UserProvider>
                    {children}
                    {/* <HelmetProvider> */}
                        {/* {children} */}
                    {/* </HelmetProvider> */}
                </UserProvider>
            </body>
        </html>
    );
}

