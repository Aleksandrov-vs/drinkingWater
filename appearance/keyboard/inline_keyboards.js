module.exports = {
    choice_gender : [
        [
            {
                text: 'мужской',
                callback_data: 'choiceGender_m'
            },
            {
                text: 'женский',
                callback_data: 'choiceGender_f'
            }
        ]
    ],
    choice_interval : [
        [
            {
                text: 'раз в три часа',
                callback_data: 'choiceInterval_def'
            },
            {
                text: 'свое время',
                callback_data: 'choiceInterval_custm'
            }
        ]
    ],
    change_notifications : [
        [
            {
                text: 'удалить фразу',
                callback_data: 'deleteNotif'
            }
        ],
        [
            {
                text: 'добавить фразу',
                callback_data: 'addNotif'
            }
        ]
    ],
    choice_part_day : [
        [
            {
                text: 'утро',
                callback_data: 'addToGroup_morning'
            }
        ],
        [
            {
                text: 'день',
                callback_data: 'addToGroup_afternoon'
            }
        ],
        [
            {
                text: 'вечер',
                callback_data: 'addToGroup_evening'
            }
        ]
    ],
    choice_drink : [
            [
                {
                    text: 'сок',
                    callback_data: 'choiceDrink_juice'
                }
            ],

            [
                {
                    text: 'вода с газом/без газа',
                    callback_data: 'choiceDrink_water'
                }
            ],
            [
                {
                    text: 'чай черный/зеленый',
                    callback_data: 'choiceDrink_tea'
                }
            ],
            [
                {
                    text: 'газировка',
                    callback_data: 'choiceDrink_soda'
                }
            ],
            [
                {
                    text: 'кофе',
                    callback_data: 'choiceDrink_coffee'
                }
            ],
        [
            {
                text: 'молоко',
                callback_data: 'choiceDrink_milk'
            }
        ]
    ]
}


module.exports.createInfMsgKeyboard = function createInfMsgKeyboard(notifStatus){
    let text = ''
    let callbackQuery = ''
    if (notifStatus === false){
        text = 'включить уведомления'
        callbackQuery = 'enableNotif'
    } else {
        text = 'выключить уведомления'
        callbackQuery = 'disableNotif'
    }

    return [
        [
            {
                text: 'изменить данные о себе',
                callback_data: 'changeUserInf'
            }
        ],
        [
            {
                text: 'указать другое количество воды в сутки',
                callback_data: 'changeRequiredVolume'
            }
        ],
        [
            {
                text: `${text}`,
                callback_data: `${callbackQuery}`
            }
        ]

    ]
}

