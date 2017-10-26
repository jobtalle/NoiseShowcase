function setTab(e, tab) {
	hideAllDescriptions();
	showDescription(tab);
	
	hideAllControls();
	showControls(tab);
	
	highlightTab(e);
	
	activate(tab);
}

function highlightTab(e) {
	var tabLinks = document.getElementsByClassName("tablink");
	
	for(var i = 0; i < tabLinks.length; ++i) {
		tabLinks[i].className = tabLinks[i].className.replace(" active", "");
	}
	
	e.currentTarget.className += " active";
}

function hideAllDescriptions() {
	var allControls = document.getElementsByClassName("tab-description");
	
	for(var i = 0; i < allControls.length; ++i) {
		allControls[i].style.display = "none";
	}
}

function showDescription(tab) {
	document.getElementById(tab + "-description").style.display = "block";
}

function hideAllControls() {
	var allControls = document.getElementsByClassName("tab-controls");
	
	for(var i = 0; i < allControls.length; ++i) {
		allControls[i].style.display = "none";
	}
}

function showControls(tab) {
	document.getElementById(tab + "-controls").style.display = "block";
}

function activate(tab) {
	switch(tab) {
		case "cubic-noise":
			cubicNoiseSetup();
			break;
	}
}

function getCanvas() {
	return document.getElementById("renderer");
}