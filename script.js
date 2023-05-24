const Container = document.getElementById("search-results");
const Titlecontain = document.getElementById("title")
const Imagecontain = document.getElementById("img")
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const apiUrl = "https://anshwadhwa.pythonanywhere.com/api/search/";

let performSearch = () => {
    const query = searchInput.value;
    if (query.trim() === "") {
        Container.textContent = "Please enter a search term.";
        return;
    }

    const url = `${apiUrl}${query}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Container.textContent = data.error;
            } else {
                Container.textContent = data.description;
                Titlecontain.textContent = data.title;
                Imagecontain.src = data.image_url;
            }
        })
        .catch(error => {
            Container.textContent = "An error occurred during the search.";
            console.error(error);
        });
};

searchButton.addEventListener("click", performSearch);