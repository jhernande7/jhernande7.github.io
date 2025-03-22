/*
    Name: Jonathan Hernandez-Cardenas
    Date: 3.21.2025
    CSC 372-01
    
    This is the javascript file for the git hub gallery homework.
*/

document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");
    const searchBtn = document.getElementById("search-button");
    const userInfoContainer = document.getElementById("user-info");
    const repoCardsContainer = document.getElementById("repo-list");
    const loadingElement = document.getElementById("loading");
    const errorMessage = document.getElementById("error-message");

    const defaultUser = 'jhernande7' //put my username here


    searchBtn.addEventListener("click", handleSearch); 
    usernameInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    });

    fetchUserWithRepos(defaultUser);

    ///functions for the fetching
    function handleSearch() {
        const username = usernameInput.value.trim();
        if (username) {
            fetchUserWithRepos(username);
        } else {
            alert("Please enter a GitHub username.");
        }
    }

    async function fetchUserWithRepos(username) {
        userInfoContainer.innerHTML = ""; // Clear previous user info
        repoCardsContainer.innerHTML = ""; // Clear previous repo cards
        hideError();
        showLoading(); // Show loading indicator

        try {
            //fetch user data
            const userData = await fetchUserData(username);
            displayUserInfo(userData);

            //fetch user repos data
            const reposData = await fetchUserRepos(username);
             //show repos
             const fetchedRepos = reposData.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0,20); //sort repos by updated date

            if (fetchedRepos.length == 0) {
                showError("No repositories found for this user.");
            } else {
                for (const repo of fetchedRepos) {
                    const languages = await fetchRepoLanguages(repo.languages_url); //fetch languages for each repo
                    const commits = await fetchRepoCommits(repo.commits_url.replace("{/sha}", "")); //fetch commits for each repo
                    displayRepoCard(repo, languages, commits.length); //display each repo card
                }
            }
        } catch (error) {
            console.error("Error: ", error);
            showError("Failed to fetch data");
        } finally {
            hideLoading(); // Hide loading indicator
        }
    }
    
    //fetch functions for user data, repos, languages and commits
    async function fetchUserData(username) {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if(!response.ok) {
            throw new Error("User not found");
        } 
        return response.json();
    }

    async function fetchUserRepos(username) {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
        if(!response.ok) {
            throw new Error("Repositories not found");
        }
        return response.json();
    }

    async function fetchRepoLanguages(languagesUrl) {
        const response = await fetch(languagesUrl);
        if(!response.ok) {
            throw new Error("Languages not found");
        }
        return response.json();
    }

    async function fetchRepoCommits(commitsUrl) {
        const response = await fetch(`${commitsUrl}?per_page=100`); //fetching up to 100 commits for each repo
        if(!response.ok) {
            throw new Error("Commits not found");
        }
        return response.json();
    }

    function displayUserInfo(userData) {
        userInfoContainer.innerHTML = `
            <img src="${userData.avatar_url}" alt="${userData.login}" class="avatar">
            <div class="user-details">
                <h2>${userData.name || userData.login}</h2>
                <p>${userData.bio || ""}</p>
                <p>
                    <a href="${userData.html_url}" target="_blank">
                        <i class="fab fa-github"></i> View Github Profiles
                    </a>
                </p>
            </div>
        `;
    }

    function displayRepoCard(repo, languages, commitsCount) {
        const createdDate = new Date(repo.created_at).toLocaleDateString();
        const updatedDate = new Date(repo.updated_at).toLocaleDateString();
        
        const languagesList = Object.keys(languages).map(lang => `<span class="language-tag">${lang}</span>`).join('');

        const repoCard = document.createElement("div");
        repoCard.className = "repo-card";
        repoCard.innerHTML = `
            <div class="repo-header">
                <i class="far fa-folder"></i>
                <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
            </div>
            <p class="repo-description">${repo.description || "No description available"}</p>
            <div class="repo-stats">
                <div class="repo-stat">
                    <i class="far fa-calendar-alt"></i> Created: ${createdDate}
                </div>
                <div class="repo-stat">
                    <i class="fas fa-history"></i> Updated: ${updatedDate}
                </div>
                <div class="repo-stat">
                    <i class="fas fa-code-commit"></i> Commits: ${commitsCount}
                </div>
                <div class="repo-stat">
                    <i class="fas fa-eye"></i> Watchers: ${repo.watchers_count}
                </div>
                <div class="repo-stat">
                    <i class="fas fa-code"></i> Languages:
                    <div class="lanugaes-list">
                    ${languagesList || '<span class="language-tag">None</span>'}
                </div>
                </div>
            </div>
        `;

        repoCardsContainer.appendChild(repoCard);
    }

    function showLoading() {
        loadingElement.style.display = "block";
    }
    function hideLoading() {
        loadingElement.style.display = "none";
    }
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    }
    function hideError() {
        errorMessage.style.display = "none";
    }
});