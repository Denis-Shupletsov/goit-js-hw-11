import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '35624060-9e01954426111bf91c4065ddd';
const params = `?key=${KEY}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

export let page = 1;
export let query = null;

export async function getPictures(searchQuery) {
    if (searchQuery !== query) {
        page = 1;
        query = searchQuery;
    }
    try {
        const response = await axios.get(
            `${BASE_URL}${params}&q=${query}&page=${page}`
        );
        page += 1;
        return response.data;
    } catch (error) {
        Notiflix.Notify.failure('Something went wrong! Please retry');
        console.log(error);
    }
}