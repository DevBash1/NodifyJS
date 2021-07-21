//Define Enviroment for detecting nodify
window.env = "nodify";
let __dirname = undefined;
let __filename = undefined;

window.addEventListener('error', function(e) {//catch errors
}, false);

var customModules = [];
var customFunctions = [];
var found = false;

//man arrays
let manModules = [];
let manHelps = [];

function use(url) {
    try {
        let head = document.getElementsByTagName("head")[0];
        let script = document.createElement("script");

        if (window.XMLHttpRequest) {
            // code for modern browsers
            xh = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            xh = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xh.onload = function() {
            if (xh.status == 200) {
                res = xh.responseText;
                script.src = "data:application/javascript;base64," + btoa(res);
                head.appendChild(script);
            } else {
                res = "Failed to Load : " + url;
                console.warn(res);
            }
        }
        xh.open("GET", url, false);
        xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xh.send();
    } catch (e) {}
}

function addCache(str) {
    let cached = localStorage.getItem("node_cached_modules");

    if (cached != null) {
        cached = cached.split(",");
        if (!cached.includes(str)) {
            cached.push(str);
            localStorage.setItem("node_cached_modules", cached.join(","));
        }
    } else {
        localStorage.setItem("node_cached_modules", str);
    }
}

function ajaxSync(json) {
    json = JSON.stringify(json);
    let res = "";
    var data = JSON.parse(json);
    var url = data.url;
    var type = data.type;
    var params = data.params.toString();

    if (window.XMLHttpRequest) {
        // code for modern browsers
        xh = new XMLHttpRequest();
    } else {
        // code for old IE browsers
        xh = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xh.onload = function() {
        if (xh.status == 200) {
            res = xh.responseText;
        } else {
            res = "Module Import Error: " + xh.status;
            console.warn(res);
        }
    }
    xh.onerror = function(){
        console.warn("Could Not Load Module from '"+url+"'");
        return false;
    }
    if (type.toLowerCase() == "get") {
        xh.open(type, url, false);
        xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        try{
            xh.send();
        }catch(e){
            console.warn("Could Not Load Module from '"+url+"'");
            return false;
        }
    } else if (type.toLowerCase() == "post") {
        xh.open(type, url, false);
        xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xh.send(params);
    } else {
        throw ("Can only take GET and POST");
    }
    return res;
}

//Avoid Errors
function module() {
    this.exports = {}
}
module.exports = false;

function getFunction(func, script) {
    let scriptBuilder = "";

    var searching = 0;
    var stopedAt = 0;
    var line = 0;
    var stop = false;
    var bracket1 = 0;
    var bracket2 = 0;

    var word = func;

    for (j = 0; j < script.length; j++) {
        stop = false;
        bracket1 = 0;
        bracket2 = 0;
        codeInline = script[j];

        if (codeInline.includes('function ' + word + '(') || codeInline.includes(word + ' = (') || codeInline.includes('func ' + word + '(') || codeInline.includes(word + ' = (')) {
            found = true;
            codeInline = "(" + codeInline;
            while (!stop) {
                codeInline = script[j];

                if (codeInline.includes('}') && codeInline.includes('{') && !codeInline.startsWith('//')) {
                    bracket1++;
                    bracket2++;
                } else if (codeInline.endsWith('{') && !codeInline.startsWith('//')) {
                    bracket1++;
                } else if (codeInline.includes('}') && !codeInline.endsWith(';') && !codeInline.startsWith('//')) {
                    bracket2++;
                }

                if (bracket1 == bracket2 && (bracket1 + bracket2) % 2 == 0) {
                    stop = true;
                    codeInline = codeInline + ")";
                }
                scriptBuilder += (codeInline + '\n');
                j++;
            }
            stopedAt = j + 1;
        } else if (codeInline.includes("var " + word + " = {") || codeInline.includes("let " + word + " = {") || codeInline.includes("const " + word + " = {")) {
            found = true;
            while (!stop) {
                codeInline = script[j];
                if (codeInline == undefined) {
                    codeInline = "";
                    stop = true;
                }

                if (codeInline.includes('}') && codeInline.includes('{') && !codeInline.startsWith('//')) {
                    bracket1++;
                    bracket2++;
                } else if (codeInline.endsWith('{') && !codeInline.startsWith('//')) {
                    bracket1++;
                } else if (codeInline.includes('}') && !codeInline.endsWith(';') && !codeInline.startsWith('//')) {
                    bracket2++;
                }

                if (bracket1 == bracket2 && (bracket1 + bracket2) % 2 == 0) {
                    stop = true;
                }
                scriptBuilder += (codeInline + '\n');
                j++;
            }
            stopedAt = j + 1;
        } else {
            scriptBuilder += codeInline + "\n";
        }
        searching++;
    }
    return scriptBuilder;
}

function require(name) {
    //declare custom modules inside here to 
    //avoid exposure to global

    function node_module0(module=false) {
        self = this;
        this.getHelp = function(name) {
            help = manHelps[manModules.indexOf(name)];
            if (help != undefined) {
                return help;
            } else {
                return false;
            }
        }
        this.addHelp = function(module, help) {
            if (!manModules.includes(module)) {
                manModules.push(module);
                manHelps.push(help);
            }
        }
        if (module) {
            help = this.getHelp(module);
            if (help) {
                console.log(help);
            } else {
                console.warn("No Entry for '" + module + "'")
            }
        }
    }
    //add to global
    window.man = node_module0;
    //push module
    customModules.push("man");
    customFunctions.push(node_module0);

    //custom modules
    function node_module1() {
        return navigator;
    }
    //push module
    customModules.push("browser");
    customFunctions.push(new node_module1);

    function node_module2() {
        thisCache = this;
        this.getCaches = function() {
            let cache = localStorage.getItem("node_cached_modules");
            if (cache != null) {
                return cache.split(",");
            } else {
                return [];
            }
        }
        this.isCached = function(name) {
            let cache = localStorage.getItem("node_cached_modules");
            if (cache != null) {
                return cache.split(",").includes("node_" + name);
            } else {
                return false;
            }
        }
        this.clearCache = function(name) {
            let cache = localStorage.getItem("node_cached_modules");
            if (cache != null) {
                let caches = cache.split(",");
                if (caches.includes("node_" + name)) {
                    caches.splice(caches.indexOf("node_" + name), 1);
                    localStorage.setItem("node_cached_modules", caches.join(","))
                    localStorage.removeItem("node_" + name);
                }
            }
        }
        this.clearAllCache = function() {
            let caches = localStorage.getItem("node_cached_modules").split(",");
            caches.forEach(function(i) {
                thisCache.clearCache(i);
            })
        }
    }
    //push module
    customModules.push("node_cache");
    customFunctions.push(new node_module2);

    function node_module3(elem) {
        return document.createElement(elem);
    }
    //push module
    customModules.push("element");
    customFunctions.push(node_module3);

    function node_module4(param) {
        return new Notification(param);
    }
    //push module
    customModules.push("notification");
    customFunctions.push(node_module4);

    function node_module5(param) {
        navigator.vibrate(param);
    }
    //push module
    customModules.push("vibrate");
    customFunctions.push(node_module5);

    function node_module6(param) {
        navigator.share(param);
    }
    //push module
    customModules.push("share");
    customFunctions.push(node_module6);

    function node_module7() {
        navigator.buildID;
    }
    //push module
    customModules.push("buildID");
    customFunctions.push(node_module7);

    function node_module8() {
        console.clear();
    }
    //push module
    customModules.push("clear");
    customFunctions.push(node_module8);

    function node_module9() {
        this.on = function(time, func, repeat=false) {
            if (repeat) {
                return setInterval(func, time);
            } else {
                return setTimeout(func, time);
            }
        }
        this.every = function(time, func) {
            return setInterval(func, time);
        }
        this.once = function(time, func) {
            return setTimeout(func, time);
        }
    }
    //push module
    customModules.push("timer");
    customFunctions.push(node_module9);

    function node_module10(code) {
        try {
            var ls_wrap = new lilscript();
        } catch (e) {
            console.warn("LilScript Not Linked");
            return false;
        }
        code = ls_wrap.run(code);
        eval(code);
    }
    //push module
    customModules.push("lilscript");
    customFunctions.push(node_module10);

    //add description to man
    m = new man();
    m.addHelp("lilscript", "A LilScript wrapper for running LilScript code on nodify\n\t by Dev Bash")

    function node_module11() {
        debugger ;
    }
    //push module
    customModules.push("debug");
    customFunctions.push(node_module11);

    function node_module12(json) {
        var data = json;
        var url = data.url;
        var type = data.type;
        var params = data.params.toString();

        if (window.XMLHttpRequest) {
            // code for modern browsers
            xh = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            xh = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (type.toLowerCase() == "get") {
            xh.open(type, url, true);
            xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xh.send();
        } else if (type.toLowerCase() == "post") {
            xh.open(type, url, true);
            xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xh.send(params);
        } else {
            throw ("Can only take GET and POST");
        }
        xh.onload = function() {
            if (xh.status == 200) {
                if (data.success != undefined) {
                    data.success(xh.responseText);
                }
            } else {
                if (data.error != undefined) {
                    data.error(xh.responseText);
                }
            }
        }
        xh.onerror = function() {
            if (data.error != undefined) {
                data.error(xh.responseText);
            }
        }
    }
    //push module
    customModules.push("ajax");
    customFunctions.push(node_module12);

    function node_module13(json) {
        json = JSON.stringify(json);
        let res = "";
        var data = JSON.parse(json);
        var url = data.url;
        var type = data.type;
        var params = data.params.toString();
        

        if (window.XMLHttpRequest) {
            // code for modern browsers
            xh = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            xh = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xh.onload = function() {
            if (xh.status == 200) {
                res = xh.responseText;
            } else {
                res = "error: " + xh.status;
            }
        }
        if (type.toLowerCase() == "get") {
            xh.open(type, url, false);
            xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xh.send();
        } else if (type.toLowerCase() == "post") {
            xh.open(type, url, false);
            xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xh.send(params);
        } else {
            throw ("Can only take GET and POST");
        }
        return res;
    }
    //push module
    customModules.push("ajaxSync");
    customFunctions.push(node_module13);

    function node_module14(text) {
        let elems = document.querySelectorAll("*");
        let len = elems.length;
        let value = text.trim();

        let elems_found = [];

        for (i = 0; i < len; i++) {
            let elem = elems[i];
            if (elem.value != undefined && (elem.value != 0 && elem.tagName.toLowerCase() != "li")) {
                if (elem.value.trim() == value) {
                    elems_found.push(elem);
                }
            }
            if (elem.innerHTML != undefined) {
                if (elem.innerHTML.trim() == value) {
                    elems_found.push(elem);
                }
            }
        }
        if (elems_found.length == 0) {
            return null;
        }
        return elems_found;
    }
    //push module
    customModules.push("finds");
    customFunctions.push(node_module14);

    function node_module15(text) {
        let elems = document.querySelectorAll("*");
        let len = elems.length;
        let value = text.trim();

        let val_elems = ["input", "textarea", "button", "option", "progress", "li", "meter", "param"];
        let elem_found;

        for (i = 0; i < len; i++) {
            let elem = elems[i];
            if (elem.value != undefined && (elem.value != 0 && elem.tagName.toLowerCase() != "li")) {
                if (elem.value.trim() == value) {
                    elem_found = elem;
                    i = len;
                }
            }
            if (elem.innerHTML != undefined) {
                if (elem.innerHTML.trim() == value) {
                    elem_found = elem;
                    i = len;
                }
            }
        }
        if (elem_found == undefined) {
            return null;
        }
        return elem_found;
    }
    //push module
    customModules.push("find");
    customFunctions.push(node_module15);

    let app;

    let appURL = location.protocol + "//" + location.host + "/app.json";

    //Load from url first
    
    app = ajaxSync({
        url: appURL,
        type: "GET",
        params: ""
    });

    //Get from cache
    
    if (app.startsWith("Module Import Error:")) {
        //try to use cache
        let cached = localStorage.getItem("node_app.json");
        if(cached != null){
            app = cached;
        }else{
            console.warn("app.json could not be loaded");
            return false;
        }
    } else {
        //cache app.json
        localStorage.setItem("node_app.json", app);
    }

    let file;

    let json = JSON.parse(app);

    if (customModules.includes(name)) {
        let __dirname = location.href;
        __filename = name;
        return customFunctions[customModules.indexOf(name)];
    } else if (name.startsWith("http://") || name.startsWith("https://") || name.includes("/")) {
        __filename = name.substring(name.lastIndexOf("/")+1,name.length);

        if (__dirname == undefined) {
            __dirname = name.substring(0, name.lastIndexOf("/"));
        }
        let newName;
        if (name.trim().startsWith("./")) {
            newName = __dirname + name.trim().substring(1, name.length);
        } else {
            newName = name;
        }
        if (!name.substring(name.lastIndexOf("/"), name.length).includes(".")) {
            newName = newName + ".js";
            __filename = __filename + ".js";
        }

        let response = ajaxSync({
            url: newName,
            type: "GET",
            params: ""
        });
        
        //Catch Error and return false
        if(response == false){
            return false;
        }

        //Cache Module
        if (!response.startsWith("Module Import Error:")) {
            localStorage.setItem("node_" + name, response);
            addCache("node_" + name);
            file = response;
        } else {
            //Get from cache
            let cached = localStorage.getItem("node_" + name);
            if (cached != null) {
                file = cached;
            } else {
                console.warn("Module from '" + name + "' Failed to Load!");
                return false;
            }
        }
    } else {
        if (json.modules == undefined) {
            console.warn("Modules Not Found!");
            return false;
        } else {
            __dirname = json.where;
            __filename = json.modules[name];
            let modules = Object.keys(json.modules);

            if (modules.includes(name)) {
                if (json.cache == true) {
                    //Get from cache
                    let cached = localStorage.getItem("node_" + name);
                    if (cached != null) {
                        file = cached;
                        //Update cache
                        let where = json.where;
                        if (where == undefined) {
                            where = "";
                        }

                        let url = where + json.modules[name];

                        node_module12({
                            url: url,
                            type: "GET",
                            params: "",
                            success: function(res) {
                                //Add new request to cache
                                localStorage.setItem("node_" + name, res);
                                addCache("node_" + name);
                            }
                        })
                    } else {
                        let where = json.where;
                        if (where == undefined) {
                            where = "";
                        }

                        let url = where + json.modules[name];
                        file = ajaxSync({
                            url: url,
                            type: "GET",
                            params: "",
                        });
                        //Cache Module
                        if (!file.startsWith("Module Import Error:")) {
                            localStorage.setItem("node_" + name, file);
                            addCache("node_" + name);
                        } else {
                            console.warn("Module '" + name + "' Not Found!");
                            return false;
                        }
                    }
                } else {
                    let where = json.where;
                    if (where == undefined) {
                        where = "";
                    }

                    let url = where + json.modules[name];

                    file = ajaxSync({
                        url: url,
                        type: "GET",
                        params: "",
                    });
                    //Cache Module
                    if (!file.startsWith("Module Import Error:")) {
                        localStorage.setItem("node_" + name, file);
                        addCache("node_" + name);
                    }
                    if (file.startsWith("Module Import Error:")) {
                        //try to get cache if loading module fails

                        //Get from cache
                        let cached = localStorage.getItem("node_" + name);
                        if (cached != null) {
                            file = cached;
                        } else {
                            console.warn("Module '" + name + "' Not Found!");
                            return false;
                        }
                    }
                }
            } else {
                console.warn("Module '" + name + "' Not Found!");
                return false;
            }
        }
    }

    //This works by God's Grace

    try {
        if (file.includes("module.exports =")) {
            try {
                return eval(file);
            } catch (e) {
                throw(e);
            }
        } else if (file.trim().startsWith("{") && file.trim().endsWith("}")) {
            try {
                return JSON.parse(file);
            } catch (e) {
                throw (e);
            }
        } else {
            return file;
        }
    } catch (e) {
        if (json.modules[name] != undefined) {
            let err = (e.toString() + "\n\tat (" + json.modules[name] + ")");
            console.warn("Error From '" + json.modules[name] + "'");
            console.error(err);
            return false;
        } else {
            let err = (e.toString() + "\n\tat (" + name + ")");
            console.warn("Error From '" + name + "'");
            console.error(err);
            return false;
        }
    }
}

//Add process

let process = {
    env: env,
    version: "1.0.0",
    platform: navigator.platform,
    browser: {
        brand: navigator.userAgentData.brands,
        vendor: navigator.vendor,
    }
}
window.process = process;

//built in functions

function print(...str) {
    console.log(...str);
}
window.print = print;
