async function choiceGender(userId, chatId, bot, db, callback_query, msg_id) {
    const genderId = callback_query[1]

    let genderText = ''
    if (genderId === 'f') {
        genderText = 'женский'
    } else if(genderId === 'm') {
        genderText = 'мужской'
    }

    const keyboardJSON = JSON.stringify({inline_keyboard: [[]]})
    await bot.editMessageReplyMarkup(keyboardJSON, {chat_id: chatId, message_id: msg_id})
    await bot.sendMessage(
        chatId,
        `вы выбрали ${genderText} пол\n` +
        'пожалуйста введите время активного занятия спортом (В часах) или другими соизмеримым по нагрузкам видам деятельности (при отсутствии оных необходимо ставить 0)'
    )
    await db.updateSession(userId, 'Stage', 'Auth')
    await db.updateSession(userId, 'Auth', 'wait_time')
    await db.updateUserRequest(userId, 'gender', genderId)
}

module.exports = choiceGender
