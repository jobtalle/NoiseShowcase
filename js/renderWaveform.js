const WAVEFORM_BACKGROUND_COLOR = "#000000";
const WAVEFORM_FILL_COLOR = "#ff0066";
const WAVEFORM_PADDING = 20;
const WAVEFORM_PRECISION = 128;

var wavefromNoiseY;
var waveformMaxRadius;
var waveformSeed;

function waveformSetup() {
	waveformStart();
}

function waveformStart() {
	var canvas = getCanvas();
	
	wavefromNoiseY = 0;
	waveformSeed = getRandomSeed();
	waveformMaxRadius = Math.min(canvas.width / 2, canvas.height / 2) - WAVEFORM_PADDING;
	
	animateStart(waveformRender);
}

function waveformRender(timeStep) {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	
	const noiseSpeed = parseFloat(document.getElementById("waveform-speed").value);
	const noisePeriod = 1 << parseInt(document.getElementById("waveform-period").value);
	const noiseFrequency = 1 << parseInt(document.getElementById("waveform-frequency").value);
	const power = parseFloat(document.getElementById("waveform-power").value);
	
	var config = cubicNoiseConfig(waveformSeed, noisePeriod, (WAVEFORM_PRECISION / noisePeriod) / noiseFrequency);
	
	context.fillStyle = WAVEFORM_BACKGROUND_COLOR;
	context.beginPath();
	context.rect(0, 0, canvas.width, canvas.height);
	context.fill();
	
	context.fillStyle = WAVEFORM_FILL_COLOR;
	context.lineWidth = 8;
	context.beginPath();
	
	for(var i = 0; i < WAVEFORM_PRECISION; ++i) {
		var sample = Math.pow(cubicNoiseSample(config, i, wavefromNoiseY), power);
		
		var radians = (i / WAVEFORM_PRECISION) * PI * 2;
		var radius = waveformMaxRadius * (sample / 2 + 0.5);
		var x = canvas.width / 2 + Math.cos(radians) * radius;
		var y = canvas.height / 2 + Math.sin(radians) * radius;
		
		switch(i) {
			case 0:
				context.moveTo(x, y);
				break;
			case WAVEFORM_PRECISION - 1:
				context.lineTo(x, y);
				context.closePath();
				break;
			default:
				context.lineTo(x, y);
				break;
		}
	}
	
	context.fill();
	
	wavefromNoiseY += timeStep * noiseSpeed;
}