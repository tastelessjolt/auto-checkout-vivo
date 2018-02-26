function dump () {
	let gettingItem = browser.storage.local.get();
	gettingItem.then(onGot, null);
}

function onGot(item) {
	console.log ("Got Item");
	if (item["mapping"] == undefined) {
		console.log ("Something went wrong. Lost all data.");
	}
	else {
		var box = document.getElementById("box");
		box.value = JSON.stringify(item["mapping"]);
	}
}

function dump_sync() {
	let gettingItem = browser.storage.sync.get();
	gettingItem.then(onGotSync, null);
}

function onGotSync(item) {
	console.log("Got Item");
	if (item["mapping"] == undefined) {
		console.log("Something went wrong. Lost all data.");
	}
	else {
		var box = document.getElementById("syncbox");
		box.value = JSON.stringify(item["mapping"]);
	}
}

function listenForClicks() {
	var button = document.getElementById("but");
	button.addEventListener("click", (e) => { 
		dump();
	});

	var sync_button = document.getElementById("syncbut");
	sync_button.addEventListener("click", (e) => {
		dump_sync();
	});
}

listenForClicks();