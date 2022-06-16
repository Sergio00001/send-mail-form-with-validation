// Отправка данных на сервер
function send(e, php) {
    e.preventDefault()
    let error = formValidate(form)

    if (error === 0) {
        form.classList.add('_sending')
        var req = new XMLHttpRequest();
        req.open('POST', php, true);
        req.onload = function () {
            if (req.status >= 200 && req.status < 400) {
                json = JSON.parse(this.response); // internet explorer 11
                console.log(json);

                if (json.result == "success") {
                    // Если сообщение отправлено
                    form.reset()
                    form.classList.remove('_sending')
                    alert("Сообщение отправлено");
                } else {
                    // Если произошла ошибка
                    form.classList.remove('_sending')
                    alert("Ошибка. Сообщение не отправлено");
                }
                // Если не удалось связаться с php файлом
            } else { alert("Ошибка сервера. Номер: " + req.status); }
        };
    } else {
        alert('Заполните все поля со знаком *')
    }

    // Если не удалось отправить запрос. Стоит блок на хостинге
    req.onerror = function () { alert("Ошибка отправки запроса"); };
    req.send(new FormData(e.target));
}

//Валидация формы

const form = document.getElementById('form')

function formValidate(form) {
    let error = 0
    let formReq = document.querySelectorAll('._req')

    for (let i = 0; i < formReq.length; i++) {
        const input = formReq[i];
        formRemoveError(input)

        if (input.classList.contains('_email')) {
            if (emailTest(input)) {
                formAddError(input)
                error++
            }
        } else {
            if (input.value === '') {
                formAddError(input)
                error++
            }
        }
    }
    return error
}

function formAddError(input) {
    input.parentElement.classList.add('_error')
    input.classList.add('_error')
}

function formRemoveError(input) {
    input.parentElement.classList.remove('_error')
    input.classList.remove('_error')
}

function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value)
}


//Работа с изображением

const formImage = document.getElementById('formImage')
const formPreview = document.getElementById('formPreview')

formImage.addEventListener('change', () => {
    uploadFile(formImage.files[0])
})

function uploadFile(file) {
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Разрешены только изображения')
        formImage.value = ''
        return
    }

    if (file.size > 2 * 1024 * 1024) {
        alert('фаил должен быть не более 2мб')
        return
    }

    let reader = new FileReader()

    reader.onload = function (e) {
        formPreview.innerHTML = `<img src="${e.target.result}" alt="photo">`
    }
    reader.onerror = function () {
        alert('Ошибка')
    }

    reader.readAsDataURL(file)
}