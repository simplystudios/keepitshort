const apiUrl = "https://en.wikipedia.org/w/rest.php/v1/search/page?q=";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const imageGallery = document.getElementById("image-gallery");

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
                    const imageElements = images.map(image => createImageElement(image.thumbnail.url, image.title, '300px'));
                    imageGallery.innerHTML = imageElements.join('');
                } else {
                    imageGallery.textContent = "No images found.";
                }
            }
        })
        .catch(error => {
            imageGallery.textContent = "An error occurred during the search.";
            console.error(error);
        });
};

const modifyImageUrl = (url, size) => {
  const filename = url.substring(url.lastIndexOf('/') + 1);
  const modifiedUrl = `${url.substring(0, url.lastIndexOf('/') + 1)}${size}-${filename}`;
  return modifiedUrl;
};

function createImageElement(url, alt, size) {
    const modifiedUrl = modifyImageUrl(url, size);
    return `<img class="gallery-image" src="${modifiedUrl}" alt="${alt}">`;
}

searchButton.addEventListener("click", performSearch);
