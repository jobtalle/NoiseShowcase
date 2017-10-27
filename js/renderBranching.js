const BRANCHING_RENDER_STEPS_PER_SECOND = 32;
const BRANCHING_BACKGROUND_COLOR = "#000000";
const BRANCHING_STEP_SIZE = 10;
const BRANCHING_WOBBLE_PERIOD = 8;
const BRANCHING_WOBBLE_SPEED = 1.5;

var renderSteps;
var startWidth;
var widthDecrease;
var branchCount;
var branches;
var branchingWobbleX;

function branchingSetup() {
	document.getElementById("branching-randomize-seed").click();
}

function branchingStart() {
	renderSteps = 0;
	startWidth = parseFloat(document.getElementById("branching-arm-width").value);
	widthDecrease = startWidth / parseInt(document.getElementById("branching-arm-length").value);
	branchCount = parseInt(document.getElementById("branching-arm-count").value);
	branches = new Array(branchCount);
	branchingWobbleX = 0;
	
	branchingCreateBranches();
	
	animateStart(branchingRender);
}

function branchingCreateBranches() {
	var seed = parseInt(document.getElementById("branching-seed").value);
	
	for(var i = 0; i < branchCount; ++i) {
		const branchLength = parseInt(document.getElementById("branching-arm-length").value);
		var branchPointCount = parseInt(document.getElementById("branching-count").value);
		var branchPoints = new Array(branchPointCount);
		
		for(var p = 0; p < branchPointCount; ++p)
			branchPoints[p] = Math.round(branchLength * Math.random()) * widthDecrease;
		
		branches[i] = {
			"config": cubicNoiseConfig(seed++, 32),
			"color":  "hsl(" + (i / branchCount) * 360 + ", 90%, 65%)",
			"branchPoints": branchPoints
		}
	}
}

function branchingRender(timeStep) {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	
	renderSteps += BRANCHING_RENDER_STEPS_PER_SECOND * timeStep;
	branchingWobbleX += timeStep * BRANCHING_WOBBLE_SPEED;
	
	context.fillStyle = BRANCHING_BACKGROUND_COLOR;
	context.beginPath();
	context.rect(0, 0, canvas.width, canvas.height);
	context.fill();
	
	context.lineCap = "round";
	
	for(var i = 0; i < branchCount; ++i)
		branchingDrawBranch(branches[i]);
}

function branchingDrawBranch(branch) {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	var x = canvas.width / 2;
	var y = canvas.height / 2;
	var width = startWidth;
	
	context.strokeStyle = branch.color;
	
	var sampleDirOrigin = (cubicNoiseSample(branch.config, x + branchingWobbleX, y) - 0.5) * PI * 4;
	var directionOrigin = (cubicNoiseSample(branch.config, x + branchingWobbleX, y) - 0.5) * PI * 4;
	
	drawBranchPart(branch, true, x, y, directionOrigin, 0, width, 0, 0, sampleDirOrigin);
}

function drawBranchPart(branch, root, x, y, direction, step, width, samplex, sampley, sampledir) {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	
	while(width >= 0) {
		if(++step > renderSteps)
			break;
		
		context.beginPath();
		context.lineWidth = width;
		context.moveTo(x, y);
		
		var sample = (cubicNoiseSample(branch.config, samplex, sampley) - 0.5) * 1.5;
		
		direction += sample;
		x += Math.cos(direction) * BRANCHING_STEP_SIZE;
		y += Math.sin(direction) * BRANCHING_STEP_SIZE;
		samplex += Math.cos(sampledir) * BRANCHING_STEP_SIZE;
		sampley += Math.sin(sampledir) * BRANCHING_STEP_SIZE;
		
		context.lineTo(x, y);
		context.stroke();
		
		if(width > 0)
			width -= Math.min(width, widthDecrease);
		else
			width -= widthDecrease;
		
		if(root && branch.branchPoints.includes(width))
			drawBranchPart(branch, false, x, y, direction, step, width, samplex, sampley, sampledir + 1);
	}
}

function branchingRandomizeSeed() {
	document.getElementById("branching-seed").value = getRandomSeed();
	
	branchingStart();
}