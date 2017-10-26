function cubicNoiseSetup() {
	document.getElementById("cubic-noise-randomize-seed").click();
	document.getElementById("cubic-noise-generate").click();
}

function cubicNoiseRender() {
	drawRendering();
	
	setTimeout(function() {
		var canvas = getCanvas();
		var context = canvas.getContext("2d");
		
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		var seed = document.getElementById("cubic-noise-seed").value;
		var period = document.getElementById("cubic-noise-period").value;
		var config = cubicNoiseConfig(seed, period);
		
		for(var y = 0; y < canvas.height; ++y) {
			for(var x = 0; x < canvas.width; ++x) {
				var index = (x + y * canvas.width) * 4;
				var value = cubicNoiseSample(config, x, y) * 255;
				
				imageData.data[index] = value;
				imageData.data[index + 1] = value;
				imageData.data[index + 2] = value;
				imageData.data[index + 3] = 255;
			}
		}
		
		context.putImageData(imageData, 0, 0);
	}, 20);
}

function cubicNoiseRandomizeSeed() {
	document.getElementById("cubic-noise-seed").value = Math.round(4294967295 * Math.random());
}