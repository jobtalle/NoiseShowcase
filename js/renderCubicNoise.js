function cubicNoiseSetup() {
	document.getElementById("cubic-noise-randomize-seed").click();
}

function cubicNoiseRender() {
	drawRendering();
	
	setTimeout(function() {
		var canvas = getCanvas();
		var context = canvas.getContext("2d");
		
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		var result = new Image();
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var seed = parseFloat(document.getElementById("cubic-noise-seed").value);
		var quality = parseFloat(1 << (5 - document.getElementById("cubic-noise-quality").value));
		var period = parseFloat(document.getElementById("cubic-noise-period").value / quality);
		var octaves = parseFloat(document.getElementById("cubic-noise-octaves").value);
		var falloff = parseFloat(document.getElementById("cubic-noise-falloff").value);
		var amplitude;
		
		if(falloff - 1 == 0)
			amplitude = (1 / octaves) / falloff;
		else
			amplitude = (((falloff - 1) * Math.pow(falloff, octaves)) / (Math.pow(falloff, octaves) - 1)) / falloff;
		
		for(var octave = 0; octave < octaves; ++octave) {
			var config = cubicNoiseConfig(seed + octave, period / (octave + 1));
			
			for(var y = 0; y < Math.floor(canvas.height / quality); ++y) {
				for(var x = 0; x < Math.floor(canvas.width / quality); ++x) {
					var index = (x + y * canvas.width) * quality;
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
		
		context.putImageData(imageData, 0, 0);
	}, LOAD_DELAY);
}

function cubicNoiseRandomizeSeed() {
	document.getElementById("cubic-noise-seed").value = Math.round(getRandomSeed());
	
	cubicNoiseRender();
}