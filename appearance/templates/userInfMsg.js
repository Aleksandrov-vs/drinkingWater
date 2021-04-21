

function createUserInfMsg(userData) {
    let gender = 'не указан'
    if(userData['gender'] === 'f'){
        gender = 'женский'
    } else if(userData['gender'] === 'm'){
        gender = 'мужской'
    }

    let msg  =`<b>вы указали данные</b>
имя: ${userData['user_name']}
пол: ${gender}
время занятием спорта: ${userData['quantity_hours']}
ваш вес: ${userData['weight']}
частота получения уведомлений: ${userData['notification_interval']}

Мы советуем вам принимать ${userData['required_volume_water']} литров воды в сутки
`
    return msg
}

module.exports = createUserInfMsg
