let searchbar;
let resultGrid;
let resultElements = [];
let resultImageContainer = [];
let resultImage = [];
let coverURL = [];
let resultElementTitle = [];
let resultElementAuthor = [];
let resultElementPublishers = [];
let resultElementSubjects = [];
let resultElementHighlights = [];
let bookLink = [];
let resultMessage;
let bookNumber;
let displayResult;
let loadedBookNumber = -1;
let verif1;
let verif2;
let currentHighlights;
let toReplace;


searchbar = document.getElementById('search-bar');
resultGrid = document.getElementById("result-grid");
resultMessage = document.getElementById("result-message");

function getBooks() {

    if (searchbar.value === "") {
        alert("Error : you don't specify any term to search. Please retry !");
    } else {

        document.getElementById("result-grid").innerHTML = "";
        resultMessage.innerHTML = "Loading...";

        fetch("http://openlibrary.org/search/inside.json?q=" + searchbar.value +
            {method: "GET", headers: {"Content-type": "application/json; charset=UTF-8"}})
            .then(response => response.json())
            .then(listBooks => {

                console.log(listBooks);
                bookNumber = listBooks.hits.total;

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

                    // ------------------ DYNAMIC ELEMENT CREATION -----------------

                    for (let i = 0; i < displayResult; i++) {

                        // Verification :

                        verif1 = listBooks.hits.hits[i];
                        verif2 = listBooks.hits.hits[i].fields;

                        if (!("edition" in verif1) || !("highlight" in verif1) || !("meta_subjectSorter" in verif2)) {
                            console.log("fail");
                            displayResult++;
                        } else {
                            loadedBookNumber++;

                            resultElements.push(document.createElement("div"));
                            resultElements[loadedBookNumber].classList.add("result-element");
                            resultGrid.appendChild(resultElements[loadedBookNumber]);


                            resultImageContainer.push(document.createElement("a"));
                            resultImageContainer[loadedBookNumber].classList.add("result-element-image-container");
                            resultImageContainer[loadedBookNumber].setAttribute('target', '_blank');
                            resultElements[loadedBookNumber].appendChild(resultImageContainer[loadedBookNumber]);


                            resultImage.push(document.createElement("img"));
                            resultImage[loadedBookNumber].classList.add("result-element-image");
                            resultImageContainer[loadedBookNumber].appendChild(resultImage[loadedBookNumber]);

                            resultElementTitle.push(document.createElement("p"));
                            resultElementTitle[loadedBookNumber].classList.add("result-element-title");
                            resultElements[loadedBookNumber].appendChild(resultElementTitle[loadedBookNumber]);

                            resultElementAuthor.push(document.createElement("p"));
                            resultElementAuthor[loadedBookNumber].classList.add("result-element-author");
                            resultElements[loadedBookNumber].appendChild(resultElementAuthor[loadedBookNumber]);

                            resultElementPublishers.push(document.createElement("p"));
                            resultElementPublishers[loadedBookNumber].classList.add("result-element-publishers");
                            resultElements[loadedBookNumber].appendChild(resultElementPublishers[loadedBookNumber]);

                            resultElementSubjects.push(document.createElement("p"));
                            resultElementSubjects[loadedBookNumber].classList.add("result-element-subjects");
                            resultElements[loadedBookNumber].appendChild(resultElementSubjects[loadedBookNumber]);

                            resultElementHighlights.push(document.createElement("p"));
                            resultElementHighlights[loadedBookNumber].classList.add("result-element-highlights");
                            resultElements[loadedBookNumber].appendChild(resultElementHighlights[loadedBookNumber]);

                            // ---------------------- VALUES SETTING ZONE ----------------


                            // ------- Setting the link to page:
                            bookLink = "https://openlibrary.org/" + listBooks.hits.hits[i].edition.url;
                            resultImageContainer[loadedBookNumber].href = bookLink;

                            // ------- Setting the book cover

                            if (typeof listBooks.hits.hits[i].edition.cover_url !== 'undefined') {
                                coverURL[i] = listBooks.hits.hits[i].edition.cover_url;
                            } else {
                                coverURL[i] = "images/default-cover.png";
                            }
                            resultImage[loadedBookNumber].src = coverURL[i];

                            // ----- Setting title :
                            resultElementTitle[loadedBookNumber].innerHTML = listBooks.hits.hits[i].fields.meta_title;

                            // ----- Setting authors :

                            resultElementAuthor[loadedBookNumber].innerHTML = "<span class='blackBold'>Author : </span>"


                            for (let j = 0; j < listBooks.hits.hits[i].edition.authors.length; j++) {
                                if (j < 5) // Limit display
                                    resultElementAuthor[loadedBookNumber].innerHTML += listBooks.hits.hits[i].edition.authors[j].name;
                            }


                            // ----- Setting publishers :

                            resultElementPublishers[loadedBookNumber].innerHTML = "<span class='blackBold'>Publishers : </span>"


                            for (let h = 0; h < listBooks.hits.hits[i].fields.meta_publisher.length; h++) {
                                if (h < 5) // Limit display
                                    resultElementPublishers[loadedBookNumber].innerHTML += listBooks.hits.hits[i].fields.meta_publisher[h];
                            }

                            // ----- Setting subjects :

                            resultElementSubjects[loadedBookNumber].innerHTML = "<span class='blackBold'>Subjects : </span>"

                            for (let z = 0; z < listBooks.hits.hits[i].fields.meta_subjectSorter.length; z++) {
                                if (z < 5) // Limit display
                                    resultElementSubjects[loadedBookNumber].innerHTML += listBooks.hits.hits[i].fields.meta_subjectSorter[z];
                            }


                            // Setting highlight :

                            resultElementHighlights[loadedBookNumber].innerHTML = "<span class='blackBold'>Highlight : </span>"

                            for (let b = 0; b < listBooks.hits.hits[i].highlight.text.length; b++) {

                                toReplace = "<span class=black> " + searchbar.value + " </span>";

                                if (b <= 4) {// Limit display
                                    currentHighlights = listBooks.hits.hits[i].highlight.text[b];
                                    try {
                                        currentHighlights = currentHighlights.replace(/{{{.*}}}/, toReplace);
                                        currentHighlights = currentHighlights.replace("{{{", "");
                                        currentHighlights = currentHighlights.replace("{{{OBJECT Object}}}", toReplace);
                                        currentHighlights = currentHighlights.replace(/{{{.*}}}/, toReplace);
                                        currentHighlights = currentHighlights.replace("}}}", "");
                                        currentHighlights = currentHighlights.replace("OBJECT", "");
                                        currentHighlights = currentHighlights.replace("object", toReplace);
                                    } catch (error) {
                                        console.log(error);
                                    };
                                }

                                resultElementHighlights[loadedBookNumber].innerHTML += "&laquo; " + currentHighlights
                                + " &raquo;<br><br>";
                            }
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
