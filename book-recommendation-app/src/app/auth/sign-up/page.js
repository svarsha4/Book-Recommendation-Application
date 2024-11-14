/*This file creates the webpage in the application where the user creates their account.*/

//Ensures that we are using client-side rendering, so that the useState hook and the App Router can
//be used simultaneously.
"use client";

//Imports the styling from the src\app\styles\signup.css file
import '/src/app/styles/signup.css';

//Imports the necessary components from React.js
import { useState } from 'react';
//Ensures that the App Router can be used for this webpage
import { useRouter } from 'next/navigation';
import { Helmet } from 'react-helmet';

//Initially, this function creates the variables username and password, which store the user's data so that their account can be created.
//Additionally, the variable error keeps track of whether the user actually typed in their correct credentials, if they even have credentials in the first place.
//Initially, all of these variables are empty strings, since the user hasn't signed up yet.
//The user's credentials get stored inside the setter functions.
export default function SignUp() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  /*This subfunction makes sure that the sign up process works in a successful manner. This means that when a user signs up, they shouldn't
  already have an account. In order to recognize if the user signed up previously, an API request will be sent.*/
  const handleSignUp = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    //If the specified credentials from the API request already exist for the user who is signing up, then that means they have an account and
    //therefore have no reason to sign up.
    if (response.ok) {
        router.push('/auth/sign-in'); // Redirect to sign-in page after successful sign-up
    } else {
        setError('Account already exists');
    }
  };

  /*The function SignUp() returns the contents that will be displayed on the sign up webpage. The classNames corresponding to each div specify how different
  components of the sign up page will be styled.*/
  return (
    <div className="signup-container">
      <meta name="description" content="Create an account to access personalized book recommendations." />
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
        <div className="signup-form">
            <h1 className="signup-header">Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Username"
                    className="signup-input"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="signup-input"
                    required
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
        </div>
    </div>
 );
}
