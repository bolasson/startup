//Javascript for accessing the database.
setInterval(() => {
    const score = Math.floor(Math.random() * 300);
    document.querySelector('.notifications').textContent = `John Cena just created a post! Post ID: ${score}`;
}, 5000);

function storeNewPostData() {
    const postTitle = document.getElementById("new-post-title").value;
    const postContent = document.getElementById("new-post-content").value;
    const postTags = document.getElementById("new-post-tags").value;
    const postAuthor = document.getElementById("new-post-author").value;
    const postData = {
        title: postTitle,
        content: postContent,
        tags: postTags,
        author: postAuthor
    };
    localStorage.setItem("newPostData", JSON.stringify(postData));
    createNewPostFromLocalStorage();
}

function createNewPostFromLocalStorage() {
    const storedData = localStorage.getItem("newPostData");
    if (storedData) {
        const postData = JSON.parse(storedData);
        const newPost = document.createElement("section");
        newPost.className = "post";
        newPost.innerHTML = `
            <div class="post-header">
                <h3>Title: ${postData.title}</h3>
            </div>
            <hr>
            <p>Gameplay: ${postData.content}</p>
            <hr>
            <div class="post-info">
                <p>Tags: ${postData.tags}</p>
                <p>Author: ${postData.author}</p>
            </div>
        `;
        const postContainer = document.getElementById("post-container");
        postContainer.appendChild(newPost);
        alert(`Post created successfully, with data\nTitle: ${postData.title}\nGameplay: ${postData.content}\nTags: ${postData.tags}\nAuthor: ${postData.author}`);
    } else {
        alert("No post data found in localStorage. Please create a post first.");
    }
}