const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=52b34e299629ea5fc68fd111d89a2f7b&page=1';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=52b34e299629ea5fc68fd111d89a2f7b&query=";
const POPULARAPI = 'https://api.themoviedb.org/3/movie/popular?api_key=52b34e299629ea5fc68fd111d89a2f7b&page=1';

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
const popularHeading = document.getElementById("popular-heading");

let movieTitles = [];
let fuse;

// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true
});

// Fetch movie titles for fuzzy search
fetch(POPULARAPI)
  .then(res => res.json())
  .then(data => {
    movieTitles = data.results.map(movie => movie.title);
    fuse = new Fuse(movieTitles, {
      threshold: 0.3
    });
  });

// Load popular movies initially
returnMovies(APILINK, false);

// Fetch and display movies
function returnMovies(url, isSearch = false) {
  if (isSearch) {
    popularHeading.style.display = "none"; // Hide heading on search
  } else {
    popularHeading.style.display = "block"; // Show heading on home
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      main.innerHTML = '';

      if (data.results && data.results.length > 0) {
        displayResults(data.results);
      } else {
        alert("Movie not found.");
        main.innerHTML = "<h2>No results found.</h2>";
      }
    });
}

// Display movie cards
function displayResults(results) {
  results.forEach(element => {
    const div_card = document.createElement('div');
    div_card.setAttribute('class', 'card');

    const div_row = document.createElement('div');
    div_row.setAttribute('class', 'row');

    const div_column = document.createElement('div');
    div_column.setAttribute('class', 'column');

    const image = document.createElement('img');
    image.setAttribute('class', 'thumbnail');

    const title = document.createElement('h3');

    fetch(`https://api.themoviedb.org/3/movie/${element.id}?api_key=52b34e299629ea5fc68fd111d89a2f7b&language=en-US`)
      .then(res => res.json())
      .then(movie => {
        const genres = movie.genres.map(g => g.name).join(", ");
        const rating = movie.vote_average.toFixed(1);
        const releaseDate = movie.release_date;

        title.innerHTML = `
          <strong>${element.title}</strong><br>
          ⭐ ${rating}/10 <br>
          🎭 ${genres} <br>
          📅 ${releaseDate} <br>
          <a href="movie.html?id=${element.id}&title=${encodeURIComponent(element.title)}">Reviews</a>
        `;

        image.src = IMG_PATH + element.poster_path;

        div_card.appendChild(image);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);
        main.appendChild(div_row);
        scroll.update();
      });
  });
}

// Handle search
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchItem = search.value.trim();
  if (searchItem) {
    fetch(SEARCHAPI + encodeURIComponent(searchItem))
      .then(res => res.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          returnMovies(SEARCHAPI + encodeURIComponent(searchItem), true);
        } else {
          const result = fuse.search(searchItem);
          if (result.length > 0) {
            const corrected = result[0].item;
            alert(`No results for "${searchItem}". Showing results for "${corrected}".`);
            returnMovies(SEARCHAPI + encodeURIComponent(corrected), true);
          } else {
            alert(`No results found for "${searchItem}".`);
            main.innerHTML = "<h2>No results found.</h2>";
            popularHeading.style.display = "none";
          }
        }
      });

    search.value = "";
  }
});
