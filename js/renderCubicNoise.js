const CUBIC_NOISE_DISCRETE_STEP = 32;
const CUBIC_NOISE_DISCRETE_RED = 0.8;
const CUBIC_NOISE_DISCRETE_GREEN = 1;
const CUBIC_NOISE_DISCRETE_BLUE = 0.4;

function cubicNoiseSetup() {
	document.getElementById("cubic-noise-randomize-seed").click();
}

function cubicNoiseRender() {
	drawRendering();
	
	setTimeout(function() {
		var canvas = getCanvas();
		var context = canvas.getContext("2d");
		
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		const seed = parseFloat(document.getElementById("cubic-noise-seed").value);
		const quality = parseFloat(1 << (5 - document.getElementById("cubic-noise-quality").value));
		const octaves = parseFloat(document.getElementById("cubic-noise-octaves").value);
		const falloff = parseFloat(document.getElementById("cubic-noise-falloff").value);
		const gradientStyle = document.getElementById("cubic-noise-gradient").value;
		
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var period = parseFloat(document.getElementById("cubic-noise-period").value) / quality;
		var amplitude;
		
		if(falloff - 1 == 0)
			amplitude = 1 / octaves;
		else
			amplitude = (((falloff - 1) * Math.pow(falloff, octaves)) / (Math.pow(falloff, octaves) - 1)) / falloff;
		
		for(var octave = 0; octave < octaves; ++octave) {
			var config = cubicNoiseConfig(seed + octave, period / (octave + 1));
			
			for(var y = 0; y < Math.floor(canvas.height / quality); ++y) {
				for(var x = 0; x < Math.floor(canvas.width / quality); ++x) {
					const index = (x + y * canvas.width) * quality;
					var value = cubicNoiseSample(config, x, y) * 255 * amplitude;
					
					for(var yrep = 0; yrep < quality; ++yrep) {
						for(var xrep = 0; xrep < quality; ++xrep) {
							var repIndex = (index + xrep + yrep * canvas.width) * 4;
							
							imageData.data[repIndex] += value;
							imageData.data[repIndex + 1] += value;
							imageData.data[repIndex + 2] += value;
							imageData.data[repIndex + 3] = 255;
						}
					}
				}
			}
			
			period /= 2;
			amplitude /= falloff;
		}
		
		if(gradientStyle != "grayscale") {
			for(var y = 0; y < canvas.height; ++y) {
				for(var x = 0; x < canvas.width; ++x) {
					const index = (x + y * canvas.width) * 4;
					var value = imageData.data[index];
					
					switch(gradientStyle) {
						case "discrete":
							value = Math.round(value / CUBIC_NOISE_DISCRETE_STEP) * CUBIC_NOISE_DISCRETE_STEP;
							break;
					}
					
					imageData.data[index] = value * CUBIC_NOISE_DISCRETE_RED;
					imageData.data[index + 1] = value * CUBIC_NOISE_DISCRETE_GREEN;
					imageData.data[index + 2] = value * CUBIC_NOISE_DISCRETE_BLUE;
				}
			}
		}
		
		context.putImageData(imageData, 0, 0);
	}, LOAD_DELAY);
}

function cubicNoiseRandomizeSeed() {
	document.getElementById("cubic-noise-seed").value = getRandomSeed();
	
	cubicNoiseRender();
}