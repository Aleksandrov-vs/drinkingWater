const {Pool} = require('pg');


class Database {

    constructor(url) {
        try {
            this.pool = new Pool({
                connectionString: url,
                max: 20,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            })
            console.log('Bot has connected to the database')
        } catch (e) {
            console.log('error connecting to the database\n', e, '\n\n')
        }
    }

    async sessionExists(userId){
        const request = 'SELECT EXISTS (SELECT 1 FROM sessions WHERE telegram_id=($1));'
        try {
            const result = (await this.pool.query(request, [userId])).rows[0]
            return result.exists
        } catch (error) {
            console.log(error)
            return true
        }
    }

    async updateSession(userId, stage, state){
        const json = {[stage]: state}
        const request =  `UPDATE sessions SET session = session || $2 WHERE telegram_id = $1;`
        try {
            let res = await this.pool.query(request, [userId, json])
        } catch (error) {
            console.log(error)
            return false
        }
        return true
    }

    async createSession(userId) {
        const sessionExists = await this.sessionExists(userId)

        if (!sessionExists) {
            const request = 'INSERT INTO sessions (telegram_id) values (($1));'
            try {
                await this.pool.query(request, [userId])

            } catch (error) {
                console.log(error)
                return false
            }
            return true
        }
        return false
    }

    async getSession(userId){
        const request = 'SELECT session FROM sessions WHERE telegram_id = $1;'

        try {
            const result = (await this.pool.query(request, [userId])).rows[0].session
            return result
        }catch (err) {
            console.log(err)
            return 0
        }
    }

    async deleteUserRequest(userId){
        const request = "UPDATE sessions SET session= jsonb_set(session, '{UserRequest}', '{}') WHERE telegram_id = ($1);"
        try {
            const result = (await this.pool.query(request, [userId]))
            return result
        }catch (err) {
            console.log(err)
            return 0
        }
    }

    async updateUserRequest(userId, key, value ){
        const path = `{UserRequest,${key}}`
        const request = `UPDATE sessions SET session = jsonb_set(session, $2, '"${value}"'::jsonb, true) WHERE telegram_id = ($1);`
        try {
            const result = (await this.pool.query(request, [userId, path]))
            return result
        }catch (err) {
            console.log(err)
            return 0
        }
    }

    async addUser(userId, chatId, userRequest) {
        const userExists = await this.userExists(userId)

        if (!userExists) {
            const request = `INSERT INTO 
                                users(
                                user_name,
                                gender, 
                                quantity_hours,
                                weight,
                                required_volume_water,
                                notification_interval,
                                user_id,
                                chat_id
                                )
                                values ($1, $2, $3, $4, $5, $6, $7, $8);`
            const data = [
                userRequest['user_name'],
                userRequest['gender'],
                userRequest['quantity_hours'],
                userRequest['weight'],
                userRequest['required_volume_water'],
                userRequest['notification_interval'],
                userId,
                chatId]
            try {
                await this.pool.query(request, data)

            } catch (error) {
                console.log(error)
                return false
            }
            return true
        }
        return false
    }
    async updateUserInf(userId, chatId, userRequest) {
        const userExists = await this.userExists(userId)

        if (userExists){
            const request = `UPDATE users SET 
                                gender = $1, 
                                quantity_hours = $2,
                                weight = $3,
                                required_volume_water = $4,
                                notification_interval = $5
                                WHERE user_id = $6;`
            const data = [
                userRequest['gender'],
                userRequest['quantity_hours'],
                userRequest['weight'],
                userRequest['required_volume_water'],
                userRequest['notification_interval'],
                userId
            ]
            try {
                await this.pool.query(request, data)
            } catch (error) {
                console.log(error)
                return false
            }
            return true
        }
        return false
    }

    async userExists(userId){
        const request = 'SELECT EXISTS (SELECT 1 FROM users WHERE user_id=($1));'
        try {
            const result = (await this.pool.query(request, [userId])).rows[0]
            return result.exists
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async deleteUser(userId){
        const request = 'DELETE FROM users WHERE user_id = $1;'

        try {
            await this.pool.query(request, [userId])
        } catch (e) {
            console.log(e)
        }

    }

    async createAdmin(userId){
        const request = `UPDATE users SET permission = 'admin' WHERE user_id = $1;`
        try {
            const result = (await this.pool.query(request, [userId]))
            return result
        }catch (err) {
            console.log(err)
            return false
        }
    }


    async isAdmin(userId){
        const request = 'select * from isAdmin($1);'
        try{
            const result = (await this.pool.query(request, [userId])).rows[0]
            return result.isadmin
        }catch (e) {
            console.log(e)
            return false
        }
    }

    async getUserInf(userId){
        const request = 'SELECT * FROM users WHERE user_id = $1;'

        try {
            const result = (await this.pool.query(request, [userId])).rows[0]
            return result
        }catch (err) {
            console.log(err)
            return 0
        }
    }

    async getLaterUsers(now){
        const request = `
            SELECT
                user_id
            FROM
                users
            WHERE
                late_status = false
            AND
                $1 - last_drinking_date  > (5*1000)
            AND
                  notification_status = true;`

        try {
            const result = (await this.pool.query(request, [now])).rows[0]
            return result
        }catch (err) {
            console.log(err)
            return 0
        }
    }

    async getVolumeWaterDrunkForUser(userId){
        const request = 'SELECT volume_water_drunk FROM statistics WHERE user_id = $1 AND statistics.date = now()::date;'

        try {
            const result = (await this.pool.query(request, [userId])).rows[0]
            console.log('ad')
            return result['volume_water_drunk']
        }catch (err) {
            console.log(err)
            return 0
        }
    }


    async getRequiredVolumeForUser(userId){
        const request = 'SELECT required_volume_water FROM users WHERE user_id = $1;'

        try {
            const result = (await this.pool.query(request, [userId])).rows[0]
            console.log('ad')
            return result['required_volume_water']
        }catch (err) {
            console.log(err)
            return 0
        }
    }

    async updateRequiredVolumeWaterForUser(userId, volume){
        const request  = 'UPDATE users SET required_volume_water = $2 WHERE user_id = $1'
        try{
            const res = await this.pool.query(request, [userId, volume])
        }catch (err){
            console.log(err)
            return false
        }
        return true
    }

    async getQuantityIntakeWaterForUser(userId){
        const request = 'SELECT quantity_intake_water FROM statistics WHERE user_id = $1 AND statistics.date = now()::date;'

        try {
            const result = (await this.pool.query(request, [userId])).rows[0]
            return result['quantity_intake_water']
        }catch (err) {
            console.log(err)
            return 0
        }
    }

    async updateQuantityIntakeWaterForUser(userId, volume){
        const request  = 'UPDATE statistics SET quantity_intake_water = $2 WHERE user_id = $1 AND statistics.date = now()::date'
        try{
            const res = await this.pool.query(request, [userId, volume])
        }catch (err){
            console.log(err)
            return false
        }
        return true
    }

    async updateLastDrinkingDate(userId, time){
        const request  = 'UPDATE users SET last_drinking_date = $2 WHERE user_id = $1'
        try{
            const res = await this.pool.query(request, [userId, time])
        }catch (err){
            console.log(err)
            return false
        }
        return true
    }

    async updateLateStatusForUser(user_id, status){
        const request = 'UPDATE users SET late_status = $2 WHERE user_id = $1; '
        try{
            const result = (await this.pool.query(request, [user_id, status])).rows
            return result
        }catch (e) {
            console.log('updateLateStatusForUser', e)
            return false
        }

    }

    async getUserChatId(userId){
        if (await this.userExists(userId)){
            const request  = 'SELECT chat_id FROM users WHERE user_id = $1'
            try{
                const res = (await this.pool.query(request, [userId])).rows[0]

                return res.chat_id
            }catch (err){
                console.log(err)
                return false
            }
        }
    }

    async userStatisticsExists(userId, date){
        const request = 'SELECT EXISTS (SELECT 1 FROM statistics WHERE user_id=($1) and statistics.date=($2::date));'
        try {
            const result = (await this.pool.query(request, [userId, date])).rows[0]
            return result.exists
        } catch (error) {
            console.log(error)
            return true
        }
    }

    async addUserStatistics(userId, date){
        const statisticsExists = await this.userStatisticsExists(userId, date)

        if (!statisticsExists) {
            const request = `INSERT INTO statistics(user_id, date) VALUES ($1, $2);`
            try {
                await this.pool.query(request, [userId, date])

            } catch (error) {
                console.log(error)
                return false
            }
            return true
        }
        return false
    }

    async getUserStatistics(userId){
        const request = "SELECT EXTRACT(DAY FROM date) as day, EXTRACT(month FROM date) as month, quantity_intake_water, volume_water_drunk, completed_norm from statistics WHERE user_id=$1 AND statistics.date >= now()::date - interval '7 days' ORDER BY date DESC;"
        try{
            const res = (await this.pool.query(request, [userId])).rows
            return res
        }catch (err){
            console.log(err)
            return false
        }
    }

    async getAllUsersIds(){
        const request = 'SELECT user_id, user_name FROM users;'
        try{
            const res = (await this.pool.query(request)).rows
            return res
        }catch (err){
            console.log(err)
            return false
        }
    }

    async updateUserStatistics(userId, quantity_intake_water, volume_water_drunk, completed_norm){
        const request =`
            UPDATE
                statistics
            SET 
                quantity_intake_water = $1,
                volume_water_drunk = $2,
                completed_norm = $3
            WHERE user_id = $4 AND date = now()::date;`

        try {
            let res = await this.pool.query(request, [quantity_intake_water, volume_water_drunk, completed_norm, userId])
        } catch (error) {
            console.log(error)
            return false
        }
        return true
    }

    async getAllNotificationsForPartDay(partDay){
        const request = 'SELECT id, text FROM notifications WHERE part_day = $1;'
        try{
            const res = (await this.pool.query(request, [partDay])).rows
            return res
        }catch (err){
            console.log(err)
            return false
        }
    }

    async addNotification(text, part_day){

        const request = `INSERT INTO notifications(text, part_day) VALUES ($1, $2);`
        try {
            await this.pool.query(request, [text, part_day])
        } catch (error) {
            console.log(error)
            return false
        }
        return true
    }

    async deleteNotification(notifId){
        const request = 'DELETE FROM notifications WHERE id = $1;'

        try {
            await this.pool.query(request, [notifId])
        } catch (e) {
            console.log(e)
        }
    }

    async notificationExists(notificationId){
        const request = 'SELECT EXISTS (SELECT 1 FROM notifications WHERE id=($1));'
        try {
            const result = (await this.pool.query(request, [notificationId])).rows[0]
            return result.exists
        } catch (error) {
            console.log(error)
            return true
        }
    }
    async updateNotifStatusForUser(user_id, status) {
        const request = 'UPDATE users SET notification_status = $2 WHERE user_id = $1; '
        try {
            const result = (await this.pool.query(request, [user_id, status])).rows
            return result
        } catch (e) {
            console.log('updateNotifStatusForUser', e)
            return false
        }
    }

    async getNotificationStatus(userId){
        const request = 'SELECT notification_status FROM users WHERE user_id = $1;'
        try{
            const res = (await this.pool.query(request, [userId])).rows[0]
            return res['notification_status']
        }catch (err){
            console.log(err)
            return false
        }
    }

    async getNotificationInterval(userId){
        const request = 'SELECT notification_interval FROM users WHERE user_id = $1;'
        try{
            const res = (await this.pool.query(request, [userId])).rows[0]
            return res['notification_interval']
        }catch (err){
            console.log(err)
            return false
        }
    }

    async getAllTodayDataForUser(userId){
        const request = 'select * FROM users LEFT JOIN statistics s on users.user_id = s.user_id WHERE users.user_id = $1 AND s.date = now()::date;'
        try{
            const res = (await this.pool.query(request, [userId])).rows[0]
            return res
        }catch (err){
            console.log(err)
            return false
        }
    }
}

module.exports = Database
