document.addEventListener("DOMContentLoaded", () => {
  let addToy = false;
  let toys = [];

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
      addToy = !addToy;
      toggleToyForm();
  });

  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener('submit', event => {
      event.preventDefault();
      
      const formData = new FormData(toyForm);
      const name = formData.get('name');
      const image = formData.get('image');
      
      createToy(name, image);
      addToy = false;
      toggleToyForm();
  });

  document.addEventListener('click', event => {
      if (event.target.classList.contains('like-btn')) {
          const toyId = event.target.id;
          const toy = toys.find(toy => toy.id == toyId);
          if (toy) {
              toy.likes++;
              updateLikes(toyId, toy.likes);
          }
      }
  });

  function toggleToyForm() {
      toyFormContainer.style.display = addToy ? "block" : "none";
  }

  function fetchToys() {
      fetch('http://localhost:3000/toys')
          .then(response => response.json())
          .then(data => {
              toys = data; 
              renderToyCollection();
          });
  }

  function createToy(name, image) {
      fetch('http://localhost:3000/toys', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
              name: name,
              image: image,
              likes: 0
          })
      })
      .then(response => response.json())
      .then(newToy => {
          toys.push(newToy); 
          renderToyCollection();
      });
  }

  function updateLikes(toyId, newLikes) {
      fetch(`http://localhost:3000/toys/${toyId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
              likes: newLikes
          })
      })
      .then(response => response.json())
      .then(updatedToy => {
          const toyIndex = toys.findIndex(toy => toy.id == toyId);
          if (toyIndex !== -1) {
              toys[toyIndex] = updatedToy; 
              renderToyCollection();
          }
      });
  }

  function renderToyCollection() {
      const toyCollection = document.getElementById('toy-collection');
      toyCollection.innerHTML = ''; 
      toys.forEach(toy => {
          const card = document.createElement('div');
          card.className = 'card';
  
          card.innerHTML = `
              <h2>${toy.name}</h2>
              <img src="${toy.image}" class="toy-avatar" />
              <p>${toy.likes} Likes</p>
              <button class="like-btn" id="${toy.id}">Like ❤️</button>
          `;
  
          toyCollection.appendChild(card);
      });
  }

  fetchToys();
});

