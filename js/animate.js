var animating = false;
var lastDate;
var renderer;

function animateStart(f) {
	renderer = f;
	
	if(!animating) {
		animating = true;
		lastDate = new Date();
		
		window.requestAnimationFrame(animate);
	}
}

function animate() {
	if(!animating)
		return;
	
	window.requestAnimationFrame(animate);
	
	var date = new Date();
	var timeStep = (date.getMilliseconds() - lastDate.getMilliseconds()) / 1000;
	if(timeStep < 0)
		timeStep += 1;
	
	lastDate = date;
	
	renderer(timeStep);
}

function animateStop() {
	animating = false;
}