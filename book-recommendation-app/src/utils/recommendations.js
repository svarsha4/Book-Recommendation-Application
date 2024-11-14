//Imports the user data
import data from '/data/data.json';
//Imports the book data
import scifiBooks from '/data/scifi-book-recs.json';
import fantasyBooks from '/data/fantasy-book-recs.json';
import mysteryBooks from '/data/mystery-book-recs.json';
import histBooks from '/data/hist-book-recs.json';

//This function retrieves the books the user has read, which is part of
//their reading history
export const getUserReadingHistory = (username) => {
    const user = data.find(user => user.username === username);
    return user ? user.books : [];
};

//This function identifies the genres of the books the user has read
const genreBooksMapping = {
    'Science Fiction': scifiBooks.book,
    'Fantasy': fantasyBooks.book,
    'Mystery': mysteryBooks.book,
    'Historical Fiction': histBooks.book
};

//Returns the genre corresponding to a given book
export const getBooksForGenre = (genre) => {
    return genreBooksMapping[genre] || [];
};

//Ensures that the user is not recommended books that they've already read
export const normalizeTitle = (title) => {
    return title
        .toLowerCase()
        .replace(/\s*\(.*?\)\s*/g, '')
        .trim();
};
export const filterOutReadBooks = (books, readBooks) => {
    const readBookNames = readBooks.map(book => normalizeTitle(book.name));
    return books.filter(book => !readBookNames.includes(normalizeTitle(book.name)));
};

export const recommendBooks = (username, genre) => {
    const readBooks = getUserReadingHistory(username);
    const availableBooks = getBooksForGenre(genre);
    const recommendations = filterOutReadBooks(availableBooks, readBooks);
    return recommendations;
};
