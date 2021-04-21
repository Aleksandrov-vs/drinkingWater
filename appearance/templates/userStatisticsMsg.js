function createUserStatisticsMsg(userData) {
    let sum_intake = 0
    let sum_volume_drunk = 0
    let sum_completed_norm = 0



    let daily_statistics  =``

    for(let i in userData){
        let day_statistics_obj  = userData[i]
        sum_intake += day_statistics_obj['quantity_intake_water']
        sum_volume_drunk += day_statistics_obj['volume_water_drunk']
        if(day_statistics_obj['completed_norm']) {
            sum_completed_norm += 1
        }
        daily_statistics+=`
${day_statistics_obj.day}.${day_statistics_obj.month}
вы пили воду: ${day_statistics_obj['quantity_intake_water']} раз
вы выпили: ${day_statistics_obj['volume_water_drunk']} литров
вы выполнили норму: ${day_statistics_obj['completed_norm']}
`
    }

    let all_statistics = `
    \t<b>ваша стастистика</b>\n
за последние 7 дней вы выпили: ${sum_volume_drunk} литров
за последние 7 дней вы пили: ${sum_intake} раз
за последние 7 дней вы выполнили норму: ${sum_completed_norm} раз

статистика по дням
    `
    return all_statistics + daily_statistics
}

module.exports = createUserStatisticsMsg
