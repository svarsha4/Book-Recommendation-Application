import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NavBar from "/src/app/components/navbar/navbar.js";

//Below code ensures that the tests take into account routing between different pages
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));
jest.mock("next/image", () => (props) => <img {...props} />);

const mockRouter = {
    push: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    route: "/",
    asPath: "/",
    query: {},
};

useRouter.mockReturnValue(mockRouter);

describe('Navbar - Rendering', () => {
    //This test checks to see if all the features intended to be displayed on the navigation
    //bar are being rendered correctly
    it('should render the navigation bar with all the necessary features', () => {
        render(<NavBar />);
        //Making sure all the buttons render correctly
        expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'My Books' })).toBeInTheDocument();
        //Making sure the logout icon renders correctly
        expect(screen.getByAltText('Logout')).toBeInTheDocument();
    });
});

describe('Navbar - Navigation', () => {
    //This test checks to see whether the user navigates to the home page when they click on the Home button
    it('should navigate to the home page', () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({ push: mockPush });
        render(<NavBar />);

        //When the user clicks on the Home button, they should navigate to the home page
        fireEvent.click(screen.getByRole('button', { name: 'Home' }));
        expect(mockPush).toHaveBeenCalledWith('/home');
    });

    //This test checks to see whether the user navigates to the book list page when they click on the
    //My Books button
    it('should navigate to the book list page', () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({ push: mockPush });
        render(<NavBar />);

        //When the user clicks on the My Books button, they should navigate to the book list page
        fireEvent.click(screen.getByRole('button', { name: 'My Books' }));
        expect(mockPush).toHaveBeenCalledWith('/book-list');
    });

    //This test checks to see whether the user navigates to the sign in page when they click on the
    //Logout icon
    it('should navigate to the sign in page', () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({ push: mockPush });
        render(<NavBar />);

        //When the user clicks on the Logout icon, they should navigate to the sign in page
        fireEvent.click(screen.getByAltText('Logout'));
        expect(mockPush).toHaveBeenCalledWith('/auth/sign-in');
    });
});