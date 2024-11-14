import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import SignUp from "/src/app/auth/sign-up/page.js";
import { useUser } from "/context/user-context.js";

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

describe('Sign Up Page - Rendering', () => {
    //This test checks to see if all the features intended to be displayed on the
    //sign up webpage are being rendered correctly
    it('should render the sign up form with all the necessary features', () => {
        render(<SignUp />);
        expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
        //Checks to see if the username and password input boxes are rendered
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        //Checks to see if the sign up button is rendered
        expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });
});

describe('Sign Up Page - Form Submission', () => {
    //This test checks to see whether the user is able to sign up successfully
    it('should allow the user to sign up if their credentials are valid', async () => {
        render(<SignUp />);

        //For testing purposes, let's have the user have a username of 'testuser' and
        //a password of 'testpassword'
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });

        //If the user signs up successfully, then they should navigate to the sign in page and
        //have their information added to the data.json file
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        // Trigger form submission by clicking the sign-up button
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

        // Assert that the fetch API call was made with the correct data
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/auth/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'testpassword',
                }),
            });
            expect(mockRouter.push).toHaveBeenCalledWith('/auth/sign-in');
        });
    });

    //This test checks to see if the user fails to sign up if they already have an account
    it('should display an error message if the account already exists', async () => {
        render(<SignUp />);

        //For testing purposes, let's have the user have a username of 'testuser' and
        //a password of 'testpassword'
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testpassword' } });

        //If the user fails to sign up, then they should be notified that their account already exists
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: false })
        );
    
        fireEvent.click(screen.getByRole('button', {name: 'Sign Up'}));
    
        await waitFor(() => expect(screen.getByText('Account already exists')).toBeInTheDocument());

    });
});

describe('Sign Up Page - Validation', () => {
    //This test ensures that the user has to fill out all the required fields in order to
    //sign up successfully.
    it('should not allow form sumbission without username and password', () => {
        render(<SignUp />);

        //Ensuring that the user fills out both their username and password in order to sign up
        fireEvent.click(screen.getByRole('button', {name: 'Sign Up'}));
        expect(screen.getByPlaceholderText('Username').value).toBe('');
        expect(screen.getByPlaceholderText('Password').value).toBe('');
    });
});