let switchButton = document.getElementById("switcher-container");
let searchText = document.getElementById("switcher-text");
let searchBarText = document.getElementById("search-bar");
let searchButton = document.getElementById("search-button");

let searchState = new Array(1);
searchState[0] = 0;
// 0 = Search by title
// 1 = Search by content inside

function switchSearch (searchState) {

    if (searchState[0] == 0) {
        resultGrid.innerHTML = "";
        searchText.innerHTML = "Search by <span class=\"switch-state-color\">title</span>";
        searchBarText.placeholder = "Search a book by specify his title";
        searchButton.setAttribute('onclick','getBooksByTitle()')

        searchState[0] = 1;
    }
    else if (searchState[0] == 1) {
        resultGrid.innerHTML = "";
        searchText.innerHTML = "Search by <span class=\"switch-state-color\">content</span>";
        searchBarText.placeholder = "Search the content inside a book";
        searchButton.setAttribute('onclick','getBooksByContent()')

        searchState[0] = 0;
    }
    else {
        alert("Critical error, refreshing page...");
        window.location.reload();
    }
    return false
}
