////////////
var MINMASS = 10;
var MAXMASS = 100;
var G = 1000; // Gravitational Constant
var ETA = 10; // Softening constant
var GFACTOR = 2; // Higher means distance has more effect (3 is reality)

// Bodies struct containing all bodies
bods = {pos:{x:new Array(),y:new Array()},
		vel:{x:new Array(),y:new Array()},
		acc:{x:new Array(),y:new Array()},
		mass:new Array(),
		N:0};

// Canvas Context
var c;

// Called by HTML with canvasId passed in
function initBN(canvasId) {
	canvasElement = document.getElementById(canvasId);
	c = canvasElement.getContext("2d");
	if (DEBUG) {
		console.log('Initialize BN complete.');
	}
}

function addBody(x,y,vx,vy,m) {
	bods.pos.x [bods.N] = x;
	bods.pos.y [bods.N] = y;
	bods.vel.x [bods.N] = vx;
	bods.vel.y [bods.N] = vy;
	bods.acc.x [bods.N] = 0;
	bods.acc.y [bods.N] = 0;
	bods.mass [bods.N] = m;
	bods.N = bods.N + 1;

	if (DEBUG) {
	    console.log("ADD BODY M: ",m," P:",x,",",y," V:",vx,",",vy);
	}
}

// Set accelerations of bodies based on gravity
function doForces() {
	//console.log("Doing forces");
	var i,j;
	var numChecks = 0;
	// Zero accelerations
	for (i=0;i<bods.N;i++) {
		bods.acc.x[i]=0;
		bods.acc.y[i]=0;
	}
	var dx,dy,r,F,fx,fy;
	for (i=0;i<bods.N;i++) {
		for (j=i+1;j<bods.N;j++) {
			dx = bods.pos.x[j]-bods.pos.x[i];
			dy = bods.pos.y[j]-bods.pos.y[i];
			r = Math.sqrt(dx*dx+dy*dy)+ETA;
			F = G*bods.mass[i]*bods.mass[j]/Math.pow(r,GFACTOR);
			fx = F*dx/r;
			fy = F*dy/r;
			
			bods.acc.x[i] += fx/bods.mass[i];
			bods.acc.y[i] += fy/bods.mass[i];
			
			bods.acc.x[j] -= fx/bods.mass[j];
			bods.acc.y[j] -= fy/bods.mass[j];

			if (DEBUG) {
				console.log("B",i," <-> B",j," : ",F);
			}
			numChecks += 1;
		}
	}
	if (DEBUG) {
		console.log("Force Checks: ",numChecks);
	}
}

// Basic update system step by time step dt
var T = 0; // current system time
var dt = 0.01;
function step() {
	doForces();
	for (i=0;i<bods.N;i++) {
		// Update body positions based on velocities
		bods.pos.x[i] += bods.vel.x[i]*dt;
		bods.pos.y[i] += bods.vel.y[i]*dt;
		// Update body velocities based on accelerations
		bods.vel.x[i] += bods.acc.x[i]*dt;
		bods.vel.y[i] += bods.acc.y[i]*dt;
	}

	T += dt;
	if (DEBUG) {
	    console.log("STEP");
	}
	refreshGraphics();
}

var sysTimer;
var sysRunning = false;
function startSys() {
	sysTimer = setInterval(step,10);
	sysRunning = true;
	if (DEBUG) {
	    console.log("START SYSTEM ",T,"s");
	}
}
function pauseSys() {
	clearInterval(sysTimer);
	sysRunning = false;
	if (DEBUG) {
	    console.log("STOP SYSTEM ",T,"s");
	}
}