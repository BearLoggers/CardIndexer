/* Отправка POST запросов */
const xhr = new XMLHttpRequest();

function sendPOST(url, body = {}, convertAnsToJSON = true) {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        for (let name in body)
            formData.append(name, body[name])

        xhr.open("POST", url, true);
        xhr.onreadystatechange = (event) => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (DEBUG) console.log(xhr.status, event.currentTarget.responseText);
                if (xhr.status != 200) return reject(event.currentTarget.responseText);

                let resp = event.currentTarget.responseText;
                if (convertAnsToJSON) resp = JSON.parse(resp);

                resolve(resp);
            }
        }
        xhr.send(formData);
    });
}

/* Функционал страницы */
function sendCard() {

}

let sourceCnt = 0;
function addEmptySource() {
    const sourceHtml = `
        <div id="source${sourceCnt}">
            <input class="authorInput" placeholder="Автор">
            "<input class="nameInput" placeholder="Название">"
            <span class="mr-2"></span>&mdash;<span class="mr-2"></span><input class="linkInput" placeholder="Строка/страница">

            <button onclick="removeSource(${sourceCnt});">x</button>
        </div>
    `;

    sourceCnt++;
    document.getElementById('sources').innerHTML += sourceHtml;
}

addEmptySource();

function removeSource(id) {
    const source = document.getElementById(`source${id}`);

    source.parentElement.removeChild(source);
}