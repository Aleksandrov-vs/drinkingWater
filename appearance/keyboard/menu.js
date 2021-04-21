module.exports = {

    mainMenu : {
        "reply_markup": {
            "keyboard": [
                ["💧", "мои данные"],
                ["моя статистика"]
            ],
            "resize_keyboard": true,
            "force_reply": true
        }
    },
    mainMenuAdmin : {
        "reply_markup": {
            "keyboard": [
                ["💧", "мои данные"],
                ["моя статистика", "управление пользователями"],
                ["изменить мотивационные фразы"],
            ],
            "resize_keyboard": true,
            "force_reply": true
        }
    },
}
