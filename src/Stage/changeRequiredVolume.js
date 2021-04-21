async function changeRequiredVolume(bot, userId, chatId, msg, session, db) {
    const state = session['changeRequiredVolume']
    const userRequest = session['UserRequest']

    if(state === 'wait_volume'){
        const customVolume = parseFloat(msg.text)
        await db.updateRequiredVolumeWaterForUser(userId, customVolume)
        await bot.sendMessage(chatId, `вы изменили нужное колиество воды на: ${customVolume} литров в день`)
    }

}

module.exports = changeRequiredVolume
