


function checkInt(value) {
    value = value.toString()
   if(/^[0-9]+$/.test(value)) {
       value = parseInt(value)
       value = parseInt(value.toFixed(2))
       return value
   }else{
       return false
   }
}

console.log(checkInt(123))
console.log(checkInt('1233123'))
console.log(checkInt('12313123.1313'))
console.log(checkInt('ssfefsef123fdssf'))
console.log(checkInt('123sa'))
