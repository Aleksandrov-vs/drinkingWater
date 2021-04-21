const createUserInfMsg = require('../../appearance/templates/userInfMsg')
const createUserStatisticsMsg =require('../../appearance/templates/userStatisticsMsg')
const menu = require('../../appearance/keyboard/menu')
const inlineKeyboards = require('../../appearance/keyboard/inline_keyboards')
const utility = require('../utility')

async function workingWithUser(bot, userId, chatId, msg, session, db){
    const state = session['choiceUser']
    if(state === 'wait_user_id'){
        const selectedUserId = parseInt(msg.text)
        if(!isNaN(selectedUserId)){
            if(await db.userExists(selectedUserId)){
                const selectedUserInfData = await db.getUserInf(selectedUserId)
                const userInf = createUserInfMsg(selectedUserInfData)
                const userStatisticsData = await db.getUserStatistics(selectedUserId)
                const userStatistics = createUserStatisticsMsg(userStatisticsData)
                await bot.sendMessage(
                    chatId,
                    userInf+userStatistics,
                    {
                        parse_mode:"HTML"
                    }
                    )
                await db.updateSession(userId, 'Stage', 'start')
                await db.updateSession(userId, 'choiceUser', 'start')
                await db.deleteUserRequest(userId)
            }else{
                await bot.sendMessage(chatId, 'такого пользователя нет')
            }
        } else{
            await bot.sendMessage(chatId, 'вводите только цифры')
        }
    }
}

module.exports = workingWithUser
