let allPosts = [];
let allUsersData = [];

function carregarDados() {
    fetch("https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/posts.json")
        .then(response => response.json())
        .then(postsData => {
            fetch("https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/users.json")
                .then(response => response.json())
                .then(usersData => {
                    displayPostsDetails(postsData, usersData);
                    allUsersData = usersData;
                })
                .catch(error => console.error("Erro ao carregar users.json:", error));
        })
        .catch(error => console.error("Erro ao carregar posts.json:", error));
}

function findUserNameById(userId, usersData) {
    const user = usersData.find(user => user.id === userId);
    return user ? user.name : "Usuário não encontrado";
}

function findUserProfilePicById(userId, usersData) {
    const user = usersData.find(user => user.id === userId);
    return user ? user.picture : "default.jpg";
}

function displayPostsDetails(postsData, usersData) {
    allPosts = postsData;
    const postList = document.getElementById("postList");

    postsData.reverse();

    postsData.forEach(post => {
        const formattedDate = new Date(post.createdAt).toLocaleString("pt", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        const postElement = document.createElement("li");
        postElement.classList.add("post");
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Data de criação:</strong> ${formattedDate}</p>
            <p>${post.body}</p>
            <p><strong>Likes:</strong> ${post.likes.length}</p>
            <p><strong>Número de comentários:</strong> ${post.comments.length}</p>
            <p><strong>Comentários:</strong></p>
            <ul style="list-style: none; padding-left: 0;">
                ${post.comments.map(comment => `
                    <li style="display: flex; align-items: center; margin-bottom: 10px;">
                        <img src="${findUserProfilePicById(comment.userId, usersData)}" alt="Foto de perfil" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                        <span>${findUserNameById(comment.userId, usersData)}: ${comment.body}</span>
                    </li>`).join("")}
            </ul>
            <hr>
        `;

        // Definindo largura fixa para manter consistência
        postElement.style.width = "100%";

        postList?.insertBefore(postElement, postList.firstChild);
    });
}

function criarBarraPesquisa() {
    const postCount = document.createElement("div");
    postCount.setAttribute("id", "postCount");
}

function searchPosts() {
    const input = document.getElementById("searchInput");
    const searchText = input.value.trim().toLowerCase();

    fetch("https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/posts.json")
        .then(response => response.json())
        .then(postsData => {
            const filteredPosts = allPosts.filter(post =>
                post.title.toLowerCase().includes(searchText)
            );

            const sortedPosts = filteredPosts.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            const postCount = document.getElementById("postCount");
            if (postCount) {
                postCount.innerHTML = `${sortedPosts.length} posts encontrados`;
            }

            const postList = document.getElementById("postList");
            if (postList) {
                postList.innerHTML = "";

                sortedPosts.forEach(post => {
                    const formattedDate = new Date(post.createdAt).toLocaleString("pt", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    const postElement = document.createElement("li");
                    postElement.innerHTML = `
                        <h2>${post.title}</h2>
                        <p><strong>Data de criação:</strong> ${formattedDate}</p>
                        <p>${post.body}</p>
                        <p><strong>Likes:</strong> ${post.likes.length}</p>
                        <p><strong>Número de comentários:</strong> ${post.comments.length}</p>
                        <p><strong>Comentários:</strong></p>
                        <ul style="list-style: none; padding-left: 0;">
                            ${post.comments.map(comment => `
                                <li style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <img src="${findUserProfilePicById(comment.userId, allUsersData)}" alt="Foto de perfil" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                    <span>${findUserNameById(comment.userId, allUsersData)}: ${comment.body}</span>
                                </li>`).join("")}
                        </ul>
                        <hr>
                    `;
                    postList.appendChild(postElement);
                });

                if (sortedPosts.length === 0) {
                    const noResultsElement = document.createElement("li");
                    noResultsElement.textContent = "Nenhum resultado encontrado.";
                    postList.appendChild(noResultsElement);
                }
            }
        })
        .catch(error => console.error("Erro ao carregar posts.json:", error));
}

function criarPost() {
    const postTitle = document.getElementById("postTitle").value;
    const postContent = document.getElementById("postContent").value;

    const newPost = {
        title: postTitle,
        body: postContent,
        userId: 101,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
    };

    displayNewPost(newPost);
}

function displayNewPost(post) {
    allPosts.unshift(post);
    const postList = document.getElementById("postList");

    const formattedDate = new Date(post.createdAt).toLocaleString("pt", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const postElement = document.createElement("li");
    postElement.classList.add("post");
    postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p><strong>Data de criação:</strong> ${formattedDate}</p>
        <p>${post.body}</p>
        <p><strong>Likes:</strong> ${post.likes.length}</p>
        <p><strong>Número de comentários:</strong> ${post.comments.length}</p>
        <hr>
    `;
    postList?.prepend(postElement);
}

document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    criarBarraPesquisa();
});
