function renderCubicNoise() {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.imageSmoothingEnabled = false;
	
	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	var config = cubicNoiseConfig(Math.random() * Number.MAX_SAFE_INTEGER, 40);
	
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
}