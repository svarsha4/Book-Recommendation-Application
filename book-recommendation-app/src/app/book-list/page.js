/*This page displays the list of books the user has read*/
"use client";

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUser } from 'context/user-context.js';
import NavBar from '/src/app/components/navbar/navbar.js';

//References the my-books.css file used for styling this webpage
import '/src/app/styles/book-list.css';

export default function BookList() {
    const { user, images } = useUser();
    const [books, setBooks] = useState([]);
    const router = useRouter();

    //Fetches the user's username and uses it to determine the books they have read
    useEffect(() => {
        const fetchBooks = async () => {
            if (user) {
                const response = await axios.get(`/api/my-books?username=${user.username}`);
                const booksData = response.data.books || [];
                setBooks(booksData);
            } else {
                router.push('/auth/sign-in');
            }
        };
        fetchBooks();
    }, [user, router]);

    //This function handles the removal of a book from the list
    const removeBook = async (bookId) => {
        try {
            // Make an API call to remove the book from the backend
            await axios.delete(`/api/my-books`, {
                data: { username: user.username, bookId }
            });
            
            // Update the state to remove the book from the list
            setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
        } catch (error) {
            console.error(`Error removing book with id ${bookId}`, error);
        }
    };



    return (
        <div className="book-list-container">
            <meta name="description" content="User's Books" />
            <Helmet>
                <title>Book List</title>
            </Helmet>
            <NavBar />
            <h1 className="book-list-header">Books You Read</h1>
            <ul className="book-list">
                {books.map((book) => (
                    <li key={book.id} className="book-item">
                        <div className="book-details">
                            <a href="#" className="book-name">{book.name}</a>
                            <span className="by-text">by</span>
                            <a href="#" className="author">{book.author}</a>
                        </div>

                        {images[book.id] && (
                            <img src={images[book.id]} alt={book.name} className="book-image" />
                        )}
                        
                        <button className="delete-book-button" onClick={() => removeBook(book.id)}>x</button>
                    </li>
                ))}
            </ul>

            <button className="add-book-button" onClick={() => router.push('/my-books')}>
                <img src="/images/plus.png" alt="Add Book" className="add-book-icon" />
            </button>
        </div>
    );
}

