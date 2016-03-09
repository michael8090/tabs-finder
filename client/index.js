/**
 * Created by yong on 3/9/16.
 */
// import './index.scss';
require('./index.scss');
function get(url, onSuccess, onFail) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
        if (xhr.status === 200) {
            onSuccess(xhr.response);
        } else {
            onFail(xhr.status);
        }
    };
    xhr.send();
}
function renderResult(items) {
    const resultPanel = document.querySelector('#result');
    resultPanel.innerHTML = items.reduce((html, image) => html + `<a href="${image.image.contextLink}"><img src="${image.link}"></a>`, '') || 'NOT FOUND';
}

let images = [];

function search(key, append, done) {
    const index = append ? images.length : 0;
    get(`/api/search?key=${encodeURIComponent(key)}&index=${index}`, (res) => {
        const newImages = JSON.parse(res).items;
        if (!append) {
            images = newImages;
        } else {
            images = images.concat(newImages);
        }

        renderResult(images);
        done(newImages.length);
    });
}

window.onload = () => {
    const input = document.querySelector('input');
    let isLoadingMore = false;

    function scrollHandler() {
        if (isLoadingMore) {
            return;
        }

        if (document.body.scrollHeight === document.body.scrollTop + window.innerHeight) {
            const key = input.value;
            if (key) {
                isLoadingMore = true;
                search(key, true, (newImageCount) => {
                    if (!newImageCount) {
                        document.onscroll = '';
                    }
                    isLoadingMore = false;
                });

            }
        }
    }

    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const key = input.value;
        if (key) {
            search(key);
            document.onscroll = scrollHandler;
        }
    });

};