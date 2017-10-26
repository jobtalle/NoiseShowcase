function setTab(e, tab) {
	hideAllDescriptions();
	showDescription(tab);
	
	highlightTab(e);
	
	render(tab);
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
	document.getElementById(tab).style.display = "block";
}

function render(tab) {
	switch(tab) {
		case "cubic-noise":
			renderCubicNoise();
			break;
	}
}

function getCanvas() {
	return document.getElementById("renderer");
}