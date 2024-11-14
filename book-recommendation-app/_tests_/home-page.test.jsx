import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Home from "/src/app/home/page.js";
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

describe('Home Page - Rendering', () => {
    //This test checks to see if all the features intended to be displayed on the
    //home webpage are being rendered correctly
    it('should render the home page with all the necessary features', () => {
        render(<Home />);
        //Checks to see if all the forms of text are being rendered correctly
        expect(screen.getByText('Decide Your Next Book Just a Few Clicks Away!')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter author name')).toBeInTheDocument();
        expect(screen.getByLabelText('Genre:')).toBeInTheDocument();
        //Check to see if the Search button is being rendered correctly
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
        //Check to see if the entire navigation bar is being rendered correctly
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
});

describe('Home Page - Form Submission', () => {
    //This test checks to see whether the user can successfully navigate to the recommendations page
    //after entering an author and genre.
    it('should allow the user to navigate to the recommendations page', () => {
        const mockPush = jest.fn();
        useRouter.mockReturnValue({ push: mockPush });
        render(<Home />);

        //For testing purposes, let's have the user enter the author 'Ray Bradbury' and
        //select the genre 'Science Fiction'
        fireEvent.change(screen.getByPlaceholderText('Enter author name'), { target: { value: 'Ray Bradbury' } });
        fireEvent.change(screen.getByLabelText('Genre:'), { target: { value: 'Science Fiction' } });

        //When the user clicks on the Search button, they should navigate to the Recommendations page
        fireEvent.click(screen.getByRole('button', { name: 'Search' }));
        expect(mockPush).toHaveBeenCalledWith('/recommendations?author=Ray Bradbury&genre=Science Fiction');
    });
});

describe('Home Page - Form Validation', () => {
    //This test ensures that the user has to fill out all the required fields in order to navigate
    //to the recommendations page.
    it('should not allow the user to navigate to the recommendations page without author and genre', () => {
        render(<Home />);

        //Ensuring that the user fills out both the author and genre
        fireEvent.click(screen.getByRole('button', { name: 'Search' }));
        expect(screen.getByText('Author is required')).toBeInTheDocument();
        expect(screen.getByText('Genre is required')).toBeInTheDocument();
    });
});