const TERRAIN_HORIZONTAL_MARGIN = 80;
const TERRAIN_VERTICAL_MARGIN = 100;
const TERRAIN_VERTICAL_BASE = 32;
const TERRAIN_LAYERS_PER_SECOND = 128;
const TERRAIN_EDGE_COLOR = "#AAAAAA";

var terrainAtLayer;
var terrainResolution;

function terrainSetup() {
	document.getElementById("terrain-randomize-seed").click();
}

function terrainStart() {
	terrainAtLayer = 0;
	
	terrainCalculateBounds();
	terrainRenderBase();
	
	animateStart(terrainRender);
}

function terrainCalculateBounds() {
	var canvas = getCanvas();
	
	const usableWidth = canvas.width - 2 * TERRAIN_HORIZONTAL_MARGIN;
	const usableHeight = canvas.height - TERRAIN_VERTICAL_MARGIN - TERRAIN_VERTICAL_BASE;
	
	terrainResolution = Math.min(usableHeight, usableWidth / 2);
}

function terrainRenderBase() {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	context.fillStyle = TERRAIN_EDGE_COLOR;
	context.strokeStyle = "#000000";
	context.lineCap = "butt";
	context.lineWidth = 1;
	
	context.beginPath();
	context.moveTo(canvas.width / 2, canvas.height - TERRAIN_VERTICAL_BASE);
	context.lineTo(canvas.width / 2 + terrainResolution, canvas.height - terrainResolution / 2 - TERRAIN_VERTICAL_BASE);
	context.lineTo(canvas.width / 2, canvas.height - terrainResolution- TERRAIN_VERTICAL_BASE);
	context.lineTo(canvas.width / 2 - terrainResolution, canvas.height - terrainResolution / 2- TERRAIN_VERTICAL_BASE);
	context.lineTo(canvas.width / 2, canvas.height - TERRAIN_VERTICAL_BASE);
	context.fill();
	context.stroke();
}

function terrainMap(x, y) {
	var canvas = getCanvas();
	
	return {
		'x': canvas.width / 2 + x - y,
		'y': canvas.height - terrainResolution - TERRAIN_VERTICAL_BASE + x / 2 + y / 2
	};
}

function terrainRender(timeStep) {
	if(terrainResolution > Math.floor(terrainAtLayer)) {
		var previousLayer = Math.floor(terrainAtLayer);
		terrainAtLayer += timeStep * TERRAIN_LAYERS_PER_SECOND;
		
		if(previousLayer == Math.round(terrainAtLayer))
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
		
		for(var y = previousLayer; y < Math.min(terrainResolution, Math.floor(terrainAtLayer)); ++y) {
			for(var x = 0; x < terrainResolution; ++x) {
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
				
				if(x == terrainResolution - 1 || y == terrainResolution - 1) {
					context.lineWidth = 2;
					context.strokeStyle = TERRAIN_EDGE_COLOR;
				} else {
					context.lineWidth = 1;
					context.lineCap = "butt";
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