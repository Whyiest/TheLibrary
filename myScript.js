function getBooks() {

    document.getElementById('result-test').innerHTML = "";

    let response = fetch("http://openlibrary.org/search.json?q=" + document.getElementById("search-bar").value +
        {method : "GET", headers: {"Content-type" : "application/json; charset=UTF-8"}
    })
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(err => console.log("err"));
    return false;
}
