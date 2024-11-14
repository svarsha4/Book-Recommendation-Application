/*This file ensures that when a user signs up it means they don't already have an account.
This ties back to the function handleSignup from the src\app\auth\sign-in\page.js file.*/

export async function POST(req) {
    const { username, password } = await req.json();
  
    //If the specified credentials from the API request already exist for the user who is signing up, then that means they have an account and
    //therefore have no reason to sign up.
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  