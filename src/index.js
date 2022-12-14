import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { onRequest, onFetch, getDefaultPage, onRequest } from './api';
import { onCards } from './js/markup';
import throttle from 'lodash.throttle';
import Notiflix from 'notiflix';

export let userText = '';
export let page = 1;
export let data = [];

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: '250',
});

export const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.input-search'),
  button: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.button.addEventListener('click', onLoadMore);

export function onSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  onButtonView();
  if (e.target.elements.searchQuery.value.trim() === '') {
    onButtonHidden();
    return;
  }
  userText = e.target.elements.searchQuery.value.trim();
  page = 1;
  data = [];
  onRequest(data);

  onButtonHidden();
}

export function onRenderCards(data) {
  const markup = data.map(onCards).join('');
  refs.gallery.innerHTML = '';
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  onScroll();
  lightbox.refresh();
}

export function onLoadMore(respdata) {
  page += 1;
  if (Number(page * getDefaultPage) > Number(respdata.totalHits)) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    onButtonHidden();
  }

  onFetch().then(respdata => {
    respdata.hits.map(item => data.push(item));
    onRenderCards(data);
  });
}
function onScroll() {
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
// function onScroll(obj) {
//   const { height: cardHeight } = document
//     .querySelector(obj)
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
export function onButtonHidden() {
  refs.button.classList.add('visually-hidden');
}
export function onButtonView() {
  refs.button.classList.remove('visually-hidden');
}

// window.addEventListener('scroll', throttle(onEndlessScroll, 500));

// function onEndlessScroll() {
//   const documentRect = document.documentElement.getBoundingClientRect();
//   if (documentRect.bottom < document.documentElement.clientHeight + 100) {
//     page += 1;
//     onFetch().then(respdata => {
//       respdata.hits.map(item => data.push(item));
//       onRenderCards(data);
//     });
//   }
// }
