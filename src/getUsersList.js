const getUserListMSG = require('../appearance/templates/userListMsg')

async function getUsersList(bot, userId, chatId, msg, session, db) {
    let usersListStr = await getUserListMSG(db)
    usersListStr = 'выберете из списка ниже и введите телеграм id нужного пользователя\n\n' + usersListStr
    await bot.sendMessage(chatId, usersListStr, {parse_mode: 'HTML'})
    await db.updateSession(userId, 'Stage', 'choiceUser')
    await db.updateSession(userId, 'choiceUser', 'wait_user_id')
}

module.exports = getUsersList
