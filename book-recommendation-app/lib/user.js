import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dataFilePath = path.join(process.cwd(), 'data', 'data.json');

//Searches for the credentials in the database
export const getUserByUsername = async (username) => {
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  return data.find(user => user.username === username);
};

//Adds a new user's credentials to the database
export const createUser = async (newUser) => {
  //Encrypts the password
  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  const userToAdd = {
    username: newUser.username,
    password: hashedPassword,
    books: []
  };
  //Reads the data from the json file
  let data;
  try {
    data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  } catch (error) {
    data = [];
  }
  
  // Adds the new user's credentials to the data.json file once they signed up
  data.push(userToAdd);
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};