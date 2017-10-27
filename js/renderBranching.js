const BRANCHING_RENDER_STEPS_PER_SECOND = 32;
const BRANCHING_BACKGROUND_COLOR = "#000000";
const BRANCHING_SEGMENT_SIZE = 10;

var branchingRenderSteps;
var branchingWidthDecrease;
var branchingBranchCount;
var branchingBranches;
var branchingWobbleX;
var branchingTurnStrength;
var branchingBranchLength;

function branchingSetup() {
	document.getElementById("branching-randomize-seed").click();
}

function branchingStart() {
	branchingRenderSteps = 0;
	branchingWobbleX = 0;
	branchingBranchCount = parseInt(document.getElementById("branching-arm-count").value);
	branchingBranchLength = parseInt(document.getElementById("branching-arm-length").value);
	branchingBranches = new Array(branchingBranchCount);
	
	branchingCreatebranchingBranches();
	
	animateStart(branchingRender);
}

function branchingCreatebranchingBranches() {
	var seed = parseInt(document.getElementById("branching-seed").value);
	
	for(var i = 0; i < branchingBranchCount; ++i) {
		const branchLength = parseInt(document.getElementById("branching-arm-length").value);
		const branchPointCount = parseInt(document.getElementById("branching-count").value);
		const frequency = parseInt(document.getElementById("branching-frequency").value);
		var branchPoints = new Array(branchPointCount);
		
		for(var p = 0; p < branchPointCount; ++p)
			branchPoints[p] = 1 + Math.round((branchLength - 2) * Math.random());
		
		branchingBranches[i] = {
			"config": cubicNoiseConfig(seed++, frequency),
			"color":  "hsl(" + (i / branchingBranchCount) * 360 + ", 90%, 65%)",
			"branchPoints": branchPoints
		}
	}
}

function branchingRender(timeStep) {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	
	branchingRenderSteps += BRANCHING_RENDER_STEPS_PER_SECOND * timeStep;
	branchingWobbleX += timeStep * parseFloat(document.getElementById("branching-speed").value);
	branchingTurnStrength = parseFloat(document.getElementById("branching-turn-strength").value);
	branchingStartWidth = parseFloat(document.getElementById("branching-arm-width").value);
	branchingWidthDecrease = branchingStartWidth / branchingBranchLength;
	
	context.fillStyle = BRANCHING_BACKGROUND_COLOR;
	context.beginPath();
	context.rect(0, 0, canvas.width, canvas.height);
	context.fill();
	
	context.lineCap = "round";
	
	for(var i = 0; i < branchingBranchCount; ++i)
		branchingDrawBranch(branchingBranches[i]);
}

function branchingDrawBranch(branch) {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	var x = canvas.width / 2;
	var y = canvas.height / 2;
	var width = branchingStartWidth;
	
	var sampleDirOrigin = (cubicNoiseSample(branch.config, branchingWobbleX, branchingWobbleX) - 0.5) * PI * 4;
	var directionOrigin = (cubicNoiseSample(branch.config, x - branchingWobbleX, y) - 0.5) * PI * 4;
	
	drawBranchPart(branch, true, x, y, directionOrigin, 0, width, branchingWobbleX, 0, sampleDirOrigin);
}

function drawBranchPart(branch, root, x, y, direction, step, width, samplex, sampley, sampledir) {
	var canvas = getCanvas();
	var context = canvas.getContext("2d");
	
	while(width >= 0) {
		if(++step > branchingRenderSteps)
			break;
		
		context.beginPath();
		context.lineWidth = width;
		context.moveTo(x, y);
		
		const sample = cubicNoiseSample(branch.config, samplex, sampley) - 0.5;
		const xPrevious = x;
		const yPrevious = y;
		
		direction += sample * branchingTurnStrength;
		x += Math.cos(direction) * BRANCHING_SEGMENT_SIZE;
		y += Math.sin(direction) * BRANCHING_SEGMENT_SIZE;
		samplex += Math.cos(sampledir) * BRANCHING_SEGMENT_SIZE;
		sampley += Math.sin(sampledir) * BRANCHING_SEGMENT_SIZE;
		
		var gradient = context.createLinearGradient(xPrevious, yPrevious, x, y);
		gradient.addColorStop(0, branch.color);
		gradient.addColorStop(1, "#000000");
		
		context.strokeStyle = gradient;
		context.lineTo(x, y);
		context.stroke();
		
		if(width > 0)
			width -= Math.min(width, branchingWidthDecrease);
		else
			width -= branchingWidthDecrease;
		
		if(root == true && branch.branchPoints.includes(step))
			drawBranchPart(branch, false, x, y, direction, step, width, samplex, sampley, sampledir + PI / 2);
	}
}

function branchingRandomizeSeed() {
	document.getElementById("branching-seed").value = getRandomSeed();
	
	branchingStart();
}