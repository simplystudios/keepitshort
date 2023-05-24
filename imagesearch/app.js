const apiUrl = "https://en.wikipedia.org/w/rest.php/v1/search/page?q=";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const imageGallery = document.getElementById("image-gallery");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const pagenum = document.getElementById("page")

let currentPage = 1;
pagenum.innerHTML = currentPage
const imagesPerPage = 20; // Number of images to display per page

let performSearch = () => {
    const query = searchInput.value;
    if (query.trim() === "") {
        imageGallery.textContent = "Please enter a search term.";
        return;
    }

    const url = `${apiUrl}${query}&mediatype=image`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                imageGallery.textContent = data.error;
            } else {
                const images = data.pages.filter(page => page.thumbnail && page.thumbnail.url);
                if (images.length > 0) {
                    const totalPages = Math.ceil(images.length / imagesPerPage);
                    currentPage = Math.max(1, Math.min(currentPage, totalPages)); // Ensure current page is within valid range
                    const startIndex = (currentPage - 1) * imagesPerPage;
                    const endIndex = startIndex + imagesPerPage;
                    const visibleImages = images.slice(startIndex, endIndex);
                    const imageElements = visibleImages.map(image => createImageElement(image.thumbnail.url, image.title, '300px'));
                    imageGallery.innerHTML = imageElements.join('');
                    updatePaginationButtons(totalPages);
                } else {
                    imageGallery.textContent = "No images found.";
                    updatePaginationButtons(0);
                }
            }
        })
        .catch(error => {
            imageGallery.textContent = "An error occurred during the search.";
            console.error(error);
            updatePaginationButtons(0);
        });
};

const modifyImageUrl = (url, size) => {
  const filename = url.substring(url.lastIndexOf('/') + 1);
  const modifiedUrl = `${url.substring(0, url.lastIndexOf('/') + 1)}${size}-${filename}`;
  return modifiedUrl;
};

function createImageElement(url, alt, size) {
    const modifiedUrl = modifyImageUrl(url, size);
    return `<img class="gallery-image" src="${modifiedUrl}" alt="${alt}" onclick="openImage('${url}')">`;
}

let handleKeyPress = event => {
    if (event.keyCode === 13 || event.which === 13) {
        performSearch();
    }
};

searchButton.addEventListener("click", performSearch);
searchInput.addEventListener("keypress", handleKeyPress);

function openImage(url) {
    window.open(modifyImageUrl(url,"800px"), "_blank");
}

function updatePaginationButtons(totalPages) {
    pagenum.innerHTML = `Page number : ${currentPage}`
    if (currentPage === 1) {
        previousButton.disabled = true;
    } else {
        previousButton.disabled = false;
    }

    if (currentPage === totalPages) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

previousButton.addEventListener("click", () => {
    currentPage--;
    performSearch();
});

nextButton.addEventListener("click", () => {
    currentPage++;
    performSearch();
});
