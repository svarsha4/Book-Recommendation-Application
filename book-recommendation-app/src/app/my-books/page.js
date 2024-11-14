/*This file creates the webpage allowing the user to add a book they read previously*/

//Ensures that we are using client-side rendering, so that the useState hook and the App Router can
//be used simultaneously.
"use client";

import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
//References the my-books.css file used for styling this webpage
import '/src/app/styles/my-books.css';

import axios from 'axios';
//Imports the user's username from the context/user-context.js file
import { useUser } from 'context/user-context.js';

/*This function obtains the username and password of the user to make sure to save their list of books in the data.json file*/
export default function MyBooks() {
  //Uses the saved username from the user
  const { user } = useUser();
  //References the books list for a given user from the data.json file
  const [books, setBooks] = useState([]);
  const [newBookName, setNewBookName] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookGenre, setNewBookGenre] = useState('');
  const [errors, setErrors] = useState({ name: false, author: false });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const fetchBooks = async () => {
      if (user) {
        //Locates the user's username and then adds the book in the appropriate
        //location in the data/data.json file
        const response = await axios.get(`/api/my-books?username=${user.username}`);
        setBooks(response.data.books || []);
      }
    };
    fetchBooks();
  }, [user]);


  const handleAddBook = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      name: newBookName.trim() === '',
      author: newBookAuthor.trim() === '',
      genre: newBookGenre === '',
    };

    //If only the name or author is selected, then the user can't proceed until both fields are filled out
    if (newErrors.name || newErrors.author || newErrors.genre) {
      setErrors(newErrors);
      return;
    }
    setErrors({ name: false, author: false, genre: false});

    //Checks to see if the book added by the user has already been read
    const bookExists = books.some(book => 
      book.name.toLowerCase() === newBookName.trim().toLowerCase() &&
      book.author.toLowerCase() === newBookAuthor.trim().toLowerCase()
    );
    if (bookExists) {
      setErrorMessage('You have already read this book');
      return;
    }

    // Generate a unique id for the new book
    const maxId = books.reduce((max, book) => Math.max(max, book.id), 0);
    const newBookId = maxId + 1;
    
    //Adds a new book to the appropriate user in the data.json file
    const updatedBook = { id: newBookId, name: newBookName, author: newBookAuthor, genre: newBookGenre};
    try {
      const response = await axios.post('/api/my-books', {
          username: user.username,
          book: updatedBook,
      });

      //Checks to make sure the book has not been added previously by the user
      if (response.status === 200) {
        setBooks(prevBooks => [...prevBooks, updatedBook]);
        setNewBookName('');
        setNewBookAuthor('');
        setNewBookGenre('');
        setErrorMessage('');

        //Navigates to the book-list.js page once the book has been added successfully
        router.push('/book-list');
      } else if (response.status === 409) {
        setErrorMessage('You have already read this book');
      } else {
        setErrorMessage('An error occurred while adding this book');
      }
    } catch (error) {
      setErrorMessage('You have already read this book');
    }
};

return (
  <div className="my-books-container">
    <meta name="description" content="Add New Book" />
            <Helmet>
                <title>My Books</title>
            </Helmet>
    <h1 className="my-books-header">Type in the name and author of the book you read</h1>
  
    <form className="add-book-form" onSubmit={handleAddBook}>
      <div className="form-group">
        <label htmlFor="bookName">Name:</label>
        <input 
          type="text" 
          id="bookName"
          placeholder="Enter book name" 
          value={newBookName}
          onChange={(e) => setNewBookName(e.target.value)}
          className={`form-input ${errors.name ? 'input-error' : ''}`}
        />
        {errors.name && <p className="error-text">Name is required</p>}
      </div>

      <div className="form-group">
        <label htmlFor="authorName">Author:</label>
        <input 
          type="text" 
          id="authorName"
          placeholder="Enter author name" 
          value={newBookAuthor}
          onChange={(e) => setNewBookAuthor(e.target.value)}
          className={`form-input ${errors.author ? 'input-error' : ''}`}
        />
        {errors.author && <p className="error-text">Author is required</p>}
      </div>

      <div className="form-group">
        <label htmlFor="genre">Genre:</label>
        <select 
          id="genre"
          value={newBookGenre}
          onChange={(e) => setNewBookGenre(e.target.value)}
          className={`form-input ${errors.genre ? 'input-error' : ''}`}
        >
          <option value="">Select a genre</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Mystery">Mystery</option>
          <option value="Historical Fiction">Historical Fiction</option>
        </select>
        {errors.genre && <p className="error-text">Genre is required</p>}
      </div>

      <button type="submit" className="form-submit-button">Add Book</button>
    </form>

    {errorMessage && <p className="error-message">{errorMessage}</p>}

    <button className="back-button" onClick={() => router.push('/home')}>
      <img src="/images/back.webp" alt="Go Back" className="back-arrow" />
    </button>
  </div>
);
}
