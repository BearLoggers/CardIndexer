/* Отправка POST запросов */
const xhr = new XMLHttpRequest();

function sendPOST(url, body = {}, convertAnsToJSON = true) {
    return new Promise((resolve, reject) => {
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        xhr.onreadystatechange = (event) => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.status, event.currentTarget.responseText);
                if (xhr.status != 200) return reject(event.currentTarget.responseText);

                let resp = event.currentTarget.responseText;
                if (convertAnsToJSON) resp = JSON.parse(resp);

                resolve(resp);
            }
        }
        xhr.send(JSON.stringify(body));
    });
}

/* Функционал страницы */
function sendCard() {
    const title = document.getElementById('titleInput').value,
          desc = document.getElementById('descInput').value,
          definition = document.getElementById('definitionTextarea').value,
          sourceDiv = document.getElementById('sources');

    const sources = [];
    for (const node of sourceDiv.children) {
        const authorName = node.getElementsByClassName("authorInput")[0].value;
        const sourceName = node.getElementsByClassName("nameInput")[0].value;
        const sourceLink = node.getElementsByClassName("linkInput")[0].value;

        sources.push({ authorName, sourceName, sourceLink });
    }

    const card = {
        title, desc, definition, sources
    };

    sendPOST('/postcard', card).then(ans => {
        console.log(ans);
    }).catch(err => {
        Swal.fire(
            'О нет!',
            'Что-то прошло не так при отправке! Информация отправлена в консоль браузера (F12)',
            'error'
        );

        console.error(err);
    });
}

function edit(id) {
    location = `/edit/${id}`;
}

let sourceCnt = 0;
function addSource(source = {}) {
    const sourceHtml = `
        <div id="source${sourceCnt}">
            <input class="authorInput" placeholder="Автор" value="${source.author || ""}">
            "<input class="nameInput" placeholder="Название" value="${source.title || ""}">"
            <span class="mr-2"></span> &mdash; <span class="mr-2"></span>

            <input class="linkInput" placeholder="Строка/страница" value="${source.link || ""}">

            <button onclick="removeSource(${sourceCnt});">x</button>
        </div>
    `;

    sourceCnt++;
    document.getElementById('sources').insertAdjacentHTML('beforeend', sourceHtml);
}

function removeSource(id) {
    const source = document.getElementById(`source${id}`);

    source.parentElement.removeChild(source);
}