const Container = document.getElementById("search-results");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const apiUrl = "https://en.wikipedia.org/w/rest.php/v1/search/page?q=";
const Pagetitle = document.getElementById("pgt");

let performSearch = () => {
    const query = searchInput.value;
    if (query.trim() === "") {
        Container.textContent = "Please enter a search term.";
        return;
    }

    const url = `${apiUrl}${query}`;
    Pagetitle.textContent = `${query} - Keepitshort`; // Set the page title

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Container.textContent = data.error;
            } else {
                const pages = data.pages;
                if (pages.length > 0) {
                    Container.innerHTML = ""; // Clear previous results
                    pages.forEach(page => {
                        const listItem = document.createElement("div");
                        listItem.classList.add("list-item");

                        const title = document.createElement("h3");
                        title.classList.add("center");
                        title.textContent = page.title;

                        const excerpt = document.createElement("p");
                        excerpt.classList.add("center");
                        excerpt.innerHTML = page.excerpt.replace(/<span[^>]*>(.*?)<\/span>/gi, "$1");

                        const image = document.createElement("img");
                        image.src = page.thumbnail ? modifyImageUrl(page.thumbnail.url, 330, 150) : "";
                        image.alt = page.title;
                        image.classList.add("thumbnail");

                        listItem.appendChild(title);
                        listItem.appendChild(image);
                        listItem.appendChild(excerpt);
                        Container.appendChild(listItem);
                    });
                } else {
                    Container.textContent = "No results found.";
                }
            }
        })
        .catch(error => {
            Container.textContent = "An error occurred during the search.";
            console.error(error);
        });
};

// Function to modify the image URL to the desired size
const modifyImageUrl = (url, size) => {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const modifiedUrl = `${url.substring(0, url.lastIndexOf('/') + 1)}${size}px-${filename}`;
    return modifiedUrl;
};

searchButton.addEventListener("click", performSearch);
