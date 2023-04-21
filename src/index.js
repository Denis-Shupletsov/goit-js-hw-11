import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPictures, page, query } from './js/pixabay';
import { createMarkup } from './js/markup';


const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadEl = document.querySelector('.js-load-btn');
const lightbox = new SimpleLightbox('.gallery a');

formEl.addEventListener('submit', onSubmit);
loadEl.addEventListener('click', onLoadClick);

async function onSubmit(event) {
    event.preventDefault();
    const searchQuery = event.currentTarget.elements.searchQuery.value
        .trim()
        .toLowerCase();
    if (!searchQuery) {
        Notiflix.Notify.failure('Enter a search query!');
        return;
    }
    try {
        const searchData = await getPictures(searchQuery);
        const { hits, totalHits } = searchData;
        if (hits.length === 0) {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
        }
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images!`);
        const markup = hits.map(item => createMarkup(item)).join('');
        galleryEl.innerHTML = markup;
        if (totalHits > 40) {
            loadEl.classList.remove('js-load-btn');
            page += 1;
        }
        lightbox.refresh();
    } catch (error) {
        Notiflix.Notify.failure('Something went wrong! Please retry');
        console.log(error);
    }
}

async function onLoadClick() {
    const response = await getPictures(query);
    const { hits, totalHits } = response;
    const markup = hits.map(item => createMarkup(item)).join('');
    galleryEl.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    const amountOfPages = totalHits / 40 - page;
    if (amountOfPages < 1) {
        loadEl.classList.add('js-load-btn');
        Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
        );
    }
}