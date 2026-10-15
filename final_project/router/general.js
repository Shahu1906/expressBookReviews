const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function for user registration
const registerUser = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Unable to register user. Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
};

// Register endpoint (supports both /register and /customer/register)
public_users.post("/register", registerUser);
public_users.post("/customer/register", registerUser);

// Task 1 & Task 10: Get the book list available in the shop using async-await / Promise
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve) => {
      resolve(books);
    });
    const allBooks = await getBooks;
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

// Task 2 & Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error("Book not found for ISBN " + isbn));
    }
  });

  getBook
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((err) => {
      return res.status(404).json({ message: err.message });
    });
});
  
// Task 3 & Task 12: Get book details based on author using async-await / Promise
public_users.get('/author/:author', async function (req, res) {
  const authorParam = req.params.author.toLowerCase();
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let filteredBooks = {};
      const keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === authorParam) {
          filteredBooks[key] = books[key];
        }
      });
      if (Object.keys(filteredBooks).length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found by author: " + req.params.author));
      }
    });

    const matchingBooks = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 4 & Task 13: Get all books based on title using async-await / Promise
public_users.get('/title/:title', async function (req, res) {
  const titleParam = req.params.title.toLowerCase();
  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      let filteredBooks = {};
      const keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].title.toLowerCase() === titleParam) {
          filteredBooks[key] = books[key];
        }
      });
      if (Object.keys(filteredBooks).length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found with title: " + req.params.title));
      }
    });

    const matchingBooks = await getBooksByTitle;
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ============================================================================
// Tasks 10 - 13: Asynchronous Functions using Axios with Promises and Async-Await
// These implementations demonstrate asynchronous retrieval of books using Axios
// ============================================================================

// Task 10: Get all books using async/await with Axios
const getBooksAxios = async () => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 11: Get book details by ISBN using Promise callbacks with Axios
const getBookByISBNAxios = (isbn) => {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

// Task 12: Get book details by Author using async/await with Axios
const getBooksByAuthorAxios = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 13: Get book details by Title using async/await with Axios
const getBooksByTitleAxios = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports.general = public_users;
module.exports.getBooksAxios = getBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
