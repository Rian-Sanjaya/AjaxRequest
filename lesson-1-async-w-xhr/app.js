(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const unsplashRequest = new XMLHttpRequest();
        
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.onerror = function(err) { requestError(err, 'image'); };
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID c6bd44b18cfecf778465ed96c60f530519bd98fa0eb15d5eb853aa0b7cd1e9c0');
        unsplashRequest.send();

        function addImage() {
            // debugger;
            let htmlContent = '';
            const data = JSON.parse(this.responseText);
            const firstImage = data.results[0];
            // console.log(data.results[0]);
            if (data && data.results && data.results[0]) {
                htmlContent = `<figure>
                    <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`;
            } else {
                htmlContent = '<div class="error-no-image">No image available</div>';
            };

            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }

        const articleRequest = new XMLHttpRequest();
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=720655bc8b644d1d97e9bf81559baf56`);
        articleRequest.onload = addArticle;
        articleRequest.onerror = function(err) { requestError(err, 'articles'); };
        articleRequest.send();

        function addArticle() {
            // debugger;
            let htmlContent = '';
            const data = JSON.parse(this.responseText);
            // console.log(data);
            if (data.response && data.response.docs && data.response.docs.length > 1) {
                htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                </li>`
                ).join('') + '</ul>';
            } else {
                htmlContent = '<div class="error-no-articles">No articles available</div>'
            };

            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }

        function requestError(e, part) {
            console.log(e);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`)
        }
    });
})();
