/*This file adds a new user to the database once they have created their account. This
ensures that the user doesn't have to create a new account each time and will have their
information saved.*/

//Enables the retrieval of a user's credentials
import { NextResponse } from 'next/server';
import { createUser, getUserByUsername } from '/lib/user'; //references the functions createUser and getUserByUsername from the file lib/user.js

/*This function sends a POST request, which means that it obtains a user's credentials from the sign up page. From there, those user's credentials are added to the database.*/
export async function POST(request) {
  const { username, password } = await request.json();

  try {
    //Check if the user has already created an account before - if yes, let the user know they already have an account
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
    }

    //Adds the new user credentials to the database
    await createUser({ username, password });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
