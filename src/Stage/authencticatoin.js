const inlineKeyboards = require('../../appearance/keyboard/inline_keyboards');
const createUser = require('../createUser')
const utility = require('../utility')

async function authentication(bot, userId, chatId, msg, session, db){
    const state = session['Auth']

    if(state === 'wait_time'){
        const quantity_hours = utility.checkFloat(msg.text, 0, 24)
        if(quantity_hours!== false) {
            await db.updateUserRequest(userId, 'quantity_hours', quantity_hours)
            await bot.sendMessage(chatId, 'Пожалуйста,укажите свой <u>вес</u> (в кг)', {parse_mode: "HTML"})
            await db.updateSession(userId, 'Auth', 'wait_weight')
        } else{
            await bot.sendMessage(
                chatId,
                'Вводите только <u>цифры</u> и <u>знак запятой</u> или <u>точки</u>.\n' +
                ' Введенное значение не должно привышать <u>24</u> часов',
                {parse_mode: "HTML"}
            )
        }
    }else if(state === 'wait_weight') {
        const userRequest = session['UserRequest']
        const weight = utility.checkFloat(msg.text, 0, 400)
        if(weight!== false) {
            await db.updateUserRequest(userId, 'weight', weight)

            const keyboardJSON = JSON.stringify({inline_keyboard: inlineKeyboards.choice_interval})
            await bot.sendMessage(chatId, 'выбирете частоту получения уведомлений', {reply_markup: keyboardJSON})
        } else{
            await bot.sendMessage(
                chatId,
                'Вводите только <u>цифры</u> и <u>знак запятой</u> или <u>точки</u>.\n' +
                ' Введенный вес не должен привышать <u>2500</u> кг',
                {parse_mode: "HTML"}
                )
        }
    }
    else if(state === 'wait_interval') {
        const userRequest = session['UserRequest']
        const interval = utility.checkFloat(msg.text, 0, 200)
        if(interval !== false) {
            userRequest['notification_interval'] = interval
            await createUser(chatId, userId, bot, db, userRequest)
            await db.updateSession(userId, 'Stage', 'start')
            await db.updateSession(userId, 'Auth', 'start')
            await db.deleteUserRequest(userId)
        } else{
            await bot.sendMessage(
                chatId,
                'Вводите только <u>цифры</u> и <u>знак запятой</u> или <u>точки</u>.\n' +
                ' Интервал должен не привышать <u>100</u> часов',
                {parse_mode: "HTML"}
            )
        }
    }
}

module.exports = authentication
