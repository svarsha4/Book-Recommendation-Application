import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import SignIn from "/src/app/auth/sign-in/page.js";
import { useUser } from "/context/user-context.js";
import axios from "axios";

//Below code ensures that the tests take into account routing between different pages
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));
jest.mock("/context/user-context.js", () => ({
    useUser: jest.fn(),
}));
jest.mock("axios");

const mockRouter = {
    push: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    route: "/",
    asPath: "/",
    query: {},
};

const mockSetUser = jest.fn();
const mockSetImages = jest.fn();

useRouter.mockReturnValue(mockRouter);
useUser.mockReturnValue({
    setUser: mockSetUser,
    setImages: mockSetImages,
});

describe('Sign In Page - Rendering', () => {
    //The first test checks to see if all the features intended to be displayed on the
    //sign in webpage are being rendered correctly
    it('should render the sign in form with all the necessary features', () => {
        render(<SignIn />);
        expect(screen.getByTestId('login-container')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        //Checks to see if the username and password input boxes are rendered
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        //Check to see if the Sign In and Sign Up buttons are rendered
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });
});

describe('Sign In Page - Form Submission', () => {
    //This test checks to see whether the user is able to login successfully
    it('should allow the user to login if their credentials are valid', async () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({ push: mockPush });
        render(<SignIn />);
        
        //For testing purposes, let's have the user have a username of 'testuser' and
        //a password of 'testpassword'
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
        
        //If the user logs in successfully, then they should navigate to the home page and
        //have their information added to the data.json file
        axios.post.mockResolvedValueOnce({ status: 200 });
        axios.get.mockResolvedValueOnce({ data: { books: [] } });
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/home'));
    });

    //This test checks to see if a user is not able to login if the credentials are not valid
    it('should display an error message on failed login attempt', async () => {
        render(<SignIn />);

        //For testing purposes, let's have the user have a username of 'testuser' and a password of 'testpassword'
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });

        //If the user fails to log in, then an error message should be displayed
        axios.post.mockRejectedValueOnce(new Error('Incorrect username/password'));
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => expect(screen.getByText('Incorrect username/password')).toBeInTheDocument());
    });
});

describe('Sign In Page - Navigation', () => {
    //This test checks to see whether the user navigates to the sign up page when they
    //click on the sign up button
    it('should navigate to the sign up page when the sign up button is clicked', () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({ push: mockPush});
        render(<SignIn />);

        //When the user clicks on the sign up button, they should navigate to the sign up page
        fireEvent.click(screen.getByText('Sign Up'));
        expect(mockPush).toHaveBeenCalledWith('/auth/sign-up');
    });
});

describe('Sign In Page - Validation', () => {
    //This test ensures that the user has to fill out all the required fields in order to
    //log in successfully
    it('should not allow form submission without username and password', () => {
        render(<SignIn />);

        //Ensuring the user fills out both their username and password in order to log in
        fireEvent.click(screen.getByText('Login'));
        expect(screen.getByPlaceholderText('Username').value).toBe('');
        expect(screen.getByPlaceholderText('Password').value).toBe('');
    });
});