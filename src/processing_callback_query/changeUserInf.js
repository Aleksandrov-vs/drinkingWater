const inlineKeyboards = require('../../appearance/keyboard/inline_keyboards')


async function changeUserInf(userId, chatId, bot, db, msg) {
    const userName = msg.from.first_name
    const keyboard = inlineKeyboards.choice_gender
    const keyboardJSON = JSON.stringify({inline_keyboard: keyboard})
    await db.createSession(userId)
    await db.updateUserRequest(userId, 'user_name', userName)
    const text = `${userName}, пожалуйста выбери свой пол`
    await bot.sendMessage(chatId, text,{
        reply_markup: keyboardJSON,
        parse_mode:'HTML'
    })
}

module.exports =  changeUserInf
