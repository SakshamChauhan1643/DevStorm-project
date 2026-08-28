const usernameInput = document.getElementById("username");
const analyze = document.getElementById("analyze-button");

analyze.addEventListener("click", getRepositories);

async function getRepositories() {

    const username = usernameInput.value;

    const response = await fetch(
        `https://api.github.com/users/${username}/repos`
    );

    const repositories = await response.json();

    repositories.forEach(repo => {
    console.log(repo.name,repo.language);


});

}