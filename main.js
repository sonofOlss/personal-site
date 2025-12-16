// main.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bookshelf-container");
  const countEl = document.getElementById("book-count");
  const lastUpdatedEl = document.getElementById("last-updated");
  const filterButtons = document.querySelectorAll(".filter-button");

  if (typeof BOOKS_LAST_UPDATED === "string" && lastUpdatedEl) {
    lastUpdatedEl.textContent = BOOKS_LAST_UPDATED;
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
    return Object.keys(groups).sort((a, b) => {
      const aNum = parseInt(a, 10);
      const bNum = parseInt(b, 10);
      if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
        return a.localeCompare(b);
      }
      return bNum - aNum; // Newest year first
    });
  }

  function createBookCard(book) {
    const card = document.createElement("article");
    card.className = "book-card";

    const cover = document.createElement("div");
    if (book.cover) {
      const img = document.createElement("img");
      img.className = "book-cover";
      img.src = book.cover;
      img.alt = `${book.title} cover`;
      img.loading = "lazy";
      cover.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "book-cover placeholder";
      placeholder.textContent = book.title;
      cover.appendChild(placeholder);
    }

    const meta = document.createElement("div");
    meta.className = "book-meta";

    const title = document.createElement("p");
    title.className = "book-title";
    title.textContent = book.title;

    const author = document.createElement("p");
    author.className = "book-author";
    author.textContent = book.author;

    meta.appendChild(title);
    meta.appendChild(author);

    if (Array.isArray(book.tags) && book.tags.length) {
      const tagsContainer = document.createElement("div");
      tagsContainer.className = "book-tags";

      book.tags.forEach((tagValue) => {
        const span = document.createElement("span");
        const normalized = String(tagValue).trim().toLowerCase().replace(/\s+/g, "-");
        span.className = `tag tag-${normalized}`;
        span.textContent = tagValue;
        tagsContainer.appendChild(span);
      });

      meta.appendChild(tagsContainer);
    }

    if (book.notes) {
      const notes = document.createElement("p");
      notes.className = "book-notes";
      notes.textContent = book.notes;
      meta.appendChild(notes);
    }

    card.appendChild(cover);
    card.appendChild(meta);
    return card;
  }

  function renderBooks(filter = "all") {
    if (!Array.isArray(BOOKS)) return;

    const filtered = BOOKS.filter((book) => {
      if (filter === "all") return true;
      return Array.isArray(book.tags) && book.tags.map((t) => t.toLowerCase()).includes(filter);
    });

    countEl.textContent = `${filtered.length} book${filtered.length === 1 ? "" : "s"}`;

    const groups = groupByYear(filtered);
    const years = sortedYears(groups);

    container.innerHTML = "";

    years.forEach((year) => {
      const yearBlock = document.createElement("section");
      yearBlock.className = "bookshelf-year";

      const heading = document.createElement("h3");
      heading.className = "bookshelf-year-heading";
      heading.textContent = year;

      const grid = document.createElement("div");
      grid.className = "bookshelf-grid-inner";

      groups[year].forEach((book) => {
        grid.appendChild(createBookCard(book));
      });

      yearBlock.appendChild(heading);
      yearBlock.appendChild(grid);
      container.appendChild(yearBlock);
    });
  }

  // Filter button behavior
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");
      renderBooks(filter);
    });
  });

  // Initial render
  renderBooks("all");
});
