const API_KEY = "64856988";
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query, page = 1) {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url);
  return await res.json();
}

export async function getMovieById(id) {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(id)}&plot=full`;
  const res = await fetch(url);
  return await res.json();
}
