var SHA256 = require("crypto-js/sha256");

var message = 'password';
var hash = SHA256(message).toString();

console.log(message);
console.log(hash);


var data = {
    id: 4
};

var token = {
    data: data,
    hash: SHA256(JSON.stringify(data) + 'just add some shit').toString()
};

var resultHsash = SHA256(JSON.stringify(token.data) + 'just add some shit').toString();

if (resultHsash === token.hash){
    console.log('it is the same');
}else {
    console.log('it isn:t same');
}

