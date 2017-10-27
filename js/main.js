const PI = 3.141592653589;
const LOAD_DELAY = 20;

var currentTab;

function setTab(e, tab) {
	hideAllDescriptions();
	showDescription(tab);
	
	hideAllControls();
	showControls(tab);
	
	highlightTab(e);
	
	deactivate(currentTab);
	activate(currentTab = tab);
}

function highlightTab(e) {
	var tabLinks = document.getElementsByClassName("tablink");
	
	for(var i = 0; i < tabLinks.length; ++i)
		tabLinks[i].className = tabLinks[i].className.replace(" active", "");
	
	e.currentTarget.className += " active";
}

function hideAllDescriptions() {
	var allControls = document.getElementsByClassName("tab-description");
	
	for(var i = 0; i < allControls.length; ++i)
		allControls[i].style.display = "none";
}

function showDescription(tab) {
	document.getElementById(tab + "-description").style.display = "block";
}

function hideAllControls() {
	var allControls = document.getElementsByClassName("tab-controls");
	
	for(var i = 0; i < allControls.length; ++i)
		allControls[i].style.display = "none";
}

function showControls(tab) {
	document.getElementById(tab + "-controls").style.display = "block";
}

function activate(tab) {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	switch(tab) {
		case "cubic-noise":
			cubicNoiseSetup();
			break;
		case "terrain":
			terrainSetup();
			break;
		case "waveform":
			waveformSetup();
			break;
		case "branching":
			branchingSetup();
			break;
	}
}

function deactivate(tab) {
	switch(tab) {
		case "terrain":
		case "waveform":
		case "branching":
			animateStop();
			break;
	}
}

function getRandomSeed() {
	return Math.round(4294967295 * Math.random());
}

function getCanvas() {
	return document.getElementById("renderer");
}

function drawRendering() {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	var width = 150;
	var height = 60;
	var message = "Rendering...";
	
	context.fillStyle = "#ffffff";
	context.fillRect((canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
	
	context.strokeStyle = "#000000";
	context.beginPath();
	context.lineWidth = "1";
	context.lineCap = "butt";
	context.rect((canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
	context.stroke();
	
	context.fillStyle = "#000000";
	context.font = "18px Calibri";
	context.fillText(message,
		(canvas.width - context.measureText(message).width) / 2,
		(canvas.height + 9) / 2);
}
