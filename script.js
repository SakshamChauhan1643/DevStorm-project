const usernameInput = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", getRepositories);

async function getRepositories() {

    const username = usernameInput.value;

    const response = await fetch(
        `https://api.github.com/users/${username}/repos`
    );

    const repositories = await response.json();
    
}