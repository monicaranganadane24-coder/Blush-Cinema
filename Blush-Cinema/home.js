import { searchMovies, getMovieById } from "./api.js";

const detail_film = document.getElementById("detail_film");
const charger_film = document.getElementById("charger_film");

let query = "Spider-Man";
let currentPage = 1;

async function creer_carte_film(film) {
  const div = document.createElement("div");
  div.className = "carte_film";

  const poster = film.Poster && film.Poster !== "N/A" ? film.Poster : "images/placeholder.jpg";

  let resume = "Loading summary...";
  try {
    const details = await getMovieById(film.imdbID);
    if (details && details.Plot && details.Plot !== "N/A") {
      resume = details.Plot.length > 100 
        ? details.Plot.substring(0, 100) + "..." 
        : details.Plot;
    } else {
      resume = "No summary available.";
    }
  } catch (error) {
    resume = "Summary unavailable.";
  }

  div.innerHTML = `
    <img src="${poster}" alt="${film.Title}">
    <h3>${film.Title}</h3>
    <p class="resume">${resume}</p>
    <a href="movie.html?id=${film.imdbID}" class="voir_plus">Learn more</a>
  `;

  return div;
}

async function loadMovies() {
  const data = await searchMovies(query, currentPage);
  if (!data.Search) return;

  const films = data.Search.slice(0, 10);

  for (let i = 0; i < films.length; i += 5) {
    const rangée = document.createElement("div");
    rangée.className = "rangée_film";

    const cardPromises = films.slice(i, i + 5).map(film => creer_carte_film(film));
    const cards = await Promise.all(cardPromises);
    
    cards.forEach(card => rangée.appendChild(card));
    detail_film.appendChild(rangée);
  }

  currentPage++;
  charger_film.style.display = "block";
}

charger_film.addEventListener("click", () => {
  loadMovies();
});

loadMovies();
