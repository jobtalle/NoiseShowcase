function branchingSetup() {
	document.getElementById("branching-randomize-seed").click();
}

function branchingStart() {
	
}

function branchingRender() {
	
}

function branchingRandomizeSeed() {
	document.getElementById("branching-seed").value = getRandomSeed();
	
	branchingStart();
}