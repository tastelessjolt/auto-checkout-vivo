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

function listenForClicks() {
	var button = document.getElementById("but");
	button.addEventListener("click", (e) => { 
		dump();
	});
}

listenForClicks();