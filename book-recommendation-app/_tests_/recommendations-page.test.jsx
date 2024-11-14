import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Recommendations from "/src/app/recommendations/page.js";
import { useUser } from "/context/user-context.js";
import { getUserReadingHistory, recommendBooks, normalizeTitle } from "/src/utils/recommendations.js";

//Below code ensures that the tests take into account routing between different pages
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));
jest.mock("/context/user-context.js", () => ({
    useUser: jest.fn(),
}));
jest.mock("/src/utils/recommendations.js", () => ({
    getUserReadingHistory: jest.fn(),
    recommendBooks: jest.fn(),
    normalizeTitle: jest.fn(),
}));

const mockRouter = {
    push: jest.fn(),
};
useRouter.mockReturnValue(mockRouter);

//The author and books genre for which the recommendations will correspond to
//when being tested
const mockSearchParams = new URLSearchParams({
    author: 'Ray Bradbury',
    genre: 'Science Fiction',
});
useSearchParams.mockReturnValue(mockSearchParams);

//Specifying the user that is tested for
useUser.mockReturnValue({
    user: { username: 'testuser' },
});
//Retrieves the reading history of the user being tested
getUserReadingHistory.mockReturnValue([
    { name: 'Fahrenheit 451', genre: 'Science Fiction' },
    { name: 'The Hobbit', genre: 'Fantasy'},
]);
//Books recommended to the user by a given author
recommendBooks.mockReturnValue([
    { name: 'Fahrenheit 451', author: 'Ray Bradbury', image: 'path/to/image', url: 'book/url', author_url: 'author/url' },
    { name: 'The Martian Chronicles', author: 'Ray Bradbury', image: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1661016554i/76778._SY75_.jpg', url: 'https://www.goodreads.com/book/show/76778.The_Martian_Chronicles', author_url: 'https://www.goodreads.com/author/show/1630.Ray_Bradbury' },
    { name: 'The Illustrated Man', author: 'Ray Bradbury', image: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1374049820i/24830._SY75_.jpg', url: 'https://www.goodreads.com/book/show/24830.The_Illustrated_Man', author_url: 'https://www.goodreads.com/author/show/1630.Ray_Bradbury' }
]);
//Checks to see similarities between titles
normalizeTitle.mockImplementation((title) => title.toLowerCase());

describe('Recommendations Page - Rendering', () => {
    //This test checks to see if all the features intended to be displayed on the
    //recommendations page are being rendered correctly
    it('should render the recommendations page with all the necessary features', () => {
        render(<Recommendations />);
        //Checks to see if the list header of recommended books is rendered
        expect(screen.getByText('Recommended Books')).toBeInTheDocument();
        //Checks to see if the list header of other book suggestions is rendered
        expect(screen.getByText('Other Suggestions')).toBeInTheDocument();
        //Checks to see if the back arrow icon is rendered
        expect(screen.getByAltText('Go Back')).toBeInTheDocument();
    });

    //This test checks to see if all the books are displayed accurately on the lists
    it('should display book recommendations', () => {
        render(<Recommendations />);
        
        //Checks if the book such as The Martian Chronicles and others written by this author
        //are displayed based on the user's preferences from the home page
        const martianChroniclesElements = screen.getAllByText(/The Martian Chronicles/i);
        expect(martianChroniclesElements).toHaveLength(2);
        const illustratedManElements = screen.getAllByText(/The Illustrated Man/i);
        expect(illustratedManElements).toHaveLength(2);
        expect(screen.getAllByText(/Ray Bradbury/i)).toHaveLength(4);
    });

    //This test makes sure the user is notified when there are no books recommended for a given author in
    //a given genre
    it('should display no books found message to user', () => {
        //Let's have the username be 'testuser' for testing purposes
        useUser.mockReturnValue({ user: { username: 'testuser' } });

        //Let's have the author 'Ray Bradbury' correspond to the genre 'Fantasy', since he doesn't
        //write any books in this genre
        const mockSearchParams = new URLSearchParams({ author: 'Ray Bradbury', genre: 'Fantasy' });
        useSearchParams.mockReturnValue(mockSearchParams);
        recommendBooks.mockReturnValueOnce([]);

        render(<Recommendations />);

        //Thus, the user should be notified that there aren't any books by this author in that genre
        expect(screen.getByText('No books with this author name are found.')).toBeInTheDocument();
        expect(screen.getByText('No suggestions available')).toBeInTheDocument();
    });

    //This test checks to see if books in the other suggestions list are displayed
    //accurately based on the user's reading history
    it('should display other suggestions', () => {
        //Let's say for testing purposes the user has a username of 'testuser'
        useUser.mockReturnValue({ user: { username: 'testuser' } });
        //Let's say for testing purposes, other suggestions reflects this user's given
        //preferences from the home page
        const mockSearchParams = new URLSearchParams({ author: 'Ray Bradbury', genre: 'Fantasy' });
        useSearchParams.mockReturnValue(mockSearchParams);

        //Assuming the user has read at least one book in the Fantasy genre, they should have books
        //displayed in the 'Other Suggestions' list
        getUserReadingHistory.mockReturnValue([
            { name: 'The Fellowship of the Ring', genre: 'Fantasy' }
        ]);
        recommendBooks.mockReturnValueOnce([
            { name: 'The Hobbit', author: 'J.R.R. Tolkien', image: 'path/to/image', url: 'book/url', author_url: 'author/url' }
        ]);
        
        render(<Recommendations />);

        //Check if the book such as 'The Hobbit' and other by the author are being displayed
        expect(screen.getByText(/The Hobbit/i)).toBeInTheDocument();
        const tolkienElements = screen.getAllByText(/J.R.R. Tolkien/i);
        expect(tolkienElements).toHaveLength(1);
    });
});

describe('Recommendations Page - Navigation', () => {
    //This test checks to see if the user navigates back to the home page when
    //clicking on the back arrow icon
    it('should navigate to the home page', () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({ push: mockPush });
        render(<Recommendations />);
        
        //When the user clicks on the back arrow icon, they should navigate to the home page
        fireEvent.click(screen.getByAltText('Go Back'));
        expect(mockPush).toHaveBeenCalledWith('/home');
    }); 
});

