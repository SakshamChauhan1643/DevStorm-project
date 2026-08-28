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


    // 2. Get user's commits
    for (const repo of repositories) {

        const commitResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}`
        );

        const commits = await commitResponse.json();

        console.log(`Commits in ${repo.name}:`);

        commits.forEach(commit => {
            console.log(commit.commit.author.date);
        });
    }

}
