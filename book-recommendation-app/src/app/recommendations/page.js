/*This file creates the webpage displaying the user's book recommendations based on their preferences from the home page*/

//Ensures that we are using client-side rendering, so that the useState hook and the App Router can
//be used simultaneously.
"use client";

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/navigation';
//Uses the saved user's preferences from the home page
import { useSearchParams } from 'next/navigation';
//References the recommendations.css file used for styling this webpage
import '/src/app/styles/recommendations.css';
//Imports the book data from the book recommendation json files for each genre
import genreMapping from '/utils/genreMapping.js';
//Imports the books recommended to the user based on their reading history
import { recommendBooks, normalizeTitle, getUserReadingHistory } from '/src/utils/recommendations.js';
import { useUser } from 'context/user-context.js';

/*This function retrieves the saved user's preferences and then uses them to provide book recommendations, where the recommendations come
from the books scraped from Goodreads using ParseHub.*/
export default function Recommendations() {
  const searchParams = useSearchParams();
  const author = searchParams.get('author');
  const genre = searchParams.get('genre');
  const [recommendations, setRecommendations] = useState([]);
  const [historyBasedRecommendations, setHistoryBasedRecommendations] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  //Filters the books based on the selected author, genre, and the user's reading history
  useEffect(() => {
    if (user) {
      // Get the user's reading history and normalize the book titles
      const readBooks = getUserReadingHistory(user.username);
      const normalizedReadBooks = readBooks.map(book => ({
        ...book,
        name: normalizeTitle(book.name),
      }));
      const readBookNames = normalizedReadBooks.map(book => book.name);
  
      //Check if the user has read any books in the selected genre
      const hasReadGenre = normalizedReadBooks.some(book => book.genre === genre);
  
      //Retrieve books based on user preferences
      const selectedGenreBooks = genreMapping[genre]?.book || [];
      const filteredBooks = selectedGenreBooks
        .filter((book) => 
          book.author.toLowerCase().includes(author?.toLowerCase() || "") &&
          !readBookNames.includes(normalizeTitle(book.name))
        )
        .slice(0, 10);
      
      setRecommendations(filteredBooks);
  
      //Only show "Other Suggestions" if the genre chosen by the user in the home page is the same
      //as the genre of any of the books the user has read
      if (hasReadGenre) {
        const historyRecs = recommendBooks(user.username, genre);
        const uniqueHistoryRecs = historyRecs
          .filter(book => !readBookNames.includes(normalizeTitle(book.name)))
          .slice(0, 10);
        
        setHistoryBasedRecommendations(uniqueHistoryRecs);
      } else {
        setHistoryBasedRecommendations([]); // No history-based recommendations
      }
    }
  }, [author, genre, user]);

  //Displays a list of all the books recommended to the user
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-y-auto p-5 text-gray-800">
      <Helmet>
        <title>Recommendations</title>
      </Helmet>
      <h1 className="recommendations-header text-center">Recommended Books</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 items-center justify-center recommendations-content w-full">
        {/* Your content here */}
      </div>
  
      {/* Books Recommended Based on User Preferences */}
      {recommendations.length > 0 ? (
        recommendations.map((book, index) => (
          <div key={index} className="recommendations-book-item">
            <img src={book.image} alt={book.name} width="200" height="250" />
            <h2><a href={book.url}>{book.name}</a></h2>
            <p className="recommendations-author">Author: <a href={book.author_url}>{book.author}</a></p>
          </div>
        ))
      ) : (
        <p className="no-books">No books with this author name are found.</p>
      )}
      <br /><br /><br /><br />
  
      {/* Books Recommended Based on User's Reading History */}
      <h2 className="reading-history-header text-center">Other Suggestions</h2>
      {historyBasedRecommendations.length > 0 ? (
        historyBasedRecommendations.map((book, index) => (
          <div key={index} className="recommendations-book-item">
            <img src={book.image} alt={book.name} />
            <h2><a href={book.url}>{book.name}</a></h2>
            <p className="recommendations-author">Author: <a href={book.author_url}>{book.author}</a></p>
          </div>
        ))
      ) : (
        <p className="no-suggestions">No suggestions available</p>
      )}
      
      <button className="recommendations-back-button" onClick={() => router.push('/home')}>
        <img src="/images/back.webp" alt="Go Back" className="recommendations-back-arrow" />
      </button>
    </div>
  );
};