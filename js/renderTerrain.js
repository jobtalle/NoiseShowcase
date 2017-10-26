const HORIZONTAL_MARGIN = 80;
const VERTICAL_MARGIN = 100;
const VERTICAL_BASE = 32;
const LAYERS_PER_SECOND = 128;

var config;
var atLayer;
var resolution;

function terrainSetup() {
	document.getElementById("terrain-generate").click();
	
	terrainStart();
}

function terrainStart() {
	atLayer = 0;
	config = cubicNoiseConfig(getRandomSeed());
	
	terrainCalculateBounds();
	terrainRenderBase();
	
	animateStart(terrainRender);
}

function terrainCalculateBounds() {
	var canvas = getCanvas();
	
	const usableWidth = canvas.width - 2 * HORIZONTAL_MARGIN;
	const usableHeight = canvas.height - VERTICAL_MARGIN - VERTICAL_BASE;
	
	resolution = Math.min(usableHeight, usableWidth / 2);
}

function terrainRenderBase() {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	context.fillStyle = "#AAAAAA";
	context.strokeStyle = "#000000";
	
	context.beginPath();
	context.moveTo(canvas.width / 2, canvas.height - VERTICAL_BASE);
	context.lineTo(canvas.width / 2 + resolution, canvas.height - resolution / 2 - VERTICAL_BASE);
	context.lineTo(canvas.width / 2, canvas.height - resolution- VERTICAL_BASE);
	context.lineTo(canvas.width / 2 - resolution, canvas.height - resolution / 2- VERTICAL_BASE);
	context.lineTo(canvas.width / 2, canvas.height - VERTICAL_BASE);
	context.fill();
	context.stroke();
}

function terrainMap(x, y) {
	var canvas = getCanvas();
	
	return {
		'x': canvas.width / 2 + x - y,
		'y': canvas.height - resolution - VERTICAL_BASE + x / 2 + y / 2
	};
}

function terrainRender(timeStep) {
	if(atLayer <= resolution) {
		var previousLayer = Math.floor(atLayer);
		atLayer += timeStep * LAYERS_PER_SECOND;
		
		if(previousLayer == Math.round(atLayer))
			return;
		
		var canvas = getCanvas();
		var context = canvas.getContext("2d");
		
		context.strokeStyle = "#000000";
		
		for(var y = previousLayer; y <= Math.floor(atLayer); ++y) {
			for(var x = 0; x < resolution; ++x) {
				var mapped = terrainMap(x, y);
				
				context.beginPath();
				context.moveTo(mapped.x, mapped.y);
				context.lineTo(mapped.x, mapped.y - 20);
				context.stroke();
			}
		}
	}
}