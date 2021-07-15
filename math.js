var log = require("print");

function sum(num1,num2){
    log(num1+num2);
}

function sub(num1,num2){
    log(num1-num2);
}

module.exports = {
    sum,
    sub
}