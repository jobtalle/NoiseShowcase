const BACKGROUND_COLOR = "#000000";
const FILL_COLOR = "#ff0066";
const PADDING = 20;
const PRECISION = 128;

var noisey;
var maxRadius;
var seed;

function waveformSetup() {
	waveformStart();
}

function waveformStart() {
	var canvas = getCanvas();
	
	noisey = 0;
	seed = getRandomSeed();
	maxRadius = Math.min(canvas.width / 2, canvas.height / 2) - PADDING;
	
	animateStart(waveformRender);
}

function waveformRender(timeStep) {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	
	const noiseSpeed = parseFloat(document.getElementById("waveform-speed").value);
	const noisePeriod = 1 << parseInt(document.getElementById("waveform-period").value);
	const noiseFrequency = 1 << parseInt(document.getElementById("waveform-frequency").value);
	const power = parseFloat(document.getElementById("waveform-power").value);
	
	var config = cubicNoiseConfig(seed, noisePeriod, (PRECISION / noisePeriod) / noiseFrequency);
	
	context.fillStyle = BACKGROUND_COLOR;
	context.beginPath();
	context.rect(0, 0, canvas.width, canvas.height);
	context.fill();
	
	context.fillStyle = FILL_COLOR;
	context.lineWidth = 8;
	context.beginPath();
	
	for(var i = 0; i < PRECISION; ++i) {
		var sample = Math.pow(cubicNoiseSample(config, i, noisey), power);
		
		var radians = (i / PRECISION) * PI * 2;
		var radius = maxRadius * (sample / 2 + 0.5);
		var x = canvas.width / 2 + Math.cos(radians) * radius;
		var y = canvas.height / 2 + Math.sin(radians) * radius;
		
		switch(i) {
			case 0:
				context.moveTo(x, y);
				break;
			case PRECISION - 1:
				context.lineTo(x, y);
				context.closePath();
				break;
			default:
				context.lineTo(x, y);
				break;
		}
	}
	
	context.fill();
	
	noisey += timeStep * noiseSpeed;
}