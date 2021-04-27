const utils = require('../utils')


async function changeRequiredVolume(bot, userId, chatId, msg, session, db) {
    const state = session['changeRequiredVolume']
    const userRequest = session['UserRequest']

    if(state === 'wait_volume'){
        const customVolume = utils.checkFloat(msg.text, 0, 100)
        if (customVolume !== false){
            await db.updateRequiredVolumeWaterForUser(userId, customVolume)
            await bot.sendMessage(chatId, `вы изменили нужное колиество воды на: ${customVolume} литров в день`)
            const userInf = await db.getAllTodayDataForUser(userId)

            if(userInf['required_volume_water'] > userInf['volume_water_drunk']){
                await db.updateUserStatistics(userId, userInf.quantity_intake_water, userInf.volume_water_drunk, false )
            }
            await db.updateLateStatusForUser(userId, false)

            await db.updateSession(userId, 'Stage', 'start')
            await db.updateSession(userId, 'changeRequiredVolume', 'start')
            await db.deleteUserRequest(userId)
        } else {
            await bot.sendMessage(chatId, 'Вводите только цифры и знак запятой или точки. Макисмально количество воды которое можно указать: 100')
        }
    }

}

module.exports = changeRequiredVolume
