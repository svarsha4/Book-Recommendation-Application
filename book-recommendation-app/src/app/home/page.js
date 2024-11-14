/*This file creates the home page in the application where the user can indicate their
reading preferences in order to get personalized book recommendations.*/

//Ensures that we are using client-side rendering, so that the useState hook and the App Router can
//be used simultaneously.
"use client";

import React, {useState} from 'react';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/navigation';
//Imports the navigation bar created in the src/app/components/navbar/navbar.js file
import NavBar from '/src/app/components/navbar/navbar.js';
//References the home.css file used for styling the navigation bar
import '/src/app/styles/home.css';

//Initially, this function creates the variables called author, genre, and pageRange, which store the user's login credentials.
//Initially, the variables are empty strings, since the user hasn't chosen their preferences yet.
//The user's information corresponding to each of the variables get stored in the setter functions.
export default function Home() {
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [errors, setErrors] = useState({ author: false, genre: false });
    const router = useRouter();

    /*This subfunction makes sure that the user's preferences get saved and recognized in the future.*/
    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            author: author.trim() === '',
            genre: genre.trim() === '',
        };
        //If only the author or genre is selected, then the user can't proceed until both fields are filled out
        if (newErrors.author || newErrors.genre) {
            setErrors(newErrors);
            return;
        }
        setErrors({ author: false, genre: false });
        //Saves the user's preferences in order to provide personalized recommendations in the recommendations page
        router.push(`/recommendations?author=${author}&genre=${genre}`);
    };
    
    /*The function Home() returns the contents that will be displayed on the sign in webpage. The classNames corresponding to each div specify how different
    components of the home page will be styled. Additionally, the user will specify what author they like, as well as
    what genre and page range they want from dropdown menus.*/
    return (
        <div className="home-container">
            <meta name="description" content="Search Preferences" />
            <Helmet>
                <title>Home Page</title>
            </Helmet>
            <NavBar />
            <h1 className="home-header">Decide Your Next Book Just a Few Clicks Away!</h1>

            <form onSubmit={handleSubmit} className="book-preferences-form">
                <div className="form-group">
                    <label htmlFor="author">Author:</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author name"
                        className="form-input"
                    />
                    {errors.author && <p className="error-text">Author is required</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="genre">Genre:</label>
                    <select
                        id="genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="form-input">
                            <option value="">Select a genre</option>
                            <option value="Science Fiction">Science Fiction</option>
                            <option value="Historical Fiction">Historical Fiction</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Fantasy">Fantasy</option>
                    </select>
                    {errors.genre && <p className="error-text">Genre is required</p>}
                </div>

                <button type="submit" className="form-submit-button">Search</button>
            </form>
        </div>
    );
}
