import Notiflix from 'notiflix';
import axios from 'axios';

// Отримання посилань на форму, галерею та кнопку "Load More" зі сторінки
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// Додавання обробника події submit до форми
form.addEventListener('submit', handleSubmit);

// Додавання обробника події click до кнопки "Load More"
loadMoreBtn.addEventListener('click', loadMoreImages);

// Ініціалізація змінних для пошуку
let searchQuery = '';
let page = 1;
const perPage = 40;

// Функція, яка виконується при поданні форми
function handleSubmit(event) {
  event.preventDefault();

  // Отримання значення пошукового запиту з форми
  searchQuery = form.searchQuery.value.trim();

  // Перевірка, чи пошуковий запит не є порожнім рядком
  if (searchQuery === '') return;

  // Очищення галереї перед пошуком
  clearGallery();

  // Запуск функції пошуку
  performSearch();
}

// Функція очищення галереї
function clearGallery() {
  // Очищення HTML-коду галереї
  gallery.innerHTML = '';

  // Скидання значення сторінки на початкове
  page = 1;

  // Приховування кнопки "Load More"
  loadMoreBtn.style.display = 'none';
}

// Асинхронна функція пошуку
async function performSearch() {
    
  // Ключ API для доступу до Pixabay
  const APIKEY = '37657355-9235c327b453c7d81674f7b17';

  // Формування URL для HTTP-запиту до Pixabay API з використанням пошукового запиту, сторінки та кількості на сторінку
  const apiUrl = `https://pixabay.com/api/?key=${APIKEY}&q=${encodeURIComponent(
    searchQuery
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    // Виконання GET-запиту до Pixabay API за допомогою axios
    const response = await axios.get(apiUrl);
    const data = response.data;

    // Перевірка, чи є результати пошуку
    if (data.hits.length === 0) {
      // Показ повідомлення про відсутність результатів
      showNoResultsMessage();
    } else {
      // Відображення зображень у галереї
      displayImages(data.hits);

      // Перевірка, чи досягнуто кінець результатів
      if (data.totalHits <= page * perPage) {
        // Показ повідомлення про кінець результатів
        showEndOfResultsMessage();
      } else {
        // Показ кнопки "Load More"
        showLoadMoreButton();
      }
    }
  } catch (error) {
    // Обробка помилок, якщо виникає проблема з HTTP-запитом
    console.log('Error:', error);
  }
}

// Ф-я відображення зображень у галереї
function displayImages(images) {
  // Генерація HTML-коду для кожного зображення
  const cardsHTML = images.map(image => createImageCard(image)).join('');

  // Додавання HTML-коду до галереї
  gallery.insertAdjacentHTML('beforeend', cardsHTML);
}

// Ф-я  створення HTML-коду для окремого зображення
function createImageCard(image) {
  return `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>
  `;
}

// Ф-я показу повідомлення про відсутність результатів
function showNoResultsMessage() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

// Ф-я  показу повідомлення про кінець результатів
function showEndOfResultsMessage() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}

// Ф-я  показу кнопки "Load More"
function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

// Ф-я завантаження додаткових зображень
function loadMoreImages() {
  // Збільшення значення сторінки
  page++;

  // Запуск функції пошуку
  performSearch();
}