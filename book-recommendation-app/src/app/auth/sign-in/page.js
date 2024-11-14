/*This file creates the webpage in the application where the user logs in with their username and password.
If the user doesn't have an account, they also have the option to sign up.*/

//Ensures that we are using client-side rendering, so that the useState hook and the App Router can
//be used simultaneously.
"use client";

//Imports the styling from the src\app\styles\login.css file
import '/src/app/styles/login.css';

//Imports the necessary components from React.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
//Ensures that the App Router can be used for this webpage
import { useRouter } from 'next/navigation';
import axios from 'axios';
//Imports the user's username from the context/user-context.js file
import { useUser } from '/context/user-context.js';
//Imports the utils.js file used to generate images
import { generateImages } from '/src/utils/utils.js';

//Initially, this function creates the variables called username and password, which stores the user's login credentials, as well as the variable
//error, which keeps track of whether the user actually typed in their correct credentials, if they even have credentials in the first place.
//Initially, the username and password are empty strings, since the user hasn't typed them yet.
//The user's information corresponding to each of the variables get stored in the setter functions.
export default function SignIn() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    //Represents the user's username
    const { setUser, setImages } = useUser();

    /*This subfunction makes sure that the sign in process works in a successful manner. This means that when a user logs in for the first time,
    their credentials will be stored, so that they are recognized in the future when they login again. In order to recognize an existing
    user's credentials, an API request will be sent.*/
    const handleLogin = async (e) => {
      e.preventDefault();

      try {
        //Fetches the specified credentials from the user through an API request
        const response = await axios.post('/api/auth/login', {
          username,
          password,
        });
        //If the specified credentials from the API request match those inputted by the user, then that means they have an account and
        //are therefore able to sign in successfully; from there, they navigate to the home page.
        //Otherwise, they don't have an account and need to sign up.
        if (response.status === 200) {
          //Saves the user's username
          setUser({ username });

          try {
            //Generates the images for the user's list of books as soon as they log in
            const booksResponse = await axios.get(`/api/my-books?username=${username}`);
            const booksData = booksResponse.data.books || [];
            const images = await generateImages(booksData);
            setImages(images);
          } catch (imageError) {
            console.error('Error generating images:', imageError);
            setError('Failed to load book images');
          }
          router.push('/home');
        } else {
          setError(response.data.message || 'An unexpected error occurred');
        }
    } catch (error) {
      setError('Incorrect username/password');
    }
  };
      
  //This subfunction navigates to the sign up page if the user clicks on the sign up button to create their account
  const navigateToSignUp = () => {
    router.push('/auth/sign-up');
  };

  //Used to optimize the performance of the application load times
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Handle any cleanup or pausing tasks here, if necessary
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, []);

  /*The function SignIn() returns the contents that will be displayed on the sign in webpage. The classNames corresponding to each div specify how different
  components of the sign in page will be styled.*/
  return (
    <div className="login-container" data-testid="login-container">
      <meta name="description" content="Sign in to your account to access personalized book recommendations and manage your reading preferences."/>
      <Helmet>
        <title>Sign In</title>
      </Helmet> 
      <div className="login-form">
        <h1 className="login-header">Sign In</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
            className="login-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
        <button onClick={navigateToSignUp} className="signup-button">Sign Up</button>
      </div>
    </div>
  );
}
    
        
        







