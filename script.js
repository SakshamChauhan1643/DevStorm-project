const usernameInput = document.getElementById("username");
const analyze = document.getElementById("analyze-button");

analyze.addEventListener("click", getRepositories);

async function getRepositories() {

    const username = usernameInput.value;

    const profileResponse = await fetch(
        `https://api.github.com/users/${username}`
    );
    const profile = await profileResponse.json();
    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-username").textContent = profile.login;

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


    // 3. Calculate language percentage

    const totalRepositories = Object.values(languages)
        .reduce((sum, count) => sum + count, 0);

    console.log("Language Calculation:");

    for (const language in languages) {

        const count = languages[language];

        const percentage = (count / totalRepositories) * 100;

        console.log(
            `${language}: ${count} repositories (${percentage.toFixed(2)}%)`
        );

    }
    const languageChart = document.getElementById("language-chart");

    for (const language in languages) {

        const count = languages[language];

        const percentage = (count / totalRepositories) * 100;

        const languageItem = document.createElement("div");

        languageItem.textContent =
            `${language}: ${percentage.toFixed(2)}%`;

        languageChart.appendChild(languageItem);
    }


    // 4. Get user's commits

    const commitDates = [];

    for (const repo of repositories) {

        const commitResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}`
        );

        const commits = await commitResponse.json();

        console.log(`Commits in ${repo.name}:`);

        commits.forEach(commit => {

            const date = commit.commit.author.date;

            console.log(date);

            commitDates.push(date);

        });

    }
    const totalCommits = commitDates.length;
    document.getElementById("total-commits").textContent = totalCommits;

    // Calculate commits per day

    const commitsPerDay = {};

    commitDates.forEach(date => {

        const day = new Date(date)
            .toISOString()
            .split("T")[0];

        if (commitsPerDay[day]) {
            commitsPerDay[day]++;
        } else {
            commitsPerDay[day] = 1;
        }

    });
    const commitChart = document.getElementById("commit-chart");
    for (const day in commitsPerDay) {

    const bar = document.createElement("div");

    bar.textContent = `${day}: ${commitsPerDay[day]} commits`;
    bar.style.width = `${commitsPerDay[day] * 30}px`;

    commitChart.appendChild(bar);
    }

    // 5. Calculate user's streak

    // Remove duplicate commit days
    const uniqueDays = new Set();

    commitDates.forEach(date => {

        const day = new Date(date)
            .toISOString()
            .split("T")[0];

        uniqueDays.add(day);

    });


    // Sort dates from newest to oldest
    const sortedDays = Array.from(uniqueDays)
        .sort()
        .reverse();


    // Calculate streak
    let streak = 0;

    if (sortedDays.length > 0) {

        let previousDate = new Date(sortedDays[0]);

        for (const day of sortedDays) {

            const currentDate = new Date(day);

            const difference =
                (previousDate - currentDate) /
                (1000 * 60 * 60 * 24);


            if (difference === 0) {

                streak++;

            }
            else if (difference === 1) {

                previousDate = currentDate;
                streak++;
            }
            else {

                break;

            }

        }
    }

    console.log("Current streak:", streak, "days");
    document.getElementById("current-streak").textContent = `${streak} days`;

    // Calculate longest streak
    let longestStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < sortedDays.length; i++) {

        if (i === 0) {
            currentStreak = 1;
        } else {

            const currentDate = new Date(sortedDays[i]);
            const previousDate = new Date(sortedDays[i - 1]);

            const difference =
                (previousDate - currentDate) /
                (1000 * 60 * 60 * 24);

            if (difference === 1) {
                currentStreak++;
            } else {
                currentStreak = 1;
            }
        }

        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }
    }

    document.getElementById("longest-streak").textContent =
        `${longestStreak} days`;
    }

