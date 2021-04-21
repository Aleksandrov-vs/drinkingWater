const utility = require('../../src/utility');



async function createNotificationsListMSG(db) {
    let msg  = ''
    let notifications = await db.getAllNotificationsForPartDay('morning')
    msg += listNotifForPartDay(notifications, 'УТРО')

    notifications = await db.getAllNotificationsForPartDay('afternoon')
    msg += listNotifForPartDay(notifications, 'ДЕНЬ')

    notifications = await db.getAllNotificationsForPartDay('evening')
    msg += listNotifForPartDay(notifications, 'ВЕЧЕР')

    return msg
}

function listNotifForPartDay(notifications, partDay) {
    let msg = `<b>${partDay}:</b>\n\n` +
    '<code><b>ID</b> |    <b>NAME</b>         \n'+ '-'.repeat(30) + '</code>\n'

    notifications.forEach((notif, numberNotif, array)=>{
        msg += '<code>'
        for(let numberStr = 0; numberStr < (notif.text.length/26); numberStr++){
            let id = '   '
            if(numberStr == 0){
                id = utility.formatString(notif.id, 3)
            }
            msg += `<code>`+`${id}|</code>` + notif.text.substring(26*numberStr, 26*numberStr + 26) + '\n'
        }
        msg += '-'.repeat(30) + '</code>\n'
    });
    return msg
}

module.exports = createNotificationsListMSG
