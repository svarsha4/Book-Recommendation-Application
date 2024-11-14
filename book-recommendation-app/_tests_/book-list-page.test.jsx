import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import BookList from "/src/app/book-list/page.js";
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

//Initially, the testuser will have 0 images of books in their list
useUser.mockReturnValue({
    user: { username: 'testuser' },
    images: {}
});

describe('Book List Page - Rendering', () => {
    //This test checks to see if all the features intended to be
    //displayed on the book list page are being rendered correctly
    it('should render the book list page with all the necessary features', async () => {
        //Let's have these books as part of the testuser's list
        axios.get.mockResolvedValueOnce({
            data: {
                books: [
                    { id: 1, name: '1984', author: 'George Orwell' },
                    { id: 2, name: 'Brave New World', author: 'Aldous Huxley' }
                ]
            }
        });
        
        render(<BookList />);

        await waitFor(() => {
            expect(screen.getByText('Books You Read')).toBeInTheDocument();
            expect(screen.getByAltText('Add Book')).toBeInTheDocument();
            //Checks to see if the navigation bar gets rendered correctly
            expect(screen.getByRole('navigation')).toBeInTheDocument();
            //Checks that the testuser's list of books is being rendered
            expect(screen.getByText('1984')).toBeInTheDocument();
            expect(screen.getByText('Brave New World')).toBeInTheDocument();
        }); 
    });

    //This test makes sure all the books from the data.json file for a given user are being
    //rendered
    it('should render the list of books', async () => {
        //For testing purposes, let these two books correspond to the user
        const mockBooks = [
            { id: 1, name: '1984', author: 'George Orwell' },
            { id: 2, name: 'Brave New World', author: 'Aldous Huxley' }
        ];
        axios.get.mockResolvedValueOnce({ data: { books: mockBooks } });
        
        render(<BookList />);

        //Checks to see if those two books actually get rendered for the user
        await waitFor(() => {
            expect(screen.getByText('1984')).toBeInTheDocument();
            expect(screen.getByText('Brave New World')).toBeInTheDocument();
        });
    });
});

describe('Book List Page - Navigation', () => {
    //This test checks to see if the user navigates to the my books page when they click on the plus icon
    it('should navigate to the my books page', () => {
        axios.get.mockResolvedValueOnce({
            data: { books: [] }
        });

        render(<BookList />);

        // When the user clicks on the plus icon, they should navigate to the my books page
        fireEvent.click(screen.getByAltText('Add Book'));
        expect(mockRouter.push).toHaveBeenCalledWith('/my-books');
    });
});

describe('Book List Page - Removing Book', () => {
    //This test checks to see if the user is able to remove a book from their list
    it('should remove book from list', async () => {
        //For testing purposes, these are the books that will currently be
        //in the user's list
        const mockBooks = [
            { id: 1, name: '1984', author: 'George Orwell' },
            { id: 2, name: 'Brave New World', author: 'Aldous Huxley' }
        ];
        axios.get.mockResolvedValueOnce({ data: { books: mockBooks } });
        axios.delete.mockResolvedValueOnce({});
        
        render(<BookList />);

        //Checking to see if a user removes one of the books from the list used
        //for testing purposes
        await waitFor(() => {
            expect(screen.getByText('1984')).toBeInTheDocument();
        });

        //Retrieve the specific delete button associated with "1984"
        const deleteButtons = screen.getAllByText('x');
        
        //A book should get removed when the x is pressed
        fireEvent.click(deleteButtons[0]);
        await waitFor(() => {
            expect(screen.queryByText('1984')).not.toBeInTheDocument();
        });
    });
});