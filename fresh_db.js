const {Pool} = require('pg');
const config = require('./config.json');



const commands = [
    'drop table IF EXISTS statistics;',
    'drop table IF EXISTS users;',
    'drop table IF EXISTS sessions;',
    'drop table IF EXISTS notifications;',

    `CREATE TABLE users
    (
        user_name VARCHAR(255) NOT NULL,
        gender  VARCHAR(1) DEFAULT 'u',
        quantity_hours FLOAT DEFAULT 0,
        weight FLOAT NOT NULL, 
        required_volume_water FLOAT NOT NULL,
        notification_interval INTEGER DEFAULT 3,
        last_drinking_date BIGINT,
        late_status  BOOLEAN NOT NULL DEFAULT FALSE,
        user_id integer PRIMARY KEY,
        chat_id integer NOT NULL,
        permission VARCHAR(30) DEFAULT 'client'
    );`,
    `CREATE TABLE sessions
    (
        telegram_id integer NOT NULL UNIQUE,
        session JSONB DEFAULT '{"previousStep": "start", "Stage": "start","UserRequest": {} }'
    );
    `,
    `
    CREATE TABLE statistics
    (
        user_id INTEGER NOT NULL,
        date DATE NOT NULL,
        quantity_intake_water INTEGER DEFAULT 0,
        volume_water_drunk FLOAT DEFAULT 0,
        completed_norm BOOLEAN DEFAULT false,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON UPDATE CASCADE ON DELETE CASCADE
    );
    `,`
    CREATE TABLE notifications
    (
        id serial PRIMARY KEY,
        part_day VARCHAR(20) NOT NULL,
        text VARCHAR(500) NOT NULL
    );
    `,
    `
    CREATE OR REPLACE FUNCTION isAdmin(userId int)
    RETURNS BOOLEAN as
    $body$
        BEGIN
            IF (SELECT  permission FROM users WHERE user_id = userId) = 'admin' THEN
                RETURN TRUE;
            ELSE
                RETURN FALSE;
            END IF;
        END
    $body$
    LANGUAGE 'plpgsql' ;
    `,
    `INSERT INTO notifications(text, part_day) VALUES ('Выпейте воды, чтобы поддержать свой водный баланс', 'morning');`,
    `INSERT INTO notifications(text, part_day) VALUES ('Больше разнообразия! добавите в воду свежий лимон, листья мяты, ягоды', 'afternoon');`,
    `INSERT INTO notifications(text, part_day) VALUES ('Не забудете выпить стакан воды', 'evening');`,
    `GRANT ALL PRIVILEGES ON TABLE users TO ${config.db_user};`,
    `GRANT ALL PRIVILEGES ON TABLE sessions TO ${config.db_user};`,
    `GRANT ALL PRIVILEGES ON TABLE statistics TO ${config.db_user};`,
    `GRANT ALL PRIVILEGES ON TABLE notifications TO ${config.db_user};`,


]
pool = new Pool({connectionString: config.databaseURL})



const fresh_database = async ()=> {
    const n = commands.length
    for (let i = 0; i < n; i++) {
        console.log(commands[i])
        await pool.query(commands[i])
            .then(res => {
                console.log('done')
            })
            .catch(err => {
                console.log(err)
            });
    }
    await pool.end()
    return 0
}

async function main() {
    await fresh_database().then(res =>{console.log(res)});
    return 0
}

main()
    .then(res=>{
        console.log('ok')
    });
