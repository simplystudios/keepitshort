const duckDuckGoApiUrl = "https://api.duckduckgo.com/?format=json&q=";
const searchEngineApiUrl = "https://search-engine-api.p.rapidapi.com/api/Search/";
const pagenum = document.getElementById("page")
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const Container = document.getElementById("search-results");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const Pagetitle = document.getElementById("pgt");
let currentPage = 1;
pagenum.innerHTML = currentPage
// Function to clear previous search results
const clearResults = () => {
  while (Container.firstChild) {
    Container.removeChild(Container.firstChild);
  }
};

// Function to modify the image URL to the desired size
const modifyImageUrl = (url, size) => {
  const filename = url.substring(url.lastIndexOf("/") + 1);
  const modifiedUrl = `${url.substring(0, url.lastIndexOf("/") + 1)}${size}px-${filename}`;
  return modifiedUrl;
};

const createListItem = (title, image, description, link) => {
  const listItem = document.createElement("div");
  listItem.classList.add("list-item");
  listItem.classList.add("searchr");


  const listItemContent = document.createElement("a");
  listItemContent.href = link;
  listItemContent.target = "_blank"; // Open link in a new tab
  listItemContent.rel = "noopener noreferrer"; // Set recommended security attributes

  const titleElement = document.createElement("h3");
  titleElement.textContent = title;

  const linkElement = document.createElement("p1");
  linkElement.innerHTML = link;

  const descriptionElement = document.createElement("p");
  descriptionElement.innerHTML = description;


  listItemContent.appendChild(titleElement);
  listItemContent.appendChild(descriptionElement);
    listItem.appendChild(linkElement)
  listItem.appendChild(listItemContent);

  return listItem;
};


const performSearch = () => {
  const query = searchInput.value;
  if (query.trim() === "") {
    Container.textContent = "Please enter a search term.";
    return;
  }

  clearResults(); // Clear previous search results

  const duckDuckGoUrl = `${duckDuckGoApiUrl}${query}`;

  fetch(duckDuckGoUrl)
    .then((response) => response.json())
    .then((duckDuckGoData) => {
      updatePaginationButtons();
      if (duckDuckGoData.Abstract) {
        const wikiUrl = duckDuckGoData.AbstractURL;
        const abstract = duckDuckGoData.Abstract;
        const heading = duckDuckGoData.Heading;
        const image = duckDuckGoData.Image;

        const listItem = document.createElement("div");
        listItem.classList.add("list-item");
        listItem.classList.add("duckduckgo");

        const listItemContent = document.createElement("a");
        listItemContent.href = wikiUrl;
        listItemContent.target = "_blank"; // Open link in a new tab
        listItemContent.rel = "noopener noreferrer"; // Set recommended security attributes

        const title = document.createElement("h3");
        title.classList.add("center");
        title.textContent = heading;

        const excerpt = document.createElement("p");
        excerpt.classList.add("center");
        excerpt.textContent = abstract;


        listItemContent.appendChild(title);
        listItemContent.appendChild(excerpt);
        listItem.appendChild(listItemContent);
        Container.appendChild(listItem);
      }
    })
    .catch((error) => {
      console.error(error);
    });


  // Fetch search results from the additional search engine API
  const searchurl = `${searchEngineApiUrl}${query}?numOfPages=${currentPage}`;
  fetch(searchurl, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": sh29ah350194957382,
      "X-RapidAPI-Host": "search-engine-api.p.rapidapi.com",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      updatePaginationButtons();
      if (data.error) {
        Container.textContent = data.error;
      } else {
        if (data.length > 0) {
          data.forEach((item) => {
            const listItem = createListItem(item.title, item.image, item.description, item.link);
            Container.appendChild(listItem);
          });
        } else {
          Container.textContent = "No results found.";
        }
      }
    })
    .catch((error) => {
      Container.textContent = "An error occurred during the search.";
      console.error(error);
    });
};

function updatePaginationButtons() {
    pagenum.innerHTML = `Page number : ${currentPage}`
    if (currentPage === 1) {
        previousButton.disabled = true;
    } else {
        previousButton.disabled = false;
    }

    if (currentPage === 3) {
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

// ...
const handleKeyPress = (event) => {
  if (event.keyCode === 13 || event.which === 13) {
    performSearch();
  }
};

searchButton.addEventListener("click", performSearch);
searchInput.addEventListener("keypress", handleKeyPress);
