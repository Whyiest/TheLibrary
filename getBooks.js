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
let resultSubjects = [];
let resultElementHighlights = [];
let coverLink = [];
let bookLink = [];
let resultMessage;
let bookNumber;
let displayResult;
let loadedBookNumber = 0;
let verif1;
let verif2;
let currentHighlights;
let toReplace;
let subjectLength;


searchbar = document.getElementById('search-bar');
resultGrid = document.getElementById("result-grid");
resultMessage = document.getElementById("result-message");


function resetData() {

    verif1 = "";
    verif2 = "";
    currentHighlights = "";
    subjectLength = 0;
    loadedBookNumber = 0;
    resultElements = [];
    resultImageContainer = [];
    resultImage = [];
    coverURL = [];
    resultElementTitle = [];
    resultElementAuthor = [];
    resultElementPublishers = [];
    resultElementSubjects = [];
    resultSubjects = [];
    resultElementHighlights = [];
    coverLink = [];
    bookLink = [];

}

function getBooksByContent() {

    if (searchbar.value === "") {
        alert("Error : you don't specify any term to search. Please retry !");
    } else {

        resetData();

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

                    resultMessage.innerHTML = bookNumber + " books founds, book list :";

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

                        if (!("edition" in verif1) || !("highlight" in verif1) || !("meta_subjectSorter" in verif2) || !("meta_publisher" in verif2)) {
                            console.log("fail");
                            displayResult++;
                        } else {
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
                            resultElementTitle[loadedBookNumber].classList.add("visible");
                            resultElements[loadedBookNumber].appendChild(resultElementTitle[loadedBookNumber]);

                            resultElementAuthor.push(document.createElement("p"));
                            resultElementAuthor[loadedBookNumber].classList.add("result-element-author");
                            resultElements[loadedBookNumber].appendChild(resultElementAuthor[loadedBookNumber]);

                            resultElementPublishers.push(document.createElement("p"));
                            resultElementPublishers[loadedBookNumber].classList.add("result-element-publishers");
                            resultElements[loadedBookNumber].appendChild(resultElementPublishers[loadedBookNumber]);

                            resultElementSubjects.push(document.createElement("div"));
                            resultElementSubjects[loadedBookNumber].classList.add("result-element-subjects-container");
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

                            subjectLength = listBooks.hits.hits[i].fields.meta_subjectSorter.length;
                            resultSubjects = null;

                            // Limiting the amount of subject displayed
                            if (subjectLength < 10) {
                                resultSubjects = new Array(subjectLength);
                            } else {
                                resultSubjects = new Array(10);
                                subjectLength = 10; // 10 elements + 1 = 11 but -1 because we start at 0
                            }


                            resultSubjects[0] = document.createElement("a");
                            resultSubjects[0].innerHTML = "<span class='blackBold'>Subjects : </span>";
                            resultElementSubjects[loadedBookNumber].appendChild(resultSubjects[0]);

                            for (let z = 0; z < subjectLength; z++) {

                                resultSubjects[z + 1] = document.createElement("a");
                                resultSubjects[z + 1].classList.add("result-element-subjects");
                                resultSubjects[z + 1].innerHTML = listBooks.hits.hits[i].fields.meta_subjectSorter[z];
                                resultElementSubjects[loadedBookNumber].appendChild(resultSubjects[z + 1]);

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
                                    }
                                    ;
                                }

                                resultElementHighlights[loadedBookNumber].innerHTML += "&laquo; " + currentHighlights
                                    + " &raquo;<br><br>";
                            }
                            loadedBookNumber++;

                        }
                    }
                }
            });
    }
    return false;
}


function getBooksByTitle() {

    if (searchbar.value === "") {
        alert("Error : you don't specify any term to search. Please retry !");
    } else {

        resetData();

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

                        if (listBooks.docs[i].cover_i) {

                            resultElements.push(document.createElement("div"));
                            resultElements[loadedBookNumber].classList.add("result-element");
                            resultGrid.appendChild(resultElements[loadedBookNumber]);


                            resultImageContainer.push(document.createElement("a"));
                            resultImageContainer[loadedBookNumber].classList.add("result-element-image-container");
                            bookLink = "https://openlibrary.org/" + listBooks.docs[i].key;
                            resultImageContainer[loadedBookNumber].href = bookLink;
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


                            coverLink[loadedBookNumber] = "http://covers.openlibrary.org/b/id/" + listBooks.docs[i].cover_i + "-L.jpg";

                            // Setting the values :

                            resultImage[loadedBookNumber].src = coverLink[loadedBookNumber];
                            resultElementTitle[loadedBookNumber].innerHTML = listBooks.docs[i].title;


                            resultElementAuthor[loadedBookNumber].innerHTML = "<span class='blackBold'>Author : </span>"

                            if (Array.isArray(listBooks.docs[i].author_name)) {
                                for (let j = 0; j < listBooks.docs[i].author_name.length; j++) {
                                    resultElementAuthor[loadedBookNumber].innerHTML += listBooks.docs[i].author_name[j];
                                }
                            } else if (typeof listBooks.docs[i].author_name === 'undefined') {
                                resultElementAuthor[loadedBookNumber].innerHTML += "Not defined";
                            } else {
                                resultElementAuthor[loadedBookNumber].innerHTML += listBooks.docs[i].author_name;
                            }


                            resultElementPublishers[loadedBookNumber].innerHTML = "<span class='blackBold'>Publishers : </span>"

                            if (Array.isArray(listBooks.docs[i].publisher)) {
                                for (let h = 0; h < listBooks.docs[i].publisher.length; h++) {
                                    resultElementPublishers[loadedBookNumber].innerHTML += listBooks.docs[i].publisher[h];
                                }
                            } else if (typeof listBooks.docs[i].publisher === 'undefined') {
                                resultElementPublishers[loadedBookNumber].innerHTML += "Not defined";
                            } else {
                                resultElementPublishers[loadedBookNumber].innerHTML = listBooks.docs[i].publisher;
                            }

                            loadedBookNumber++;
                        } else {
                            displayResult++;
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
