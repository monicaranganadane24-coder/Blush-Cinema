import { searchMovies } from "./api.js";

const input = document.getElementById("champ_recherche");
const btn = document.getElementById("bouton_recherche");
const container = document.getElementById("resultats_recherche");
const loadMoreBtn = document.getElementById("charger_film");

let currentQuery = "";
let currentPage = 1;
let debounceTimer = null;

function createMovieCard(film) {
  const div = document.createElement("div");
  div.className = "carte_film";
  const poster = film.Poster && film.Poster !== "N/A" ? film.Poster : "images/placeholder.jpg";
  div.innerHTML = `
    <img src="${poster}" alt="${film.Title}">
    <h3>${film.Title}</h3>
    <a href="movie.html?id=${film.imdbID}" class="learn-btn">Learn more</a>
  `;
  return div;
}

async function performSearch(reset = false) {
  if (reset) {
    currentPage = 1;
    container.innerHTML = "";
  }
  if (!currentQuery) {
    container.innerHTML = "";
    loadMoreBtn.style.display = "none";
    return;
  }

  const data = await searchMovies(currentQuery, currentPage);
  if (!data || data.Response === "False" || !data.Search) {
    container.innerHTML = "<p>Movie not found.</p>";
    loadMoreBtn.style.display = "none";
    return;
  }

  const films = data.Search;
  for (let i = 0; i < films.length; i += 5) {
    const row = document.createElement("div");
    row.className = "ligne_films";
    films.slice(i, i + 5).forEach(film => row.appendChild(createMovieCard(film)));
    container.appendChild(row);
  }

  currentPage++;
  loadMoreBtn.style.display = "block";
  loadMoreBtn.textContent = "Load more";
}

btn.addEventListener("click", () => {
  currentQuery = input.value.trim();
  performSearch(true);
});

input.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentQuery = input.value.trim();
    performSearch(true);
  }, 400);
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    currentQuery = input.value.trim();
    performSearch(true);
  }
});

loadMoreBtn.addEventListener("click", () => {
  performSearch(false);
});
