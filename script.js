const usernameInput = document.getElementById("username");
const analyze = document.getElementById("analyze-button");

analyze.addEventListener("click", getRepositories);

async function getRepositories() {

    const username = usernameInput.value;

    const response = await fetch(
        `https://api.github.com/users/${username}/repos`
    );

    const repositories = await response.json();


    // 1. Get user's repositories
    repositories.forEach(repo => {
        console.log(repo.name, repo.language);
    });


    // 2. Get user's languages
    const languages = {};

    repositories.forEach(repo => {

        const language = repo.language;

        if (language) {
            if (languages[language]) {
                languages[language]++;
            } else {
                languages[language] = 1;
            }
        }

    });

    console.log("Languages:");
    console.log(languages);


    // 3. Get user's commits
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
