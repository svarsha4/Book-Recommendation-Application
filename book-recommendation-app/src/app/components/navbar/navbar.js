/*This file creates a navigation bar to be used for the home page.*/

//Ensures that we are using client-side rendering, so that the useState hook and the App Router can
//be used simultaneously.
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
//Imports the logout symbol
import Image from 'next/image';
import logoutIcon from '/public/images/logout.png';
//References the navbar.css file used for styling the navigation bar
import '/src/app/styles/navbar.css';

export default function NavBar() {
  const router = useRouter();

  //Enables the user to navigate to different pages depending on the tabs they select, which are the Home and My Books tabs.
  //The classNames for the divisions specify what kind of styling will be applied when referencing the navbar.css file.
  const handleNavigation = (path) => {
    router.push(path);
  };

  //Makes sure the user logs out of the application once they click the logout symbol on the navigation bar and then
  //navigate to the sign in page
  const handleLogoutClick = () => {
    router.push('/auth/sign-in');
  };

  return (
    <>
      <nav className="navbar">
        <button className="logout-button" onClick={handleLogoutClick}>
          <Image 
            src={logoutIcon}
            alt="Logout" 
            width={35}
            height={35} 
            className="logout-image" 
          />
        </button>
        
        <div className="navbar-container">
          <div className="navbar-links">
            <button onClick={() => handleNavigation('/home')} className="navbar-link">Home</button>
            <button onClick={() => handleNavigation('/book-list')} className="navbar-link">My Books</button>
          </div>
        </div>
      </nav>
    </>

  );
}
