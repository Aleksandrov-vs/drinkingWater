function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function formatString(str, max_length){
    let string = String(str)
    const my_length = string.length
    if(my_length > max_length){
        string = string.substring(0, max_length - 3) + '...'
    } else{
        const spaces = ' '.repeat(max_length - my_length)
        string += spaces
    }
    return string
}

function checkFloat(value, min = 0 , max = 24) {
    value = value.toString()
    value = value.replace(',', '.')
    if(/^[0-9.]+$/.test(value)) {
        value = parseFloat(value)
        if(min <= value && value <= max){
            value = parseFloat(value.toFixed(2))
            return value
        }else{
            return false
        }
    }else{
        return false
    }
}

function checkInt(value, min = 0 , max = 24) {
    value = value.toString()
    if(/^[0-9]+$/.test(value)) {
        value = parseInt(value)
        if(min <= value && value <= max) {
            value = parseInt(value.toFixed(2))
            return value
        }else{
            return false
        }
    }else{
        return false
    }
}

module.exports.formatString = formatString
module.exports.formatDate = formatDate
module.exports.getRandomInt = getRandomInt
module.exports.checkFloat = checkFloat
module.exports.checkInt = checkInt
