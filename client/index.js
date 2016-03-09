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
function renderResult(images, append) {
    const resultPanel = document.querySelector('#result');
    resultPanel.innerHTML = images.reduce((html, image) => html + `<a href="${image.image.contextLink}"><img src="${image.link}"></a>`, append ? resultPanel.innerHTML : '') || 'NOT FOUND';
}

function search(key, append) {
    get(`/api/search?key=${encodeURIComponent(key)}`, (res) => renderResult(JSON.parse(res).items, append));
}

window.onload = () => {
    const input = document.querySelector('input');
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const key = input.value;
        if (key) {
            search(key);
        }
    });

    let isLoadingMore = false;
    document.addEventListener('scroll', function scrollHandler() {
        if (isLoadingMore) {
            return;
        }
        isLoadingMore = true;

        if (document.body.scrollHeight === document.body.scrollTop + window.innerHeight) {
            const key = input.value;
            if (key) {
                search(key, true);
            }
        }
    });
};