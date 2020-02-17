function addCard() {
    alert("nice");
}

const sourceHtml = `
    <input class="authorInput" placeholder="Автор"> 
    "<input class="nameInput" placeholder="Название">"
    <span class="mr-2"></span>&mdash;<span class="mr-2"></span><input class="linkInput" placeholder="Строка/страница">
    <br>
`;

function addEmptySource() {
    document.getElementById('sources').innerHTML += sourceHtml;
}

addEmptySource();