
const express = require("express");
const axios = require("axios");

const books = require("./booksdb.js");
const public_users = express.Router();

// Get all books
public_users.get("/", (req, res) => {
  return res.status(200).json(books);
});

// Get a book by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.status(200).json(book);
});

// Get books by author (case-insensitive)
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();

  const matchingBooks = Object.fromEntries(
    Object.entries(books).filter(
      ([, book]) => book.author.toLowerCase() === author
    )
  );

  if (Object.keys(matchingBooks).length === 0) {
    return res.status(404).json({
      message: `No books found by author: ${req.params.author}`
    });
  }

  return res.status(200).json(matchingBooks);
});

// Get books by title (case-insensitive)
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();

  const matchingBooks = Object.fromEntries(
    Object.entries(books).filter(
      ([, book]) => book.title.toLowerCase() === title
    )
  );

  if (Object.keys(matchingBooks).length === 0) {
    return res.status(404).json({
      message: `No books found with title: ${req.params.title}`
    });
  }

  return res.status(200).json(matchingBooks);
});

// Get reviews for a book by ISBN
public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.status(200).json(book.reviews);
});

// =====================================================
// Axios asynchronous functions for assignment tasks
// These are separate helpers, not route handlers.
// =====================================================

// Get all books using async/await and Axios
const getBooksAxios = async () => {
  const response = await axios.get("http://localhost:5000/");
  return response.data;
};

// Get a book by ISBN using a Promise chain and Axios
const getBookByISBNAxios = (isbn) => {
  return axios
    .get(`http://localhost:5000/isbn/${encodeURIComponent(isbn)}`)
    .then((response) => response.data);
};

// Get books by author using async/await and Axios
const getBooksByAuthorAxios = async (author) => {
  const response = await axios.get(
    `http://localhost:5000/author/${encodeURIComponent(author)}`
  );
  return response.data;
};

// Get books by title using async/await and Axios
const getBooksByTitleAxios = async (title) => {
  const response = await axios.get(
    `http://localhost:5000/title/${encodeURIComponent(title)}`
  );
  return response.data;
};

module.exports.general = public_users;
module.exports.getBooksAxios = getBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
