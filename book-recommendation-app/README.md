
<!-- README.md is generated from README.Rmd. Please edit that file -->

# Book Recommendation Application

## By: Saul Varshavsky

<!-- badges: start -->
<!-- badges: end -->


### Project Description

This project aims to create a web application to provide book recommendations based on a user's current preferences as well as their reading history.


### Core Aspects of the Project

- **Routing and Navigation**:
  - **Next.js** was used to navigate between the different webpages when the appropriate buttons were clicked by the user.

- **Data Fetching**:
  - **Fetch** as well as **Axios** were used to retrieve data from the json files corresponding to the logged in user and their book preferences.

- **API Routes and Middleware**:
  - **Fetch** as well as **Axios** were used to implement API status requests to ensure the user fills out the forms as intended.
  - Additionally, if the API status request was not 200, the user was notified that the given form they filled out was not successful.

- **Styling with Tailwind CSS**:
  - **Tailwind CSS** was used for styling each webpage.

- **Dynamic Routes**:
  - Client-side rendering is used when designing all the webpages, because the structure and design of the webpages will be the same regardless of the user.
  - Server-side rendering is used for designing all the API routes, because the API route will be specific to the given user.

- **Client-side State Management**:
  - The **useState()** hook is used to manage and use all the necessary variables and features for the webpages.
  - Additionally, the context/user-context.js file specifies the given user's username and the images generated for their list of books they read to be used as parent components.
  - Additionally, the src/app/layout.js file specifies that the given user's username and the generated images are to be used across the entire application.

- **Performance Benchmarks**:
  - **Lighthouse** was used to assess the application's performance, mainly its load times and rendering effectiveness

- **Testing Concepts**:
  - There were tests created for every single webpage, as well as tests for the navigation bar and the generation of images.


### Project Setup

- **Installing Next.js**:
  - Go to nextjs.org
  - Click on the "Docs" header in the navigation bar
  - Navigate to the Installation guide
  - Make sure that you first install the latest version of Node.js

- **Setting Up Next.js in your Visual Studio Code terminal**:
  - npx create-next-app@latest project-name (e.g. project-name = book-recommendation-app)
  - No (use Typescript)
  - Yes (use ESLint)
  - Yes (use Tailwind CSS)c
  - Yes (use src directory)
  - Yes (use App Router)
  - No (customize default import alias)

- **Getting Extensions in Visual Studio Code**:
  - Get the Tailwind CSS IntelliSense extension
  - Get the ES7 + React/Redux/React-Native snippets extension

- **Install the following additional packages in your Visual Studio Code terminal**:
  - npm install bcryptjs
  - npm install axios
  - npm install json-server
  - npm install openai
  - npm install react-helmet

- **Download ParseHub to scrape the goodreads book data**:
  - https://www.parsehub.com

- **Install the following packages in your Visual Code terminal to be used for testing your code**:
  - npm install jest jest-environment-jsdom @testing-library/react
  - npm install --save-dev @testing-library/jest-dom
  - npm install eslint-plugin-testing-library eslint-plugin-jest-dom

- **Installing Lighthouse**:
  - npm install lighthouse --save-dev

- **Run your web application**:
  - npm run dev

- **Run your tests**:
  - npm run test

- **Run Lighthouse to assess performance**:
  - npx lighthouse websiteUrl (e.g. websiteUrl = http://localhost:3000)
  - npm run build
  - make sure to run the application in Google Chrome
  - Right click anywhere on the application and select "Inspect" and then select "Lighthouse"


### File Descriptions

- **Webpage Design**:
  - src/app/auth/sign-in/page.js - Sign In Page
  - src/app/auth/sign-up/page.js - Sign Up Page
  - src/app/components/navbar/navbar.js - Navigation Bar
  - src/app/home/page.js - Home Page
  - src/app/book-list/page.js - page containing the list of books the user read
  - src/app/my-books/page.js - page where the user adds a new book to their list of books they read
  - src/app/recommendations/page.js - page displaying book recommendations to the user based on their preferences and reading history

- **Webpage Styling**:
  - src/app/styles/login.css - Sign In Page
  - src/app/styles/signup.css - Sign Up Page
  - src/app/styles/navbar.css - Navigation Bar
  - src/app/styles/home.css - Home Page
  - src/app/styles/book-list.css - page containing the list of books the user read
  - src/app/styles/my-books.css - page where the user adds a new book to their list of books they read
  - src/app/styles/recommendations.css - page displaying book recommendations to the user based on their preferences and reading history

- **Data**:
  - data/data.json - contains every user's account information as well as the list of books they read
  - data/fantasy-book-recs.json - contains all the books scraped from Goodreads using ParseHub in the Fantasy genre
  - data/hist-book-recs.json - contains all the books scraped from Goodreads using ParseHub in the Historical Fiction genre
  - data/mystery-book-recs.json - contains all the books scraped from Goodreads using ParseHub in the Mystery genre
  - data/scifi-book-recs.json - contains all the books scraped from Goodreads using ParseHub in the Science Fiction genre

- **Utilities**:
  - src/app/utils/recommendations.js - used to retrieve the list of books the user has read from the data/data.json file
  - src/app/utils/utils.js - used to retrieve the OpenAI key for DALLE, in order to generate images for each of the books the user read
  - utils/genreMapping.js - categorizes each json file containing the data on various books to their corresponding genres

- **API Routing**:
  - src/app/api/auth/login/route.js - ensures that a user's account information is saved and recognized next time they login
  - src/app/api/auth/sign-up/route.js & lib/user.js - add a new user to the data/data.json file once they created an account
  - src/app/api/my-books/route.js - ensures that a new books the user adds to their list gets saved in the data/data.json file at the appropriate location

- **Contexts**:
  - context/user-context.js - specifies a given user's username and the images generated for their list of books they read to be used as parent components
  - src/app/layout.js - specifies that a given user's username and the generated images are to be used across the entire application

- **Images**:
  - public/images/back.webp - the back arrow icon used for navigating back to certain webpages
  - public/images/background.jpg - the background image used for the entire application
  - public/images/logout.png - the logout icon used for logging out of the application and navigating to the sign in page
  - public/images/plus.png - the plus icon used by the user to add a new book to their list

- **Testing**:
  - tests/sign-in-page.test.jsx - Sign In Page
  - tests/sign-up-page.test.jsx - Sign Up Page
  - tests/navbar.test.jsx - Navigation Bar
  - tests/home-page.test.jsx - Home Page
  - tests/book-list-page.test.jsx - page containing the list of books the user read
  - tests/my-books-page.test.jsx - page where the user adds a new book to their list of books they read
  - tests/recommendations.test.jsx - page displaying book recommendations to the user based on their preferences and reading history
  - tests/image-generation.test.jsx - ensuring an images is generated for every book in the user's list using DALLE from OpenAI


### Sources

- ChatGPT
- https://youtu.be/Vn8W_eurjkA?si=DApmb0ZZPHlTSVe0 (installing Next.js)
- https://youtu.be/xXXs_pwlmN0?si=5wUT4lmr_tFNeV7R (installing Next.js)
- https://youtu.be/PtDIVU_tlo0?si=n9GeXrMRv_0e1cZH (understanding the basics of Next.js)
- https://youtu.be/ZVnjOPwW4ZA?si=Kgblj4tVPE6uLIhQ (understanding the basics of Next.js)
- https://youtu.be/pUNSHPyVryU?si=3YKfqUDhJtvlM8E1 (understanding the basics of Next.js and deciding on styling for Tailwind CSS)
- https://youtu.be/KkC_wYM_Co4?si=rZd2u7aAQ2NVNN3G (understanding the basics of Next.js and deciding on styling for Tailwind CSS)
- https://youtu.be/nSfu7sHPE9M?si=CV-mxV4HzpCCjqLx (understanding how to create user forms using Next.js)
- https://youtu.be/3kuLZyqK4Jo?si=BKULocAbuaQ7AJCp (understanding how to fetch APIs)
- https://youtu.be/Q-Sg4p_iQvw?si=eclGUqHGYYAvMmhm (understanding how to write tests to test out the application)
- https://youtu.be/GeCcWS4Otug?si=J0marZ3G1ZtlwSJN (understanding how to use Lighthouse to optimize performance)
