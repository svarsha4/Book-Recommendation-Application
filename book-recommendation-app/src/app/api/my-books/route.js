/*This file ensures that when a given user adds a new book in the my-books page,
it gets added to the appropriate location in the data/data.json file*/

import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'data', 'data.json');

//Handles the GET request
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    //Reads the data from the data.json file
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const user = data.find(user => user.username === username);

    if (user) {
        //If the added book from the my-books.js page is valid, then
        //that book will be added to the appropriate user based on their
        //username in the data.json file
        return NextResponse.json({ books: user.books }, { status: 200 });
    } else {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
}

//Handles the POST request
export async function POST(req) {
    const { username, book } = await req.json();
    
    //Reads the data from the data.json file
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const user = data.find(user => user.username === username);

    if (user) {
        //Checks to see if the added book is not already present in the
        //data.json file for that given user
        const bookExists = user.books.some(
            b => b.name.toLowerCase() === book.name.toLowerCase()
        );
        if (bookExists) {
            return NextResponse.json({ message: 'You have already read this book' }, { status: 409 });
        }

        //Adds the new book to the given user in the data.json file if valid
        user.books.push(book);
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ message: 'Book added successfully' }, { status: 200 });
    } else {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
}

//Handles the DELETE request
export async function DELETE(req) {
    const { username, bookId } = await req.json();
    
    //Reads the data from the data.json file
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const user = data.find(user => user.username === username);

    if (user) {
        //Find the index of the book to be removed
        const bookIndex = user.books.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
            return NextResponse.json({ message: 'Book not found' }, { status: 404 });
        }

        //Remove the book from the user's book list
        user.books.splice(bookIndex, 1);
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ message: 'Book removed successfully' }, { status: 200 });
    } else {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
}
