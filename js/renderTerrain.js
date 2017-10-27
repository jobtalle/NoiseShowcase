const HORIZONTAL_MARGIN = 80;
const VERTICAL_MARGIN = 100;
const VERTICAL_BASE = 32;
const LAYERS_PER_SECOND = 256;
const EDGE_COLOR = "#AAAAAA";

var atLayer;
var resolution;

function terrainSetup() {
	document.getElementById("terrain-randomize-seed").click();
}

function terrainStart() {
	atLayer = 0;
	
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
	
	context.fillStyle = EDGE_COLOR;
	context.strokeStyle = "#000000";
	context.lineWidth = 1;
	
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
	if(resolution > Math.floor(atLayer)) {
		var previousLayer = Math.floor(atLayer);
		atLayer += timeStep * LAYERS_PER_SECOND;
		
		if(previousLayer == Math.round(atLayer))
			return;
		
		var canvas = getCanvas();
		var context = canvas.getContext("2d");
		
		const seed = parseFloat(document.getElementById("terrain-seed").value);
		const octaves = parseFloat(document.getElementById("terrain-octaves").value);
		const falloff = parseFloat(document.getElementById("terrain-falloff").value);
		const periodStart = parseFloat(document.getElementById("terrain-period").value);
		const terrainAmplitude = parseFloat(document.getElementById("terrain-amplitude").value);
		const lowerBound = parseFloat(document.getElementById("terrain-lower-bound").value);
		const gradientStyle = document.getElementById("terrain-gradient").value;
		var amplitudeStart;
		
		if(falloff - 1 == 0)
			amplitudeStart = (1 / octaves) / falloff;
		else
			amplitudeStart = (((falloff - 1) * Math.pow(falloff, octaves)) / (Math.pow(falloff, octaves) - 1)) / falloff;
		
		for(var y = previousLayer; y < Math.min(resolution, Math.floor(atLayer)); ++y) {
			for(var x = 0; x < resolution; ++x) {
				var period = periodStart;
				var amplitude = amplitudeStart;
				var sample = 0;
				
				for(var octave = 0; octave < octaves; ++octave) {
					var config = cubicNoiseConfig(seed + octave, period / (octave + 1));
					
					sample += cubicNoiseSample(config, x, y) * amplitude;
					
					period /= 2;
					amplitude /= falloff;
				}
				
				sample = Math.max(sample, lowerBound);
				
				var mapped = terrainMap(x, y);
				
				if(x == resolution - 1 || y == resolution - 1) {
					context.lineWidth = 2;
					context.strokeStyle = EDGE_COLOR;
				} else {
					context.lineWidth = 1;
					context.strokeStyle = terrainCreateGradient(gradientStyle, mapped.x, mapped.y, mapped.x, mapped.y - terrainAmplitude);
				}
				context.beginPath();
				context.moveTo(mapped.x, mapped.y);
				context.lineTo(mapped.x, mapped.y - sample * terrainAmplitude);
				context.stroke();
			}
		}
	}
}

function terrainCreateGradient(name, fromx, fromy, tox, toy) {
	var gradient = getCanvas().getContext("2d").createLinearGradient(fromx, fromy, tox, toy);
	
	switch(name) {
		case "grayscale":
			gradient.addColorStop(0, "black");
			gradient.addColorStop(1, "white");
			break;
		case "earth":
			gradient.addColorStop(0, "#001f33");
			gradient.addColorStop(0.3, "#0099ff");
			gradient.addColorStop(0.33, "#e6e600");
			gradient.addColorStop(0.45, "#47d147");
			gradient.addColorStop(0.6, "#009933");
			gradient.addColorStop(0.8, "#ffffff");
			gradient.addColorStop(1, "#ffffff");
			break;
		case "desert":
			gradient.addColorStop(0, "#7a6652");
			gradient.addColorStop(0.5, "#d2a679");
			gradient.addColorStop(0.65, "#996633");
			gradient.addColorStop(0.8, "#392613");
			break;
	}
	
	return gradient;
}

function terrainRandomizeSeed() {
	document.getElementById("terrain-seed").value = getRandomSeed();
	
	terrainStart();
}