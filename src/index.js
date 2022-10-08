import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const refs = {
    input: document.querySelector('#search-box'),
    country_list: document.querySelector('.country-list'),
    country_info: document.querySelector('.country-info')
};

const DEBOUNCE_DELAY = 300;

const result = () => {
    console.log(refs.input.value);

    const inputedText = refs.input.value.trim();
    cleanHtml();
    if(inputedText !== '') {
        fetchCountries(inputedText).then(data => {
            if (data.length > 10) {
                Notiflix.Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
            } else if (data.length === 0) {
                Notiflix.Notify.failure('Oops, there is no country with that name');
            } else if (data.length >= 2 && data.length <= 10) {
                createMarkupCountryList(data);
            } else if (data.length === 1) {
                createMarkupOneCountry(data);
            } 
        })
    }
};    

refs.input.addEventListener('input', debounce(result, DEBOUNCE_DELAY));

function createMarkupCountryList(countries) {
    const markup = countries
    .map(country => {
        return `<li class='item'>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
            <b>${country.name.official}</b>
        </li>`;
    })
    .join('');
    refs.country_list.innerHTML = markup;
}

function createMarkupOneCountry(countries) {
    const markup = countries
    .map(country => {
        return `<li>
            <img src="${country.flags.svg}" alt="Flag of ${
            country.name.official}" width="30" hight="20">
            <b>${country.name.official}</b></p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>
        </li>`;
    })
    .join('');
    refs.country_list.innerHTML = markup;
};

function cleanHtml() {
    refs.country_list.innerHTML = '';
    refs.country_info.innerHTML = '';
};

