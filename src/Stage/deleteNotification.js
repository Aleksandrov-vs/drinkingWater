const utility = require('../utility')
async function deleteNotification(bot, userId, chatId, msg, session, db) {

    const notifId = utility.checkInt(msg.text, 0, 5000)
    if(notifId !== false && await db.notificationExists(notifId)) {
        await db.deleteNotification(notifId)
        await bot.sendMessage(chatId, 'вы удалили мотивационную фразу')

        await db.updateSession(userId, 'Stage', 'start')
        await db.updateSession(userId, 'deleteNotif', 'start')
        await db.deleteUserRequest(userId)
    }else{
        await bot.sendMessage(chatId, 'вы ввели не верный id')
    }
}

module.exports = deleteNotification
