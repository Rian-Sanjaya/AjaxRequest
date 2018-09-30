/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: "Client-ID c6bd44b18cfecf778465ed96c60f530519bd98fa0eb15d5eb853aa0b7cd1e9c0"
            }
        }).done(addImage).fail( function(err) {
            requestError(err, 'image');
        } );

        function addImage(data) {
            // debugger;
            let htmlContent = '';
            const firstImage = data.results[0];
            // console.log(firstImage);
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

        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=720655bc8b644d1d97e9bf81559baf56`
        }).done(addArticle).fail( function(err) {
            requestError(err, 'articles');
        } );

        function addArticle(data) {
            // debugger;
            let htmlContent = '';
            
            // console.log(articles);
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
        }
    });
})();
