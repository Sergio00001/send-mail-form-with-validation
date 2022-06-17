"use strict"

// Отправка данных на сервер
function send(e, php) {
    e.preventDefault()
    let error = formValidate(form)

    if (error === 0) {
        form.classList.add('_sending')
        removeAnimation()
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
                    animateItems()
                    showPopupSuccess()
                    // alert("Сообщение отправлено");
                } else {
                    // Если произошла ошибка
                    form.classList.remove('_sending')
                    animateItems()
                    showPopupError()
                    // alert("Ошибка. Сообщение не отправлено");
                }
                // Если не удалось связаться с php файлом
            } else {
                form.classList.remove('_sending')
                form.reset()
                removeInputStyle()
                showPopupError()
                // alert("Ошибка сервера. Номер: " + req.status);
            }
        };
    } else {
        alert('Заполните все поля со знаком *')
    }

    // Если не удалось отправить запрос. Стоит блок на хостинге
    req.onerror = function () { alert("Ошибка отправки запроса"); };
    req.send(new FormData(e.target));
}

//Немного стилизации

//Всплывающее окно
const popup = document.querySelector('#popup')
const popupBody = document.querySelector('.popup__body')
const popupCloseBtn = document.querySelector('.popup__close')
const popupContent = document.querySelector('.popup__content')
const popupTitle = document.querySelector('.popup__title')
const success = 'Сообщение отправлено'
const error = 'Ошибка. Сообщение не отправлено'


popupCloseBtn.addEventListener('click', hidePopup)
popupBody.addEventListener('click', (e) => {
    e.stopPropagation()
    if (e.target.classList == 'popup__body') {
        hidePopup()
    }
})

function showPopupSuccess() {
    popup.classList.add('_show')
    popupContent.classList.add('_show')
    popupTitle.classList.add('_show')
    popupCloseBtn.classList.add('_show')
    popupTitle.innerText = success
}

function showPopupError() {
    popup.classList.add('_show')
    popupContent.classList.add('_show')
    popupTitle.classList.add('_show')
    popupCloseBtn.classList.add('_show')
    popupTitle.innerText = error
}

function hidePopup() {
    popup.classList.remove('_show')
    popupContent.classList.remove('_show')
    popupTitle.classList.remove('_show')
    popupCloseBtn.classList.remove('_show')
    animateItems()
}


//Стилизация инпутов
const formStyle = document.querySelectorAll('.input__style')

function removeInputStyle() {
    for (let i = 0; i < formStyle.length; i++) {
        const input = formStyle[i];
        input.classList.remove('styled')
    }
}

for (let i = 0; i < formStyle.length; i++) {
    const input = formStyle[i];

    input.addEventListener('change', () => {
        if (input.value !== '') {
            input.classList.add('styled')
        } else {
            removeInputStyle()
        }
    })
}

// Анимация формы 
const header = document.querySelector('.form__title')
const items = document.querySelectorAll('.form__item')
const submitBtn = document.querySelector('.form__btn')

function removeAnimation() {
    header.classList.remove('animate')
    submitBtn.classList.remove('animate')

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.classList.remove('animate')
    }
}

function animateItems() {
    header.classList.add('animate')
    submitBtn.classList.add('animate')

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.classList.add('animate')
    }
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