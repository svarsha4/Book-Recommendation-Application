import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useUser } from "/context/user-context.js";
import { generateImages } from "/src/utils/utils.js";

//Below code ensures that the tests take into account routing between different pages
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));
jest.mock("/context/user-context.js", () => ({
    useUser: jest.fn(),
}));

global.fetch = jest.fn();

const mockRouter = {
    push: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    route: "/",
    asPath: "/",
    query: {},
};

useRouter.mockReturnValue(mockRouter);

//Initially, the testuser will have 0 images of books in their list
useUser.mockReturnValue({
    user: { username: 'testuser' },
    images: {}
});

describe('Image Generation Tests', () => {
    it('should generate an image for each book', async () => {
        //For testing purposes, these are the books for which the images will be generated for
        const mockBooks = [
            { id: 1, name: '1984', author: 'George Orwell' },
            { id: 2, name: 'Brave New World', author: 'Aldous Huxley' }
        ];

        //Makes sure to generate an image for each book with a different fake url
        //to be used for testing purposes
        global.fetch
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce({
                    data: [{ url: 'https://fake-url.com/1984.jpg' }]
                })
            })
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce({
                    data: [{ url: 'https://fake-url.com/brave-new-world.jpg' }]
                })
            });

        //Generates the images for the user's books
        const images = await generateImages(mockBooks);
        expect(images).toEqual({
            1: 'https://fake-url.com/1984.jpg',
            2: 'https://fake-url.com/brave-new-world.jpg'
        });
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });
});