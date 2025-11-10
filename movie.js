const url = new URL(location.href); 
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");

const REVIEW_API = 'https://f3a79e29-2e6c-43aa-89fb-954b24f2f8e8-00-3kd7573wcqa9b.sisko.replit.dev/api/v1/reviews/'
const MOVIE_API = `https://api.themoviedb.org/3/movie/${movieId}?api_key=52b34e299629ea5fc68fd111d89a2f7b`;
const ARTICLE_API = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(movieTitle)}`;

const main = document.getElementById("section");
const title = document.getElementById("title");

title.innerText = movieTitle;

// Fetch and Display Movie Details
fetch(MOVIE_API)
  .then(res => res.json())
  .then(data => {
    const movieDetails = document.createElement('div');
    movieDetails.innerHTML = `
      <div class="movie-details">
        <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}">
        <div>
          <h2>${data.title} (${data.release_date.split('-')[0]})</h2>
          <p><strong>Rating:</strong> ⭐ ${data.vote_average} / 10</p>
          <p><strong>Overview:</strong> ${data.overview}</p>
        </div>
      </div>
    `;
    main.prepend(movieDetails);
  });


fetch(ARTICLE_API)
  .then(res => res.json())
  .then(data => {
    if (data.extract) {
      const articleSection = document.createElement('div');
      articleSection.innerHTML = `
        <h3>Related Articles</h3>
        <p>${data.extract}</p>
        <a href="${data.content_urls.desktop.page}" target="_blank">Read more on Wikipedia</a>
      `;
      main.appendChild(articleSection);
    }
  });

// Reviews Section
const div_new = document.createElement('div');
div_new.innerHTML = `
  <div class="row">
    <div class="column">
      <div class="card">
          <p><strong>New Review:</strong></p>
          <input type="text" id="new_review" placeholder="Write a review">
          <p><strong>user:</strong></p>
          <input type="text" id="new_user" placeholder="user name">
          <p><a href="#" onclick="saveReview('new_review', 'new_user')">💾 Submit</a></p>
      </div>
    </div>
  </div>
`;
main.appendChild(div_new);

returnReviews(REVIEW_API);

function returnReviews(url) {
  fetch(url + "movie/" + movieId)
    .then(res => res.json())
    .then(data => {
      data.forEach(review => {
        const div_card = document.createElement('div');
        div_card.innerHTML = `
          <div class="row">
            <div class="column">
              <div class="card" id="${review._id}">
                <p><strong>Review:</strong> ${review.review}</p>
                <p><strong>User:</strong> ${review.user}</p>
                <p><a href="#" onclick="editReview('${review._id}','${review.review}', '${review.user}')">✏️ Edit</a> 
                   <a href="#" onclick="deleteReview('${review._id}')">🗑 Delete</a></p>
              </div>
            </div>
          </div>
        `;
        main.appendChild(div_card);
      });
    });
}

// Edit Review Function
function editReview(id, review, user) {
  const element = document.getElementById(id);
  element.innerHTML = `
    <p><strong>Review:</strong> <input type="text" id="review${id}" value="${review}"></p>
    <p><strong>User:</strong> <input type="text" id="user${id}" value="${user}"></p>
    <p><a href="#" onclick="saveReview('review${id}', 'user${id}', '${id}')">💾 Save</a></p>
  `;
}

// Save Review (New or Edited)
function saveReview(reviewInputId, userInputId, id = "") {
  const review = document.getElementById(reviewInputId).value;
  const user = document.getElementById(userInputId).value;

  fetch(id ? REVIEW_API + id : REVIEW_API + "new", {
    method: id ? "PUT" : "POST",
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user, review, movieId }),
  })
  .then(res => res.json())
  .then(() => location.reload());
}

// Delete Review
function deleteReview(id) {
  fetch(REVIEW_API + id, { method: "DELETE" })
    .then(res => res.json())
    .then(() => location.reload());
}
