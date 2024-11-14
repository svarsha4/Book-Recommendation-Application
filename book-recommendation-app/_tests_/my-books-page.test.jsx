import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { useRouter } from "next/navigation";
import MyBooks from "/src/app/my-books/page.js";
import { useUser } from "/context/user-context.js";
import axios from 'axios';

//Below code ensures that the tests take into account routing between different pages
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));
jest.mock("/context/user-context.js", () => ({
    useUser: jest.fn(),
}));
jest.mock('axios');

const mockRouter = {
    push: jest.fn(),
};

useRouter.mockReturnValue(mockRouter);
useUser.mockReturnValue({
    user: { username: 'testuser' }
});

beforeEach(() => {
    axios.get.mockResolvedValueOnce({
        data: { books: [] }
    });
});

describe('My Books Page - Rendering', () => {
    //This tests checks to see if all the features intended to be displayed on the
    //my books page are being rendered correctly
    it('should render the my books page correctly', async () => {
        axios.get.mockResolvedValueOnce({
            data: { books: [] } // Provide an empty array or some mock data
        });
        render(<MyBooks />);
        await waitFor(() => {
            expect(screen.getByText('Type in the name and author of the book you read')).toBeInTheDocument();
        });

        expect(screen.getByText('Type in the name and author of the book you read')).toBeInTheDocument();
        //Checks to see if all the form components are being rendered correctly
        expect(screen.getByLabelText('Name:')).toBeInTheDocument();
        expect(screen.getByLabelText('Author:')).toBeInTheDocument();
        expect(screen.getByLabelText('Genre:')).toBeInTheDocument();
        //Checks to see if all the buttons are being rendered correctly
        expect(screen.getByText('Add Book')).toBeInTheDocument();
        expect(screen.getByAltText('Go Back')).toBeInTheDocument();
    });
});

describe('My Books Page - Form Submission', () => {
    //This test checks to see if the user is able to add a book to their list successfully after
    //filling out everything on the form
    it('should allow user to add book', async () => {
        //Assumption that the user fills out all the required fields and doesn't add a book they
        //already read
        useUser.mockReturnValue({ user: { username: 'testuser' } });
        axios.get.mockResolvedValueOnce({
            data: { books: [] }
        });
        axios.post.mockResolvedValueOnce({ status: 200 });
        const mockPush = jest.fn();
        useRouter.mockReturnValue({ push: mockPush });

        render(<MyBooks />);

        //Making sure the user fills out the form and then clicks on the
        //'Add Book' button
        fireEvent.change(screen.getByLabelText('Name:'), { target: { value: '1984' } });
        fireEvent.change(screen.getByLabelText('Author:'), { target: { value: 'George Orwell' } });
        fireEvent.change(screen.getByLabelText('Genre:'), { target: { value: 'Science Fiction' } });
        fireEvent.click(screen.getByText('Add Book'));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/book-list');
        });
    });

    //This test makes sure that a user doesn't add a book to their list that already exists
    it('should prevent duplicates', async () => {
        useUser.mockReturnValue({ user: { username: 'testuser' } });
        //For testing purposes, the book 1984 will be used
        axios.get.mockResolvedValueOnce({
        data: { books: [{ id: 1, name: '1984', author: 'George Orwell', genre: 'Science Fiction' }] }
        });
        axios.post.mockResolvedValueOnce({ status: 409 });

        render(<MyBooks />);

        //Letting the user know they can't add a book they already read, which in this case is 1984
        fireEvent.change(screen.getByLabelText('Name:'), { target: { value: '1984' } });
        fireEvent.change(screen.getByLabelText('Author:'), { target: { value: 'George Orwell' } });
        fireEvent.change(screen.getByLabelText('Genre:'), { target: { value: 'Science Fiction' } });
        fireEvent.click(screen.getByText('Add Book'));
        await waitFor(() => {
            expect(screen.getByText('You have already read this book')).toBeInTheDocument();
        });
    });
});

describe('My Books Page - Validation', () => {
    //This test ensures that the user fills out all the fields on the form because
    //they are required
    it('should notify user if any required field is missing', () => {
        axios.get.mockResolvedValueOnce({
            data: { books: [] }
        });
        render(<MyBooks />);
        
        fireEvent.click(screen.getByText('Add Book'));
        
        //Ensuring the user fills out all the required fields
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Author is required')).toBeInTheDocument();
        expect(screen.getByText('Genre is required')).toBeInTheDocument();
    });
});

describe('My Books Page - Navigation', () => {
    //This test checks to see if the user navigates to the home page
    //when they click on the back arrow icon
    it('should navigate to the home page', async () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({ push: mockPush });
        
        await act(async () => {
            render(<MyBooks />);
        });
        
        //When the user clicks on the back arrow icon, they should navigate to the home page
        fireEvent.click(screen.getByAltText('Go Back'));
        expect(mockPush).toHaveBeenCalledWith('/home');
    });
});