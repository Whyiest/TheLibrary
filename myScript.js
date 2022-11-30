let searchbar;
let resultGrid;
let resultElements = [];
let resultImageContainer = [];
let resultImage = [];
let resultElementTitle = [];
let resultElementAuthor = [];
let resultElementPublishers = [];
let coverLink = [];
let bookLink = [];
let resultMessage;
let bookNumber;
let displayResult;
let keyValue;
let key;

searchbar = document.getElementById('search-bar');
resultGrid = document.getElementById("result-grid");
resultMessage = document.getElementById("result-message");

function getBooks() {

    if (searchbar.value === "") {
        alert("Error : you don't specify any term to search. Please retry !");
    } else {
        document.getElementById("result-grid").innerHTML = "";
        resultMessage.innerHTML = "Loading...";

        fetch("http://openlibrary.org/search.json?q=" + searchbar.value +
            {method: "GET", headers: {"Content-type": "application/json; charset=UTF-8"}})
            .then(response => response.json())
            .then(listBooks => {

                console.log(listBooks);
                bookNumber = listBooks.num_found;

                if (bookNumber == 0) {
                    alert("Sorry, can't find any book, please enter a valid search.");
                    resultMessage.innerHTML = "No result found";
                } else {

                    resultMessage.innerHTML = bookNumber + " books founds :";

                    if (bookNumber > 15) {
                        displayResult = 15;
                    } else {
                        displayResult = bookNumber;
                    }
                    for (let i = 0; i < displayResult; i++) {

                        resultElements.push(document.createElement("div"));
                        resultElements[i].classList.add("result-element");
                        resultGrid.appendChild(resultElements[i]);


                        resultImageContainer.push(document.createElement("a"));
                        resultImageContainer[i].classList.add("result-element-image-container");
                        bookLink = "https://openlibrary.org/" + listBooks.docs[i].key;
                        resultImageContainer[i].href = bookLink;
                        resultImageContainer[i].setAttribute('target', '_blank');
                        resultElements[i].appendChild(resultImageContainer[i]);


                        resultImage.push(document.createElement("img"));
                        resultImage[i].classList.add("result-element-image");
                        resultImageContainer[i].appendChild(resultImage[i]);

                        resultElementTitle.push(document.createElement("p"));
                        resultElementTitle[i].classList.add("result-element-title");
                        resultElements[i].appendChild(resultElementTitle[i]);

                        resultElementAuthor.push(document.createElement("p"));
                        resultElementAuthor[i].classList.add("result-element-author");
                        resultElements[i].appendChild(resultElementAuthor[i]);

                        resultElementPublishers.push(document.createElement("p"));
                        resultElementPublishers[i].classList.add("result-element-publishers");
                        resultElements[i].appendChild(resultElementPublishers[i]);


                        if (typeof listBooks.docs[i].isbn !== 'undefined') {
                            key = "isbn/";
                            keyValue = listBooks.docs[i].isbn[0];
                            coverLink[i] = "https://covers.openlibrary.org/b/" + key + keyValue + "-L.jpg";

                        } else {
                            coverLink[i] = "images/default-cover.png";
                        }

                        // Setting the values :

                        resultImage[i].src = coverLink[i];
                        resultElementTitle[i].innerHTML = listBooks.docs[i].title;


                        resultElementAuthor[i].innerHTML = "<span class='blackBold'>Author : </span>"

                        if (Array.isArray(listBooks.docs[i].author_name)) {
                            for (let j = 0; j < listBooks.docs[i].author_name.length; j++) {
                                resultElementAuthor[i].innerHTML += listBooks.docs[i].author_name[j];
                            }
                        } else if (typeof listBooks.docs[i].author_name === 'undefined') {
                            resultElementAuthor[i].innerHTML += "Not defined";
                        } else {
                            resultElementAuthor[i].innerHTML += listBooks.docs[i].author_name;
                        }


                        resultElementPublishers[i].innerHTML = "<span class='blackBold'>Publishers : </span>"

                        if (Array.isArray(listBooks.docs[i].publisher)) {
                            for (let h = 0; h < listBooks.docs[i].publisher.length; h++) {
                                resultElementPublishers[i].innerHTML += listBooks.docs[i].publisher[h];
                            }
                        } else if (typeof listBooks.docs[i].publisher === 'undefined') {
                            resultElementPublishers[i].innerHTML += "Not defined";
                        }
                        else {
                            resultElementPublishers[i].innerHTML = listBooks.docs[i].publisher;
                        }
                    }
                }
            });
    }
    return false;
}


// Execute search when pressing enter.

setInterval(checkEmpty, 100);

function checkEmpty() {
    if (searchbar.value == "") {
        resultGrid.innerHTML = "";
        resultMessage.innerHTML = "Search a book with the field above !";
    }
}

searchbar.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search-button").click();
    }
});
