let books = [];
const BOOKSHELF_KEY = "BOOKSHELF_APPS";

function checkStorage() {
    if(typeof(Storage) === undefined) {
        alert("Browser Anda tidak mendukung storage");
        return false;
    }
    return true;
}

function setData() {
    if(checkStorage()) {
        localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(books));
    }    
}

function getData() {
    let data = JSON.parse(localStorage.getItem(BOOKSHELF_KEY)) || [];
    books = data;
}

function searchData(id) {
    for(const book of books) {
        if(book.id == id) return book;
    }
    return -1;
}


