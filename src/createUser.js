const createUserInfMsg = require('../appearance/templates/userInfMsg')
const menu = require('../appearance/keyboard/menu')
const inlineKeyboards = require('../appearance/keyboard/inline_keyboards')
const utility = require('./utility')

async function createUser(chatId, userId, bot, db, userRequest){
    let requiredVolumeWater = 0
    if(userRequest['gender'] === 'f'){
        requiredVolumeWater = (userRequest['weight'] * 0.03) + (userRequest['quantity_hours'] * 0.4)
    }else{
        requiredVolumeWater = (userRequest['weight'] * 0.04) + (userRequest['quantity_hours'] * 0.6)
    }
    requiredVolumeWater = requiredVolumeWater.toFixed(2)
    userRequest['required_volume_water'] = requiredVolumeWater
    if (await db.userExists(userId)){
        await db.deleteUser(userId)
    }

    if(await db.addUser(userId, chatId, userRequest)){
        const text = createUserInfMsg(userRequest)
        const keyboardJSON = JSON.stringify({inline_keyboard:  inlineKeyboards.inf_msg_keyboard})

        const now = new Date()
        let date_today = utility.formatDate(now)
        await db.addUserStatistics(userId, date_today)
        await bot.sendMessage(chatId, text, {reply_markup: keyboardJSON, parse_mode: 'HTML'})
        await bot.sendMessage(chatId, 'новая клавиатура', {reply_markup: menu.mainMenu.reply_markup})
    }else{
        await bot.sendMessage(chatId, 'в указаных данных допущена ошибка')
    }
}

module.exports = createUser
