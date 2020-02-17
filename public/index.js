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
function assembleCard() {
    const title = document.getElementById('titleInput').value,
        subtitle = document.getElementById('descInput').value,
        content = document.getElementById('definitionTextarea').value,
        sourceDiv = document.getElementById('sources');

    const sources = [];
    for (const node of sourceDiv.children) {
        const author = node.getElementsByClassName("authorInput")[0].value;
        const title = node.getElementsByClassName("nameInput")[0].value;
        const link = node.getElementsByClassName("linkInput")[0].value;

        sources.push({ author, title, link });
    }

    const card = {
        title, subtitle, content, sources
    };

    return card;
}

function sendCard() {
    const card = assembleCard();

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

function sendEdit(id) {
    const card = assembleCard();

    sendPOST(`/postedit/${id}`, card).then(ans => {
        console.log(ans);
        location = '/';
    }).catch(err => {
        Swal.fire(
            'О нет!',
            'Что-то прошло не так при отправке! Информация отправлена в консоль браузера (F12)',
            'error'
        );

        console.error(err);
    });
}

function remove(id, title) {
    Swal.fire({
        title: `Вы уверены, что хотите удалить «${title}»?`,
        text: 'Возврат слова может быть произведён только из бэкапа.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да, удалить!',
        cancelButtonText: 'Отмена'
    }).then(result => {
        if (result.value) {
            sendPOST(`/delete`, { id }).then(ans => {
                console.log(ans);
                location = '/';
            }).catch(err => {
                Swal.fire(
                    'О нет!',
                    'Что-то прошло не так при попытке удалить! Информация отправлена в консоль браузера (F12)',
                    'error'
                );

                console.error(err);
            });
        }
    })
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