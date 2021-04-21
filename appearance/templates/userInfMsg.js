

function createUserInfMsg(userData) {
    let gender = 'не указан'
    if(userData['gender'] === 'f'){
        gender = 'женский'
    } else if(userData['gender'] === 'm'){
        gender = 'мужской'
    }

    let msg  =`<b>данные для ${userData['user_name']}</b>\n
<b>имя</b>: ${userData['user_name']} 
<b>пол</b>: ${gender}
<b>время занятий спортом</b>: ${userData['quantity_hours']} часа в день
<b>ваш вес</b>: ${userData['weight']} кг
<b>частота получения уведомлений</b>: раз в ${userData['notification_interval']} часа

Мы советуем вам принимать <u>${userData['required_volume_water']} литров</u> воды в сутки!
`
    return msg
}

module.exports = createUserInfMsg
