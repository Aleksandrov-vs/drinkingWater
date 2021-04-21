const utility = require('../utility')

async function drinkLiquids(bot, userId, chatId, msg, session, db) {
    const state = session['choiceDrink']
    const userRequest = session['UserRequest']

    if(state === 'wait_amount_drink'){
        const amount_drink = parseFloat(msg.text)
        const drinkName = userRequest['drink_name']
        const requireVolume = await db.getRequiredVolumeForUser(userId)

        let quantity_intake_water = await db.getQuantityIntakeWaterForUser(userId)
        quantity_intake_water +=1

        let amount_liquids = 0
        if(drinkName === 'juice' || drinkName === 'water' || drinkName === 'milk' ){
            amount_liquids = amount_drink
        }else if(drinkName === 'tea' || drinkName === 'soda' ||  drinkName === 'coffee'){
            amount_liquids = amount_drink * 0.5
        }

        let volume_water_drunk = await db.getVolumeWaterDrunkForUser(userId)
        volume_water_drunk += amount_liquids

        if(requireVolume <= volume_water_drunk){
            const notifications = [
               'Отличный результат',
               'Ты молодец',
               'Так держать',
                'Я тобой горжусь'
            ]
            await bot.sendMessage(chatId, `Вы выполнили дневную норму. ${notifications[utility.getRandomInt(0, 3)]}`)
            await db.updateUserStatistics(userId, quantity_intake_water, volume_water_drunk, true)


        }else{
            await bot.sendMessage(chatId, `сегодня вы выпили ${volume_water_drunk} литров воды. Осталось выпить ${requireVolume - volume_water_drunk} литров`)
            await db.updateUserStatistics(userId, quantity_intake_water, volume_water_drunk, false)
        }

        let now = new Date().getTime()
        await db.updateLastDrinkingDate(userId, now)



        await db.updateSession(userId,'Stage', 'start')
        await db.updateSession(userId,'choiceDrink', 'start')
        await db.deleteUserRequest(userId)
    }

}

module.exports = drinkLiquids
