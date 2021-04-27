const utils = require('../../src/utils');

async function getUserListForStoreMSG(db) {

    const allUsers = await db.getAllUsersIds()

    let msg  = '<b>ПОЛЬЗОВАТЕЛИ:</b>\n\n' +
        '<code><b>TELEGRAM ID</b>   |    <b>NAME</b>         \n'+ '-'.repeat(30) + '</code>\n'

    allUsers.forEach((user, i, array)=>{
        msg = msg +
            '<code>'+ utils.formatString(`${user.user_id}`, 12) +
            '  |   '+
            utils.formatString(`${user.user_name}`, 15) + '</code>'+
            '\n'
    });
    return msg
}

module.exports = getUserListForStoreMSG
