function createUserStatisticsMsg(userData) {
    let sum_intake = 0
    let sum_volume_drunk = 0
    let sum_completed_norm = 0
    let daily_statistics  =``

    for(let i in userData){
        let day_statistics_obj  = userData[i]
        let compl_norm_text = 'нет('
        sum_intake += day_statistics_obj['quantity_intake_water']
        sum_volume_drunk += day_statistics_obj['volume_water_drunk']
        if(day_statistics_obj['completed_norm']) {
            sum_completed_norm += 1
            compl_norm_text = 'ДА!'
        }
        daily_statistics+=`
${day_statistics_obj.day}.${day_statistics_obj.month}
вы пили воду: ${day_statistics_obj['quantity_intake_water']} раз
вы выпили: ${day_statistics_obj['volume_water_drunk']} литров
вы выполнили норму: ${compl_norm_text}
`
    }

    let all_statistics = ` 
       <b>СТАТИСТИКА</b>\n
за последние 7 дней вы:
выпили <b>${sum_volume_drunk}</b> литров 'воды'
пили <b>${sum_intake}</b> раз
выполнили норму <b>${sum_completed_norm}</b> раз

       <b>СТАТИСТИКА ПО ДНЯМ</b>
    `
    return all_statistics + daily_statistics
}

module.exports = createUserStatisticsMsg
