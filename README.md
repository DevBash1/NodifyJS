# NodifyJS

NodifyJS is a javascript library that allows you use require
and module.exports just like we use in NodeJs.
This helps us organize our codes and break them into many js files.
It also allows frontend developers enjoy the features of NodeJs from there browser.

## Installation

Add NodifyJs in the bottom of the body Tag.

```html
<script src="/path/to/nodify.js"></script>
```

## Usage

You can now use require and export codes like you would on NodeJs.

Example of timer in nodify.
Note: timer is a built-in module in NodifyJS.

```javascript
let timer = require("timer");
let tm = new timer();

let sec = 0;

tm.on(1000,function(){
    sec++;
    console.log(sec);
},true);

```

Example of NodifyJS

math.js
```javascript
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
```

script.js
```javascript
let {sum} = require("/math.js");

sum(1,9) //10
```
You can also require from a URL.

db.js
```javascript
let nodb = require("https://raw.githubusercontent.com/DevBash1/NoDB/main/JavaScript/nodb.js");


let db = new nodb({
    database:"myDB",
    path:"myDB.nodb",
    encrypt:true,
    password: "12345678",
})

module.exports = db;
```

You can create a json file in the root directory.
Then declare your modules there with there names and require them with there names.
Set "where" to tell NodifyJS which directory holds the modules.


app.json
```javascript
{
  "name": "My App",
  "version": "1.0.0",
  "description": "My NodifyJS App",
  "cache": false,
  "where":"/",
  "modules":{
      "print":"print.js",
      "math":"math.js",
      "hook":"hook.js",
  }
}

```
Then import math like this

main.js
```javascript
let math = require("math");

math.sub(6,1) //5
```

app.json has other configuration that you use to do other things.
Example:

The "cache" options tells NodifyJS to use the cached modules if a module has been used before.
The "cache" option takes a boolean(true/false)
Setting it to false does not mean NodifyJS will not cache modules or use cached modules.

This is how NodifyJS works with cache to get a better understanding.

if "cache" is set to true,
NodifyJS will first check if there is a cached version of the module.
if there is,
then it is used.
if there is not, 
then it sends a request for the module.

if "cache" is set to false,
NodifyJS will first send a request for a module.
if the request fails it will use cache if any is found.


# This are some of the custom modules.

## timer
## ajax
## ajaxSync
## element
## find
## finds
## node_cache
## lilscript
## clear
## share
## vibrate
## notification
## browser
## man


There will be more features soon.
Happy Coding!

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://github.com/DevBash1/NodifyJS/blob/main/LICENSE)
