console.log ("Activate xD");

console.log (CryptoJS.MD5("test"));

document.body.style.border = "5px solid red";

var ks_form = document.getElementById("formVerify");
var ks_keywords = ks_form.getElementsByTagName("span");
var keywords = []
keywords[0] = ks_keywords[0].innerText;
keywords[1] = ks_keywords[1].innerText;

console.log (`Keywords to find: ${keywords}`);

var ks_imgs = ks_form.getElementsByTagName("img");
var img_md5s = [];

for (var i = 0; i < ks_imgs.length; i++) {
	ks_imgs[i].onclick = callback;
	// ks_imgs[i].addEventListener("click", callback);
	// console.log(ks_imgs[ind].onclick);
}

var global_mapping = {};
var state = 0;

function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function loadImage(path, handler, id) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
	    if (this.readyState == 4 && this.status == 200){
	        //this.response is what you're looking for
	        // handler(this.response);
			// console.log("Got Response")
			handler(this.response, id);
	    }
	}
	xhr.open('GET', path);
	xhr.send();
}

function onImg(img, id) {
	img_md5s[id] = CryptoJS.MD5(img).toString();
	// console.log (`${id}: ${img_md5s[id]}`);
	if (img_md5s.length === ks_imgs.length) {
		console.log("All image MD5s calculated");
		allImagesLoaded();
	} 
}

function onGot(item) {

	if (item["mapping"] == undefined) {
		console.log("First run of the extension, creating storage data");
		// notFound(item);
		var url = browser.extension.getURL("content/learnt.json");
		// console.log(url);
		loadJSON(url, function(data) {global_mapping = data; console.log(data);}, function(xhr) {console.log(xhr); })		
		return;
	}

	console.log ("Got item from localStorage")
	var mapping = JSON.parse(JSON.stringify(item["mapping"]));
	global_mapping = mapping;
	console.log ("Parsing done");

	for (var i = 0; i < ks_imgs.length; i++) {
		var url = window.location.protocol + "//" + window.location.hostname + ks_imgs[i].getAttribute("src");
		loadImage(url, onImg, i);
		// console.log (`Retrieving ${url}`);
	}
}

function revSearchOnMultimap(map, keyword) {
 	var result = [];
 	for (var idx in map) {
 		if (map[idx].indexOf(keyword) !== -1) {
 			result.push(idx);
 		}
 	}

 	return result;
}

function allImagesLoaded() {
	console.log(`Checking whether ${keywords[0]} is in mapping`);

	var res = revSearchOnMultimap(global_mapping, keywords[0]);
	if (res.length === 0) {
		console.log ("Not found. Continuing to wait for user input...");
	}
	else {
		console.log ("Found entries. Acting on it.");
		for (var i = 0; i < res.length; i++) {
			var pos = img_md5s.indexOf(res[i]);
			if (pos !== -1) {
				console.log(`Clicking ${pos} image`);
				ks_imgs[pos].click();

				console.log(`Checking whether ${keywords[1]} is in mapping`);
				var res2 = revSearchOnMultimap(global_mapping, keywords[1]);
				if (res2.length !== 0) {
					for (var j = 0; j < res.length; j++) {
						pos = img_md5s.indexOf(res[j]);
						if (pos !== -1) {
							console.log(`Clicking ${pos} image`);
							ks_imgs[pos].click();
							break;
						}
					}
				}
				break;
			}
		}
	}
}

function onError(error) {
  console.log(`Error: ${error}`);
}

// if first time running the extension
function notFound(error) {
	let setting = browser.storage.sync.set({"mapping" : global_mapping});
	setting.then(reRunOnGot, onError);
}

function reRunOnGot() {
	let gettingItem = browser.storage.sync.get();
	gettingItem.then(onGot, onError);
}

function callback(event) {
	var img = event.target;
	var index = img.getAttribute("indexvalue");
	var src = img.getAttribute("src");

	console.log ("Checking whether it already has any entries");
	var res = revSearchOnMultimap(global_mapping, keywords[state]);
	if (res.length === 0) {
		console.log ("No entries found. Adding...");
		var temp = global_mapping[img_md5s[index]];
		if (temp === undefined) {
			global_mapping[img_md5s[index]] = [keywords[state]];
		}
		else {
			global_mapping[img_md5s[index]].push(keywords[state]);
		}
	}
	else {
		console.log (`Found entries: ${res}`);
		console.log (`Selected entry: ${img_md5s[index]}`);
	}

	state = state + 1;

	console.log(global_mapping);
	let setting = browser.storage.sync.set({"mapping" : global_mapping});
	// let setting = browser.storage.sync.set("random");
	// // just check for errors
	setting.then(null, onError);

	console.log(`Checking whether ${keywords[1]} is in mapping`);
	if (state === 1) {
		var res = revSearchOnMultimap(global_mapping, keywords[1]);
		if (res.length === 0) {
			console.log ("Not found. Continuing to wait for user input...");
		}
		else {
			console.log ("Found entries. Acting on it.");
			for (var i = 0; i < res.length; i++) {
				var pos = img_md5s.indexOf(res[i]);
				if (pos !== -1) {
					console.log(`Clicking ${pos} image`);
					ks_imgs[pos].click();
					break;
				}
			}
		}
	}
}

let gettingItem = browser.storage.sync.get();
	gettingItem.then(onGot, notFound);


// let setting = browser.storage.sync.set({"mapping": {"hello": "Adf"}});
// just check for errors
// setting.then(null, onError);
