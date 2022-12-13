import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { onRequest, onFetch } from './api';
import throttle from 'lodash.throttle';

export let userText = '';
export let page = 1;
export let data = [];

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: '250',
});

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.input-search'),
};

refs.form.addEventListener('submit', onSubmit);

export function onSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';

  userText = e.target.elements.searchQuery.value;

  page = 1;
  data = [];
  onRequest(data);
}

export function onRenderCards(data) {
  const markup = data.map(onCards).join('');
  refs.gallery.innerHTML = '';
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  onScroll();
}

export function onCards({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card"><div class="photo-link-owerflow">
  <a class="image-link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a></div>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
}
export function onScroll() {
  if (page !== 1) {
    let { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
window.addEventListener('scroll', throttle(onEndlessScroll, 500));

function onEndlessScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 100) {
    page += 1;
    onFetch().then(respdata => {
      respdata.hits.map(item => data.push(item));
      onRenderCards(data);
      // lightbox.refresh();
    });
  }
}
