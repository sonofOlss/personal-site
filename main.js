// main.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bookshelf-container");
  const countEl = document.getElementById("book-count");
  const lastUpdatedEl = document.getElementById("last-updated");
  const filterButtons = document.querySelectorAll(".filter-button");

  // Always update the "Last updated" text if we have it
  if (typeof BOOKS_LAST_UPDATED === "string" && lastUpdatedEl) {
    lastUpdatedEl.textContent = BOOKS_LAST_UPDATED;
  }

  // If this page doesn't have a bookshelf (like your home page now), stop here.
  if (!container || !countEl) {
    return;
  }

  function groupByYear(books) {
    const groups = {};
    books.forEach((book) => {
      const year = book.yearRead || "Other";
      if (!groups[year]) groups[year] = [];
      groups[year].push(book);
    });
    return groups;
  }

  function sortedYears(groups) {
    const years = Object.keys(groups);
    return years.sort((a, b) => {
      const aNu

