TelegramBot = require('node-telegram-bot-api');
config = require('../config.json');
Database = require('./database');
const inlineKeyboards = require('../appearance/keyboard/inline_keyboards');
const callbackQueryChoiceGender = require('./processing_callback_query/choiceGender')
const callbackQueryChoiceInterval = require('./processing_callback_query/choiceInterval')
const callbackQueryChoiceDrink = require('./processing_callback_query/choiceDrink')
const callbackQueryChangeUserInf = require('./processing_callback_query/changeUserInf')
const authentication = require('./Stage/authencticatoin')
const createUserInfMsg = require('../appearance/templates/userInfMsg')
const createUserStatisticsMsg = require('../appearance/templates/userStatisticsMsg')
const createNotificationsList = require('../appearance/templates/notitficationsListMsg')
const drinkLiquids = require('./Stage/drinkLiquids')
const deleteNotification = require('./Stage/deleteNotification')
const addNotification = require('./Stage/addNotification')
const changeRequiredVolume = require('./Stage/changeRequiredVolume')
const getUsersList = require('./getUsersList')
const workingWithUser = require('./Stage/workingWithUser')
const menu = require('../appearance/keyboard/menu')
const utils = require('./utils')

// создание бота
const bot = new TelegramBot(config.token, { polling: {
        interval:300,
        autoStart: true,
        params:{
            timeout: 10,
        }
    }
});
//база данных
const db = new Database(config.databaseURL);
const today = new Date();




bot.onText(/\/start/, async msg => {

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.first_name
    if(await db.userExists(userId)){
        await bot.sendMessage(chatId, 'ты уже тут')
    } else {
        const keyboard = inlineKeyboards.choice_gender
        const keyboardJSON = JSON.stringify({inline_keyboard: keyboard})
        await db.createSession(userId)
        await db.updateUserRequest(userId, 'user_name', userName)
        const text = `Привет, <b>${userName}</b> теперь я ваш виртуальный помощник \n\n` +
            'Начните вести здоровый образ жизни с водно-солевого баланса организма \n\n' +
            '<b>Я помогу вам:</b>\n\n' +
            '💧отслеживать количество выпитой воды за сутки \n' +
            '💧превратить потребление воды в полезную привычку\n' +
            '💧следить за гидро балансом исходя из индивидуальных параметров\n\n\n\n' +
            '<i>*при расчете рассчитывается примерное количество воды</i>'
        await bot.sendMessage(chatId, text, {parse_mode: "HTML"})
        await bot.sendMessage(chatId, 'Пожалуйста, укажите свой <u>пол</u>', {
            reply_markup: keyboardJSON,
            parse_mode: 'HTML'
        })
    }
});

bot.onText(/\/disconnect/, async msg => {

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    if(await db.userExists(userId)) {
        await db.deleteUser(userId)
        await bot.sendMessage(chatId, 'вы отключены от бота. Чтобы подключиться еще раз введите /start')
    } else{
        await bot.sendMessage(chatId, 'вы не авторизовались. Введите /start')
    }
});


// отлов и обработка ответов от inline клавиатур
bot.on('callback_query', async (msg) => {
    const chatId = msg.message.chat.id;
    const userId = msg.from.id;
    const callback_query = msg.data.split('_')
    const command = callback_query[0]
    const msg_id = msg.message.message_id

    if (command === 'choiceGender') {
        await callbackQueryChoiceGender(userId, chatId, bot, db, callback_query, msg_id)
    } else if (command === 'choiceInterval'){
        await callbackQueryChoiceInterval(userId, chatId, bot, db, callback_query, msg_id)
    } else if(command === 'choiceDrink'){
        await callbackQueryChoiceDrink(userId, chatId, bot, db, callback_query, msg_id)
    } else if(command === 'changeUserInf'){
        await callbackQueryChangeUserInf(userId, chatId, bot, db, msg)
    } else if(command === 'disableNotif'){

        await db.updateNotifStatusForUser(userId, false)
        const keyboardJSON = JSON.stringify({inline_keyboard:  inlineKeyboards.createInfMsgKeyboard(false)})
        await bot.editMessageReplyMarkup(keyboardJSON, {chat_id: chatId, message_id: msg_id})

    } else if(command === 'enableNotif'){
        await db.updateLateStatusForUser(userId, false)
        await db.updateNotifStatusForUser(userId, true)
        const keyboardJSON = JSON.stringify({inline_keyboard:  inlineKeyboards.createInfMsgKeyboard(true)})
        await bot.editMessageReplyMarkup(keyboardJSON, {chat_id: chatId, message_id: msg_id})

    } else if(command === 'deleteNotif'){
        await bot.sendMessage(chatId, 'введите ID фразы, для ее удаления')
        await db.updateSession(userId, 'Stage', 'deleteNotif')
        await db.updateSession(userId, 'deleteNotif', 'wait_id')
    } else if(command === 'changeRequiredVolume'){

        await bot.sendMessage(chatId, 'укажите желаемое количество воды в сутки')
        await db.updateSession(userId, 'Stage', 'changeRequiredVolume')
        await db.updateSession(userId, 'changeRequiredVolume', 'wait_volume')

    } else if(command === 'addNotif'){

        const keyboardJSON = JSON.stringify({inline_keyboard: inlineKeyboards.choice_part_day})
        await bot.sendMessage(chatId, 'выбирете группу  в которую вы хотите добавить фразу', {reply_markup: keyboardJSON})
        await db.updateSession(userId, 'Stage', 'changeRequiredVolume')
        await db.updateSession(userId, 'changeRequiredVolume', 'wait_volume')

    } else if(command === 'addToGroup'){
        await bot.sendMessage(chatId, 'введите фразу')
        await db.updateUserRequest(userId, 'part_day', `${callback_query[1]}`)
        await db.updateSession(userId, 'Stage', 'addNotif')
        await db.updateSession(userId, 'addNotif', 'wait_text')

    }
});

bot.onText(/\/login (.+)/,async (msg, [source, token]) =>{

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userExist = await db.userExists(userId);
    if(userExist){
        if(token === config.authToken){
            await db.createAdmin(userId)
            await bot.sendMessage(chatId, 'теперь вы админ', {reply_markup: menu.mainMenuAdmin.reply_markup })
        } else {
            await bot.sendMessage(chatId, 'ваш токен не валиден')
        }
    } else{
        await bot.sendMessage(chatId, ' заполните данные о себе. Введите команду /start')
    }

});



bot.onText(/мои данные(?!.+)/, async msg => {

    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if(await db.userExists(userId)){
        const userData = await db.getUserInf(userId)
        const notifStatus = await db.getNotificationStatus(userId)
        let text = await createUserInfMsg(userData)
        const keyboardJSON = JSON.stringify({inline_keyboard: inlineKeyboards.createInfMsgKeyboard(notifStatus)})
        await bot.sendMessage(chatId, text, {reply_markup: keyboardJSON, parse_mode: 'HTML'})
    } else {
        await bot.sendMessage(chatId, 'вы не авторизовались. Введите команду /start')
    }
    // await createUserInfMsg()

});

bot.onText(/управление пользователями(?!.+)/, async msg => {

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    if (await db.isAdmin(userId)){
        const session = await db.getSession(userId)
        await getUsersList(bot, userId, chatId, msg, session, db)

    } else {
        await bot.sendMessage(chatId, 'вы не admin')
    }
});


bot.onText(/моя статистика(?!.+)/, async msg => {

    const chatId = msg.chat.id;
    const userId = msg.from.id;
    if(await db.userExists(userId)) {
        const userData = await db.getUserInf(userId)
        const userStatistics = await db.getUserStatistics(userId)
        let text = createUserStatisticsMsg(userStatistics)

        await bot.sendMessage(chatId, text, {parse_mode: "HTML"})
    } else {
        await bot.sendMessage(chatId, 'вы не авторизовались. Введите команду /start')
    }


});

bot.onText(/изменить мотивационные фразы(?!.+)/, async msg => {

    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if(await db.isAdmin(userId)){
        const text = await createNotificationsList(db)

        const keyboardJSON = JSON.stringify({inline_keyboard: inlineKeyboards.change_notifications})
        await bot.sendMessage(chatId, text, {parse_mode: "HTML", reply_markup: keyboardJSON})
    } else {
        await bot.sendMessage(chatId, 'вы не админ')
    }



});


bot.onText(/💧(?!.+)/, async msg => {

    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (await db.userExists(userId)){
        const keyboardJSON = JSON.stringify({inline_keyboard: inlineKeyboards.choice_drink})
        await bot.sendMessage(chatId, 'выбирете напиток', {reply_markup: keyboardJSON})
    } else {
        await bot.sendMessage(chatId, 'вы не авторизовались. Введите команду /start')
    }
});


// хендлер, реаигурующий на любой текст, кроме комманд и текста кнопок. Реализация сценариев
bot.onText(/^(?!\/)^(?!💧)^(?!мои данные)^(?!моя сатистика)^(?!управление пользователями)^(?!изменить мотивационные фразы)/, async msg => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (await db.sessionExists(userId)) {
        const session = await db.getSession(userId)
        const Stage = session.Stage

        if (Stage === 'Auth') {
            await authentication(bot, userId, chatId, msg, session, db)
        } else if (Stage === 'choiceDrink'){
            await drinkLiquids(bot, userId, chatId, msg, session, db)
        } else if (Stage === 'changeRequiredVolume'){
            await changeRequiredVolume(bot, userId, chatId, msg, session, db)
        }else if (Stage === 'deleteNotif'){
            await deleteNotification(bot, userId, chatId, msg, session, db)
        }else if (Stage === 'addNotif'){
            await addNotification(bot, userId, chatId, msg, session, db)
        } else if (Stage === 'choiceUserchoiceUser'){
            if(await db.isAdmin(userId)){
                await workingWithUser(bot, userId, chatId, msg, session, db)
            } else {
                await bot.sendMessage(chatId, 'вы не admin')
            }
        }

    } else {
        await db.createSession(userId)
    }
});

//отправка сообщений с уведомлениями каждые notifications_interval каждому юзеру
async function sendNotifLateUser(user_id){
    const userInf = await db.getAllTodayDataForUser(user_id)
    const now = new Date()
    const nowMilsek = new Date().getTime()
    const notifStatus = await db.getNotificationStatus(user_id)


    if((userInf.last_drinking_date/1000) + (userInf.notification_interval*3600) <= nowMilsek/1000 && notifStatus && !userInf.completed_norm){
        const now = new Date()
        const hours = now.getHours()
        let notification = 'ночь'

        if (config["time interval_afternoon"].start < hours && hours < config["time interval_afternoon"].start) {

            const notifications = await db.getAllNotificationsForPartDay('morning')
            const numberNotif = utils.getRandomInt(0, notifications.length - 1)
            notification = notifications[numberNotif].text

        } else if (config["time interval_afternoon"].start <= hours && hours < config["time interval_afternoon"].end) {

            const notifications = await db.getAllNotificationsForPartDay('afternoon')
            const numberNotif = utils.getRandomInt(0, notifications.length - 1)
            notification = notifications[numberNotif].text

        } else if (config["time interval_evening"].start <= hours && hours < config["time interval_evening"].end) {

            const notifications = await db.getAllNotificationsForPartDay('evening')
            const numberNotif = utils.getRandomInt(0, notifications.length - 1)
            notification = notifications[numberNotif].text

        }
        const chatId = await db.getUserChatId(user_id)
        await bot.sendMessage(chatId, notification)
        setTimeout(async () => {
            await sendNotifLateUser(user_id)
        },  userInf.notification_interval * 60 * 60 * 1000)
    }
}

//поиск пользователей, которым нужно отослать уведомление
setInterval(async () => {
    const now = new Date()
    const nowMilsek = new Date().getTime()
    const hours =  now.getHours()
    if (config.time_interval_send_notif.start <= hours && hours <= config.time_interval_send_notif.end) {
        const userIDs = await db.getLaterUsers(nowMilsek)
        for (let item in userIDs) {
            const user_id = userIDs['user_id']
            await db.updateLateStatusForUser(user_id, true)
            await sendNotifLateUser(user_id)
        }
    }
}, (5 * 1000));


//создание новой записи в таблице statistics
async function createStatistics() {
    const userIDs = await db.getAllUsersIds()
    const now = new Date()
    const hours =  now.getHours()
    const minutes = now.getMinutes()
    let date_today = utils.formatDate(now)
    for (let item of userIDs) {
        let user_id = item['user_id']
        await db.updateLateStatusForUser(user_id, false)
        await db.addUserStatistics(user_id, date_today)
    }

    setTimeout(async () => {
        await createStatistics()
    },  (24*60 - (hours*60 + minutes)) * 60 * 1000)
}
createStatistics().then(res =>{console.log('done')})

