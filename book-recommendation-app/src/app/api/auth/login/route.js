/*This file ensures that when a user logs in, their username and password are recognized if they have logged in previously
This ties back to the function handleLogin from the src\app\auth\sign-in\page.js file.*/

//Enables the retrieval of a user's credentials
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getUserByUsername } from '/lib/user';  //references the function getUserByUsername function from the file lib/user.js

/*This function sends a POST request, which means that it obtains a user's credentials from the sign in page. From there, those user's credentials are searched for in a database
to see if they already have an account. If their credentials are in the database, then they can login successfully. Otherwise, they won't be able to login.*/
export async function POST(request) {
  const { username, password } = await request.json();

  try {
    //Search for the username provided by the user - if not found, let the user know their credentials are incorrect
    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ message: 'Incorrect username/password' }, { status: 401 });
    }

    //Search for the password provided by the user - if not found, let the user know their credentials are incorrect
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Incorrect username/password' }, { status: 401 });
    }

    //If the username and password provided by the user match those in the database, then the login is successful
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
