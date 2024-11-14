/*This file is designed to use DALLE from OpenAI to generate an image for each book the user read*/
// utils.js
import axios from 'axios';

const API_KEY = "sk-proj-111111111";

//Generates images for the books in the user's list
export const generateImages = async (books) => {
    const newImages = {};
    for (const book of books) {
        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "prompt": `Book cover for ${book.name} by ${book.author}`,
                "n": 1,
                "size": "1024x1024"
            })
        };

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', options);
            const data = await response.json();
            if (data?.data?.[0]?.url) {
                newImages[book.id] = data.data[0].url;
            } else {
                console.error(`No image URL found for book: ${book.name}`);
            }
        } catch (error) {
            console.error(`Error generating image for book: ${book.name}`, error);
        }
    }
    return newImages;
};