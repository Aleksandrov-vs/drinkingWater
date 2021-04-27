const createUserInfMsg = require('../appearance/templates/userInfMsg')
const menu = require('../appearance/keyboard/menu')
const inlineKeyboards = require('../appearance/keyboard/inline_keyboards')
const utils = require('./utils')

async function createUser(chatId, userId, bot, db, userRequest){
    let requiredVolumeWater = 0
    if(userRequest['gender'] === 'f'){
        requiredVolumeWater = (userRequest['weight'] * 0.03) + (userRequest['quantity_hours'] * 0.4)
    }else{
        requiredVolumeWater = (userRequest['weight'] * 0.04) + (userRequest['quantity_hours'] * 0.6)
    }
    requiredVolumeWater = requiredVolumeWater.toFixed(2)
    userRequest['required_volume_water'] = requiredVolumeWater

    if(!await db.userExists(userId)){

        if(!await db.addUser(userId, chatId, userRequest)){
            await bot.sendMessage(chatId, 'в указанных данных допущена ошибка')
            return 0
        }else{
            const nowMilsec = new Date().getTime()
            await db.updateLastDrinkingDate(userId, nowMilsec)
        }
    }else{
        if(!await db.updateUserInf(userId, chatId, userRequest)){
            await bot.sendMessage(chatId, 'в указанных данных допущена ошибка')
            return 0
        }

    }
    const text = createUserInfMsg(userRequest)
    const keyboardJSON = JSON.stringify({inline_keyboard:  inlineKeyboards.createInfMsgKeyboard()})

    const now = new Date()
    let date_today = utils.formatDate(now)
    await db.addUserStatistics(userId, date_today)
    await bot.sendMessage(chatId, text, {reply_markup: keyboardJSON, parse_mode: 'HTML'})
    await bot.sendMessage(
        chatId,
        '<b>КЛАВИАТУРА</b>\n' +
        '<b>мои данные</b> - работа с данными которые вы указали \n' +
        '<b>я попил</b> - после приема воды, нажмите на эту кнопку\n' +
        '<b>моя статистика</b> - ваша статистика за последние 7 дней',
    {reply_markup: menu.mainMenu.reply_markup, parse_mode: "HTML"}
    )


    await db.updateSession(userId, 'Stage', 'start')
    await db.updateSession(userId, 'Auth', 'start')
    await db.deleteUserRequest(userId)
}

module.exports = createUser
