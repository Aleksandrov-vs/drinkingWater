const utility = require('../utils')

async function addNotification(bot, userId, chatId, msg, session, db) {
    const state = session['addNotif']
    const userRequest = session['UserRequest']
    if (state === 'wait_text'){
        const notification = msg.text
        const partDay = userRequest['part_day']
        if(await db.addNotification(notification, partDay)){
            await bot.sendMessage(chatId, `добавлена новая фраза:\n<i>${notification}</i>`, {parse_mode:"HTML"})
            await db.updateSession(userId, 'Stage', 'start')
            await db.updateSession(userId, 'addNotif', 'start')
            await db.deleteUserRequest(userId)

        } else {
            await bot.sendMessage(chatId, 'ошибка, попробуйте еще раз')
        }

    }
}

module.exports = addNotification
