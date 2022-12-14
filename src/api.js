import axios from 'axios';
import Notiflix from 'notiflix';
import {
  userText,
  page,
  data,
  onRenderCards,
  onLoadMore,
  onButtonHidden,
  onButtonView,
} from './index';

const URL = 'https://pixabay.com/api/';
const KEY = '31999537-8b000b200011d9a4da5a9d3c4';

export const getDefaultPage = 40;

export async function onFetch() {
  try {
    const response = await axios.get(
      `${URL}?key=${KEY}&q=${userText}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${getDefaultPage}`
    );

    // console.log(response);
    return await response.data;
  } catch (error) {
    console.log('ERROR: ' + error);
  }
}

export async function onRequest() {
  onFetch().then(res => {
    if (res.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      onButtonHidden();
    } else {
      Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
      onButtonView();
    }
    res.hits.map(item => data.push(item));

    onRenderCards(data);
    onLoadMore(res);
  });
}
