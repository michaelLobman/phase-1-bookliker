document.addEventListener("DOMContentLoaded", fetchBooks);
const myProfile = {
    id: 99,
    username: "mlobman"
};


function fetchBooks(){
    fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(books => {
        const bookList = document.getElementById('list');
        const showPanel = document.getElementById('show-panel');
        for(const book of books) {
            const bookTitle = book["title"];
            const bookThumbnail = book["img_url"];
            const bookDescription = book["description"];
            const bookEntry = document.createElement('li');
            const bookUsers = book["users"];
            const bookId = book["id"]
            bookEntry.textContent = bookTitle;
            bookList.append(bookEntry);
            bookEntry.addEventListener('click', function updatePanel() {
                showPanel.innerHTML = `
                <img src=${bookThumbnail}</img>
                <h3>${bookTitle}</h3>
                <p>${bookDescription}/<p>
                <ul id="user-list">
                </ul>
                <button id="like-button">LIKE</button>
                ` 
                for(const user of bookUsers){
                    const userEntry = document.createElement('li');
                    userEntry.textContent = user["username"];
                    document.getElementById('user-list').append(userEntry)
                }    
                const likeButton = document.getElementById('like-button');
                likeButton.addEventListener('click', function(){
                    if (bookUsers.find(element => element === myProfile)) {
                        bookUsers.pop();
                        fetch(`http://localhost:3000/books/${bookId}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                            body: JSON.stringify({
                                "users": bookUsers,
                            })
                        })
                    } else {
                        bookUsers.push(myProfile);
                        fetch(`http://localhost:3000/books/${bookId}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                            body: JSON.stringify({
                                "users": bookUsers,
                            })
                        })
                    }
                    updatePanel();
                })    
            })

        }
    })
}

