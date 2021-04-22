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
        'Пожалуйста, введите <u>время активного занятия спортом</u>\n(В часах)\n' +
        ' <i>если вы не занимаетесь спортом - впишите 0</i> ',
        {parse_mode:"HTML"}
    )
    await db.updateSession(userId, 'Stage', 'Auth')
    await db.updateSession(userId, 'Auth', 'wait_time')
    await db.updateUserRequest(userId, 'gender', genderId)
}

module.exports = choiceGender
