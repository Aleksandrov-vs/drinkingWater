async function choiceDrink(userId, chatId, bot, db, callback_query, msg_id) {
    const drinkName = callback_query[1]
    await db.updateUserRequest(userId, 'drink_name', drinkName)

    const keyboardJSON = JSON.stringify({inline_keyboard: [[]]})
    await bot.editMessageReplyMarkup(keyboardJSON, {chat_id: chatId, message_id: msg_id})
    await bot.sendMessage(chatId, 'введите количество выпитого напитка в литрах')
    await db.updateSession(userId, 'Stage', 'choiceDrink')
    await db.updateSession(userId, 'choiceDrink', 'wait_amount_drink')
}

module.exports = choiceDrink
