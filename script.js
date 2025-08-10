const APIURL = "https://api.github.com/users/";

// DOM elements
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

/**
 * Fetches a user's data from the GitHub API.
@param {string} username - The GitHub username to search for.
 */
async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username);
        createUserCard(data);
        getRepos(username);
    } catch (err) {
        if (err.response && err.response.status == 404) {
            createErrorCard("No profile with this username");
        } else {
            createErrorCard("An error occurred while fetching the user.");
            console.error(err);
        }
    }
}

/**
 * Fetches a user's repositories from the GitHub API.
 * @param {string} username - The GitHub username.
 */
async function getRepos(username) {
    try {
        // Fetch repos sorted by creation date, newest first
        const { data } = await axios(APIURL + username + "/repos?sort=created");
        addReposToCard(data);
    } catch (err) {
        createErrorCard("Problem fetching repos");
        console.error(err);
    }
}

/**
 * Creates and displays the user profile card in the DOM.
 * @param {object} user - The user data object from the API.
 */
function createUserCard(user) {
    const userID = user.name || user.login;
    const userBio = user.bio ? `<p>${user.bio}</p>` : "";
    const cardHTML = `
        <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${userID}" class="avatar" onerror="this.onerror=null; this.src='https://placehold.co/150x150/2c3e50/ffffff?text=User';">
            </div>
            <div class="user-info">
                <h2>${userID}</h2>
                ${userBio}
                <ul>
                    <li>${user.followers} <strong>Followers</strong></li>
                    <li>${user.following} <strong>Following</strong></li>
                    <li>${user.public_repos} <strong>Repos</strong></li>
                </ul>
                <div id="repos"></div>
            </div>
        </div>
    `;
    main.innerHTML = cardHTML;
}

/**
 * Creates and displays an error message card.
 * @param {string} msg - The error message to display.
 */
function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;
    main.innerHTML = cardHTML;
}

/**
 * Adds the user's repositories to the profile card.
 * @param {Array} repos - An array of repository objects from the API.
 */
function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");
    // Display the 5 most recent repositories
    repos.slice(0, 5).forEach((repo) => {
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;
        reposEl.appendChild(repoEl);
    });
}

// Event listener for the form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = search.value;
    if (user) {
        getUser(user);
        search.value = "";
    }
});

// Optional: Load a default user on page load
// getUser("google");