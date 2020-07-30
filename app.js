$(() => {

const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const loader = document.getElementById('loader');
let counter = 0;

const showLoadingSpinner = () => {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

const removeshowLoadingSpinner = () => {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}


const getApiData = async(url = "", data = {}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    try {
        const newData = await response.json();
        counter++;
        //throw new Error ("ooops");
        return newData;
    } catch (error) {
        if(counter <= 10) {
            getQuote();
        } else {
            console.log("Too many calls");
        }
        
        //console.log("error", error);
    }
}

const getQuote = async() => {
    showLoadingSpinner();
    const proxyUrl = 'https://salty-hollows-61024.herokuapp.com/';
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const data = await getApiData(proxyUrl + apiUrl);
        updateUI(data);
        removeshowLoadingSpinner();
    } catch (error) {
        console.log("error", error);
    }
}

$("#new-quote").off("click").on("click", getQuote);

const updateUI = async data => {
    if(data.quoteAuthor === '' || data.quoteAuthor === 'undefined') {
        authorText.innerText = 'Unknown Author';
    } else {
        authorText.innerText = data.quoteAuthor;
    }
    if(data.quoteText.length > 120) {
        quoteText.classList.add('long-quote');
    } else {
        quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = data.quoteText;
}

const tweetQuote = () => {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    twitterUrl.rel = 'noopener';
    window.open(twitterUrl, '_blank');
}

$("#twitter").off("click").on("click", tweetQuote);

getQuote();

});