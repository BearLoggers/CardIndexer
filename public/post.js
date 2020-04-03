/* Отправка POST запросов */
const xhr = new XMLHttpRequest();

function sendPOST(url, body = {}, convertAnsToJSON = true) {
    console.log("body", body);
    return new Promise((resolve, reject) => {
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
        xhr.onreadystatechange = (event) => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.status, event.currentTarget.responseText);
                if (xhr.status != 200) return reject(event.currentTarget.responseText);

                let resp = event.currentTarget.responseText;
                if (convertAnsToJSON) resp = JSON.parse(resp);

                if (resp.updatePage) location.reload();

                resolve(resp);
            }
        }
        xhr.send(JSON.stringify(body));
    });
}