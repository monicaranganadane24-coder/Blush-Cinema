import { getMovieById } from "./api.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const container = document.getElementById("movie-details");

function formatDate(dateStr) {
  if (!dateStr || dateStr === "N/A") return "N/A";
  const parts = dateStr.split(" ");
  const day = parts[0];
  const monthStr = parts[1];
  const year = parts[2];
  const months = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
    January: "01", February: "02", March: "03", April: "04", May: "05", June: "06",
    July: "07", August: "08", September: "09", October: "10", November: "11", December: "12"
  };
  const mm = months[monthStr] || "01";
  const dd = day.padStart(2, "0");
  return `${dd}/${mm}/${year}`;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

async function showMovie() {
  if (!id) {
    container.innerHTML = `<p>Movie not found. Missing ID.</p>`;
    return;
  }

  const film = await getMovieById(id);
  if (!film || film.Response === "False") {
    container.innerHTML = `<p>Movie not found.</p>`;
    return;
  }

  const poster = film.Poster && film.Poster !== "N/A" ? film.Poster : "images/placeholder.jpg";

  const dvdOrReleased = film.DVD && film.DVD !== "N/A"
    ? formatDate(film.DVD)
    : (film.Released && film.Released !== "N/A"
        ? formatDate(film.Released)
        : "Date not available");

  const notesHtml = Array.isArray(film.Ratings) && film.Ratings.length
    ? `<div class="notes"><strong>Notes:</strong><ul>${film.Ratings.map(r => `<li>${escapeHtml(r.Source)}: ${escapeHtml(r.Value)}</li>`).join("")}</ul></div>`
    : `<div class="notes"><strong>Notes:</strong> N/A</div>`;

  container.innerHTML = `
    <img src="${poster}" alt="Poster ${escapeHtml(film.Title)}">
    <div class="details_film">
      <h2>${escapeHtml(film.Title)} <small>(${escapeHtml(film.Year)})</small></h2>
      <p><strong>Genre:</strong> ${escapeHtml(film.Genre)}</p>
      <p><strong>Director:</strong> ${escapeHtml(film.Director)}</p>
      <p><strong>Cast:</strong> ${escapeHtml(film.Actors)}</p>
      <p><strong>Summary:</strong> ${escapeHtml(film.Plot)}</p>
      <p><strong>IMDb Rating:</strong> ${escapeHtml(film.imdbRating || "N/A")}</p>
      ${notesHtml}
      <p><strong>Release Date:</strong> ${dvdOrReleased}</p>
    </div>
  `;
}

showMovie();
