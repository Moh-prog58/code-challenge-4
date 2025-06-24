document.addEventListener('DOMContentLoaded', main);

const BASE_URL = "http://localhost:3000/posts";
let currentPostId = null;

function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
}

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;
        div.dataset.id = post.id;
        div.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(div);
      });
    });
}

function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      currentPostId = post.id;
      const detail = document.getElementById('post-detail');
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>By:</strong> ${post.author}</p>
        <p>${post.content}</p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      document.getElementById('edit-btn').addEventListener('click', () => {
        document.getElementById('edit-post-form').classList.remove('hidden');
        document.getElementById('edit-title').value = post.title;
        document.getElementById('edit-content').value = post.content;
      });

      document.getElementById('delete-btn').addEventListener('click', () => {
        fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
          .then(() => {
            displayPosts();
            document.getElementById('post-detail').innerHTML = '<p>Post deleted</p>';
          });
      });
    });
}

function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('new-title').value;
    const content = document.getElementById('new-content').value;
    const author = document.getElementById('new-author').value;

    const postObj = { title, content, author };

    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postObj)
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        form.reset();
      });
  });
}

function addEditPostListener() {
  const editForm = document.getElementById('edit-post-form');
  const cancelBtn = document.getElementById('cancel-edit');

  editForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('edit-title').value;
    const content = document.getElementById('edit-content').value;

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    })
      .then(res => res.json())
      .then(() => {
        displayPosts();
        handlePostClick(currentPostId);
        editForm.classList.add('hidden');
      });
  });

  cancelBtn.addEventListener('click', () => {
    editForm.classList.add('hidden');
  });
}
