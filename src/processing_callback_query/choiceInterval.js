const createUser = require('../createUser')

async function choiceInterval(userId, chatId, bot, db, callback_query, msg_id) {
    const intervalId = callback_query[1]

    if (intervalId === 'def') {
        await db.updateUserRequest(userId, 'notification_interval', 3)
        const session = await db.getSession(userId)
        const userRequest = session['UserRequest']
        await createUser(chatId, userId, bot, db, userRequest)

    } else if(intervalId === 'custm') {
        await db.updateSession(userId, 'Auth', 'wait_interval')
        await bot.sendMessage(
            chatId,
            'введите как часто вы хочтите получать уведомления (в часах)',
        {parse_mode: "HTML"}
        )
    }

    const keyboardJSON = JSON.stringify({inline_keyboard: [[]]})
    await bot.editMessageReplyMarkup(keyboardJSON, {chat_id: chatId, message_id: msg_id})
}

module.exports = choiceInterval
