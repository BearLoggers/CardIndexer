/* Функционал страницы */
function assembleCard() {
    const title = document.getElementById('titleInput').value,
        subtitle = document.getElementById('descInput').value,
        content = document.getElementById('definitionTextarea').value;

    const source = currentSource;

    const card = {
        title,
        subtitle,
        content,
        source
    };

    return card;
}

function assembleSource() {
    const title = document.getElementById('sourceTitleInput').value,
        author = document.getElementById('sourceAuthorInput').value || null;

    return {
        title,
        author
    };
}

function sendCard() {
    const card = assembleCard();

    sendPOST('/postcard', card).then(ans => {
        console.log(ans);

        Cookies.remove('title', { path: '' });
        Cookies.remove('subtitle', { path: '' });
        Cookies.remove('content', { path: '' });

        location.reload();
    }).catch(err => {
        Swal.fire(
            'О нет!',
            'Что-то прошло не так при отправке! Информация отправлена в консоль браузера (F12)',
            'error'
        );

        console.error(err);
    });
}

function updateNotes() {
    let notes = document.getElementById('notesTextarea').value;

    sendPOST('/updatenotes', {notes}).then(ans => {
        console.log(ans);

        location.reload();

    }).catch(err => {
        Swal.fire(
            'О нет!',
            'Что-то прошло не так при отправке! Информация отправлена в консоль браузера (F12)',
            'error'
        );

        console.error(err);
    })
}

function edit(id) {
    location = `/edit/${id}`;
}

function sendEdit(id) {
    const card = assembleCard();

    sendPOST(`/postedit/${id}`, card).then(ans => {
        console.log(ans);
        history.back();
    }).catch(err => {
        Swal.fire(
            'О нет!',
            'Что-то прошло не так при отправке! Информация отправлена в консоль браузера (F12)',
            'error'
        );

        console.error(err);
    });
}

function capitalizeFirst() {
    let input = document.getElementById('titleInput');
    let v = input.value;

    input.value = v.substr(0, 1).toLocaleUpperCase() + v.substr(1);
}

const stessMap = {
    'А': 'А́',
    'а': 'а́',
    'Е': 'Е́',
    'е': 'е́',
    'И': 'И́',
    'и': 'и́',
    'О': 'О́',
    'о': 'о́',
    'У': 'У́',
    'у': 'у́',
    'Ы': 'Ы́',
    'ы': 'ы́',
    'Э': 'Э́',
    'э': 'э́',
    'Ю': 'Ю́',
    'ю': 'ю́',
    'Я': 'Я́',
    'я': 'я́'
}

function markStress() {
    let titleInput = document.getElementById('titleInput');
    if (titleInput.selectionStart != undefined) {
        let startPos = titleInput.selectionStart;
        let endPos = titleInput.selectionEnd;
        selectedText = titleInput.value.substring(startPos, endPos);
        console.log(selectedText);
        if (selectedText != "" && stessMap[selectedText])
            titleInput.value = titleInput.value.slice(0, startPos) + stessMap[selectedText] + titleInput.value.slice(endPos);
    }
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
            sendPOST(`/delete`, {
                id
            }).then(ans => {
                console.log(ans);
                location.reload();
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

let currentSource = null;

function changeSource(elemID) {
    const option = document.getElementById(elemID);
    const id = option.value;
    const visualNumber = option.title;

    currentSource = id;
    document.getElementById('sourceNumber').innerText = visualNumber;
}

function modifySources() {
    document.getElementById('sourceButtons').style.display = 'none';
    document.getElementById('addSourceDiv').style.display = 'block';
}

function saveInputToCookies() {
    const title = document.getElementById('titleInput').value,
        subtitle = document.getElementById('descInput').value,
        content = document.getElementById('definitionTextarea').value;

    Cookies.set('title', title, {
        path: ''
    });
    Cookies.set('subtitle', subtitle, {
        path: ''
    });
    Cookies.set('content', content, {
        path: ''
    });
}

setInterval(() => saveInputToCookies(), 1000);

function beginFilter() {
    let start = document.getElementById('beginInput').value;

    if (start)
        location = `/begins/${start}`;
}

function loadInputFromCookies() {
    const title = Cookies.get('title'),
        subtitle = Cookies.get('subtitle'),
        content = Cookies.get('content');

    if (title || subtitle || content) {
        document.getElementById('titleInput').value = title;
        document.getElementById('descInput').value = subtitle;
        document.getElementById('definitionTextarea').value = content;

        /*Cookies.remove('title');
        Cookies.remove('subtitle');
        Cookies.remove('content');*/
    }
}
// loadInputFromCookies();

function sendSource() {
    const card = assembleSource();

    sendPOST(`/postsource`, card).then(ans => {
        console.log(ans);
        saveInputToCookies();

        location.reload();
    }).catch(err => {
        Swal.fire(
            'О нет!',
            'Что-то прошло не так при отправке! Информация отправлена в консоль браузера (F12)',
            'error'
        );

        console.error(err);
    });
}

function closeSource() {
    document.getElementById('sourceButtons').style.display = 'block';
    document.getElementById('addSourceDiv').style.display = 'none';
}

function deleteSource(elemID) {
    const option = document.getElementById(elemID);
    const id = option.value;
    const title = option.title;

    Swal.fire({
        title: `Вы уверены, что хотите удалить «${title}»?`,
        text: 'Возврат источника может быть произведён только из бэкапа.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да, удалить!',
        cancelButtonText: 'Отмена'
    }).then(result => {
        if (result.value) {
            sendPOST(`/deletesource`, {
                id
            }).then(ans => {
                console.log(ans);
                location.reload();
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