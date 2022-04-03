const BOOK_ID = "id";

const addForms = document.querySelectorAll('.add-form');
const plusButtons = document.querySelectorAll('.bx-plus-circle');
const cancelAddButtons = document.querySelectorAll('.cancel-add-button');
const searchForm = document.querySelector('.search-form');
const logo = document.querySelector('.logo');

window.addEventListener('load', () => {
    displayBook();
});

for(const plusButton of plusButtons) {
    plusButton.addEventListener('click', (e) => {
        plusButton.style.display = 'none';
        e.target.nextElementSibling.style.display = 'flex';
        e.target.parentElement.lastElementChild.style.display = 'inherit';
    });
}

for(const cancelAddButton of cancelAddButtons) {
    cancelAddButton.addEventListener('click', (e) => {
        e.target.parentElement.firstElementChild.style.display = 'flex';
        e.target.previousElementSibling.style.display = 'none';
        cancelAddButton.style.display = 'none';
    });
}

for(const formAddBook of addForms) {
    formAddBook.addEventListener('submit', (e) => {
        e.preventDefault();
        createBook(e);
        flashMessage('add');
    });
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchBook(e);
});

logo.addEventListener('click', () => {
    const items = document.querySelectorAll('.buku');
    for(const item of items) {
        item.remove();
    }
    displayBook();
});

function displayBook() {
    getData();
    for(const book of books) {
        const bookItem = createShelfItem(book.title, book.author, book.year, book.isComplete);
        bookItem[BOOK_ID] = book.id;
        let shelf;
        if(book.isComplete) {
            shelf = document.getElementById('rakSelesaiBaca');
        } else {
            shelf = document.getElementById('rakBelumSelesaiBaca');
        }
        shelf.insertBefore(bookItem, shelf.firstChild);
    }
}

function createBook(e) {
    const title = e.target[0].value;
    const author = e.target[1].value;
    const year = e.target[2].value;
    let isComplete;
    if(e.target.parentElement.parentElement.parentElement.id == 'rakBelumSelesaiBaca') {
        isComplete = false;
    } else {
        isComplete = true;
    }
    const book = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
    }
    const bookItem = createShelfItem(title, author, year, isComplete);
    bookItem[BOOK_ID] = book.id;
        
    books.push(book);

    let shelf;
    if(isComplete) {
        shelf = document.getElementById('rakSelesaiBaca');
    } else {
        shelf = document.getElementById('rakBelumSelesaiBaca');
    }
    shelf.insertBefore(bookItem, shelf.firstChild);
    setData();

    e.target[0].value = '';
    e.target[1].value = '';
    e.target[2].value = '';
    e.target.nextElementSibling.click();
}

function createShelfItem(title, author, year, isComplete, shelfMove) {
    const titleElement = document.createElement("h3");
    titleElement.innerText = title;

    let authorElement;
    let yearElement;
    if(shelfMove) {
        authorElement = document.createElement("p");
        authorElement.innerText = author;

        yearElement = document.createElement("p");
        yearElement.innerText = year;
    } else {
        authorElement = document.createElement("p");
        authorElement.innerText = "Penulis : " + author;

        yearElement = document.createElement("p");
        yearElement.innerText = "Tahun : " + year;
    }
    
    const bookContainer = document.createElement("div");
    bookContainer.classList.add("buku-container");
    bookContainer.append(titleElement, authorElement, yearElement, createButton(isComplete));

    const container = document.createElement("article");
    container.classList.add("buku", "item");
    
    const editForm = createEditForm(container);
    editForm.style.display = 'none';
    container.append(bookContainer, editForm);

    return container;
}

function createButton(isComplete) {
    const button1 = document.createElement("button");
    if(isComplete) {
        button1.classList.add("belum-selesai-button");
        button1.innerText = "Belum Selesai Dibaca";
    } else {
        button1.classList.add("selesai-button");
        button1.innerText = "Selesai Dibaca";
    }

    const button2 = document.createElement("button");
    button2.classList.add("edit-button");
    button2.innerText = "Edit";

    const button3 = document.createElement("button");
    button3.classList.add("delete-button");
    button3.innerText = "Hapus Buku";

    button1.addEventListener('click', (e) => {
        const element = e.target.parentElement.parentElement.parentElement;
        shelfMove(isComplete, element);
    });
    button2.addEventListener('click', (e) => {
        const element = e.target.parentElement.parentElement.parentElement;
        displayEditForm(element);
    });
    button3.addEventListener('click', (e) => {
        const element = e.target.parentElement.parentElement.parentElement;
        flashMessage('delete', element);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("rak-buttons");
    buttonContainer.append(button1, button2, button3);

    return buttonContainer;
}

function createEditForm(element) {
    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text'); 
    titleInput.setAttribute('placeholder', 'masukkan judul buku'); 
    titleInput.setAttribute('required', '');
    
    const authorInput = document.createElement('input');
    authorInput.setAttribute('type', 'text'); 
    authorInput.setAttribute('placeholder', 'masukkan penulis'); 
    authorInput.setAttribute('required', ''); 

    const yearInput = document.createElement('input');
    yearInput.setAttribute('type', 'number'); 
    yearInput.setAttribute('placeholder', 'masukkan tahun'); 
    yearInput.setAttribute('required', '');
    
    const submitButton = document.createElement('button');
    submitButton.innerHTML = 'Simpan';

    const formElement = document.createElement('form');
    formElement.classList.add('add-form');
    formElement.append(titleInput, authorInput, yearInput, submitButton);

    const cancelEditButton = document.createElement('button');
    cancelEditButton.classList.add('cancel-button','cancel-edit-button');
    cancelEditButton.innerText = 'Batal';

    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');

    formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        editBook(element, e);
        flashMessage('edit');
    });
    
    formContainer.append(formElement, cancelEditButton);
    return formContainer;
}

function displayEditForm(element) {
    const bookContainer = element.children[0];
    const editForm = element.children[1].children[0];
    const cancelEditButton = element.children[1].children[1];
    const editContainer = element.children[1];

    bookContainer.style.display = 'none';
    editForm.style.display = 'flex';
    cancelEditButton.style.display = 'inherit';
    editContainer.style.display = 'inherit';

    const book = searchData(element[BOOK_ID]);
    editForm.children[0].value = book.title;
    editForm.children[1].value = book.author;
    editForm.children[2].value = book.year;

    cancelEditButton.addEventListener('click', () => {
        bookContainer.style.display = 'inherit';
        editForm.style.display = 'none';
        cancelEditButton.style.display = 'none';
    });
}

function editBook(element, e) {
    const newTitle = e.target[0].value; 
    const newAuthor = e.target[1].value; 
    const newYear = e.target[2].value;
    
    const book = searchData(element[BOOK_ID]);
    book.title = newTitle;
    book.author = newAuthor;
    book.year = newYear;

    const bookContainer = element.children[0];
    const editForm = element.children[1].children[0];
    const cancelEditButton = element.children[1].children[1];
    const editContainer = element.children[1];
    
    bookContainer.children[0].innerText = newTitle;
    bookContainer.children[1].innerText = "Penulis : " + newAuthor;
    bookContainer.children[2].innerText = "Tahun : " + newYear;

    bookContainer.style.display = 'inherit';
    editForm.style.display = 'none';
    cancelEditButton.style.display = 'none';
    editContainer.style.display = 'none';

    setData();
}

function shelfMove(isComplete, element) {
    element.remove();
    const title = element.children[0].children[0].innerText;
    const author = element.children[0].children[1].innerText;
    const year = element.children[0].children[2].innerText;
    const shelfMove = true;
    const book = searchData(element[BOOK_ID]);
    const bookItem = createShelfItem(title, author, year, !isComplete, shelfMove);
    bookItem[BOOK_ID] = book.id;
    book.isComplete = !isComplete;

    let shelf;
    if(!isComplete) {
        shelf = document.getElementById('rakSelesaiBaca');
    } else {
        shelf = document.getElementById('rakBelumSelesaiBaca');
    }
    shelf.insertBefore(bookItem, shelf.firstChild);
    setData();
}

function searchBook(e) {
    const key = e.target.firstElementChild.value;
    const items = document.querySelectorAll('.buku');
    for(const item of items) {
        item.remove();
    }
    if(e.target.parentElement.children[1] != undefined) {
        e.target.parentElement.children[1].remove();
    }

    for(const book of books) {
        const searchKey = key.toLowerCase();
        const title = book.title.toLowerCase();
        const author = book.author.toLowerCase();

        if(title.includes(searchKey) || author.includes(searchKey)) {
            const bookItem = createShelfItem(book.title, book.author, book.year, book.isComplete);
            bookItem[BOOK_ID] = book.id;
            let shelf;
            if(book.isComplete) {
                shelf = document.getElementById('rakSelesaiBaca');
            } else {
                shelf = document.getElementById('rakBelumSelesaiBaca');
            }
            shelf.insertBefore(bookItem, shelf.firstChild);
        } else if(searchKey == '') {
            displayBook();
        } 
    }

    if(document.querySelectorAll('.buku').length == 0) {
        const message = document.createElement('h4');
        message.innerText = 'Buku dengan kata kunci ' + key + ' tidak ditemukan..';
        e.target.parentElement.append(message);
    }
}

function deleteBook(element) {
    if(searchData(element[BOOK_ID]) !== -1) {
        element.remove();  
        const index = books.indexOf(searchData(element[BOOK_ID]));
        books.splice(index, 1);
        setData();
    }
}

function flashMessage(type, element) {
    const message = document.querySelector('#flashMessage h5');
    const closeButton = document.querySelector('#flashMessage i');

    if(type == 'add') {
        message.innerText = 'Buku berhasil ditambahkan';
        message.parentElement.style.backgroundColor = '#5cb85c';
        document.querySelector('.flash-button').style.display = 'none';
        
        closeButton.addEventListener('click', (e) => {
            e.target.parentElement.classList.remove('pop-up');
        });

        message.parentElement.classList.add('pop-up');
        setTimeout(function() {
            message.parentElement.classList.remove('pop-up');
        }, 5000);
    } else if(type == 'edit') {
        message.innerText = 'Data buku berhasil disimpan';
        message.parentElement.style.backgroundColor = '#5cb85c';
        document.querySelector('.flash-button').style.display = 'none';

        closeButton.addEventListener('click', (e) => {
            e.target.parentElement.classList.remove('pop-up');
        });

        message.parentElement.classList.add('pop-up');
        setTimeout(function() {
            message.parentElement.classList.remove('pop-up');
        }, 5000);
    } else if(type == 'delete') {
        message.innerText = 'Apakah Anda yakin ingin menghapus buku ini?';
        message.parentElement.style.backgroundColor = '#d9534f';
        document.querySelector('.flash-button').style.display = 'inherit';

        closeButton.addEventListener('click', (e) => {
            e.target.parentElement.classList.remove('delete-notification');
        });
        
        message.parentElement.classList.add('delete-notification');

        document.querySelector('.yes-button').addEventListener('click', ()=> {
            message.parentElement.classList.remove('delete-notification');
            deleteBook(element);
        });
        document.querySelector('.no-button').addEventListener('click', ()=> {
            message.parentElement.classList.remove('delete-notification');
        });
    }
}