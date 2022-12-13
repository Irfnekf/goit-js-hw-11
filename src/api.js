import axios from 'axios';
import Notiflix from 'notiflix';
import { userText, page, data, onRenderCards } from './index';

const URL = 'https://pixabay.com/api/';
const KEY = '31999537-8b000b200011d9a4da5a9d3c4';

const getDefaultPage = 40;

export async function onFetch() {
  const response = await axios.get(
    `${URL}?key=${KEY}&q=${userText}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${getDefaultPage}`
  );

  // console.log(response);
  return await response.data;
}

export async function onRequest() {
  onFetch().then(res => {
    if (res.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
    }
    res.hits.map(item => data.push(item));

    onRenderCards(data);
  });
}
