var c;
function initGraphics(canvasId,dataId){
	canvasElement = document.getElementById(canvasId);
	c = canvasElement.getContext("2d");
	data = document.getElementById(dataId);

	gfxTimer = setInterval(refreshGraphics,1/60.0*1000);

	if (DEBUG) {
		console.log('Initialize Graphics complete.');
	}
}

// Main Drawing --------------------------


// Updates text on html page
function updateData() {
	data.innerHTML = ("Bods: "+bods.N);
	data.innerHTML += "<ul>";
	var i;
	for(i=0;i<bods.N;i++){
		data.innerHTML += "<li> B"+i+" : Pos "+
			bods.pos.x[i].toFixed(2)+", "+bods.pos.y[i].toFixed(2)+
			" </li>";
	}
	data.innerHTML += "</ul>";
}

// Updates graphics in Canvas
function refreshGraphics() {
	c.clearRect(0,0,canvasElement.width,canvasElement.height);

	if (isDrag) {
		drawCircle(dragx,dragy,massToRadius(dragm));
		drawArrow(dragx,dragy,dragx2,dragy2);
	}

	for(i=0;i<bods.N;i++){
		drawCircle(bods.pos.x[i],bods.pos.y[i],massToRadius(bods.mass[i]));
		drawArrow(bods.pos.x[i],
			bods.pos.y[i],
			bods.pos.x[i]+bods.vel.x[i],
			bods.pos.y[i]+bods.vel.y[i]);
	}

	updateData();
}

var MINRADIUS = 1;
var MAXRADIUS = 20;

function massToRadius(mass) {
	return MINRADIUS+(mass-MINMASS)/(MAXMASS-MINMASS)*(MAXRADIUS-MINRADIUS);
	
}

// Simple Shapes --------------------------
function drawBox(x,y,w,h) {
	c.strokeStyle = '#00f';
	c.lineWidth = "1";
	c.strokeRect(x,y,w,h);	
}

// x,y center with radius r
function drawCircle(x,y,r) {
	c.strokeStyle = '#f00';
	c.fillStyle = '#fff';
	c.lineWidth = "1.5";
	c.beginPath();
	c.arc(x,y,r,0,Math.PI*2,true); 
	c.closePath();
	c.stroke();
	c.fill();
}

// Arrow
// x,y start to x2,y2 end
// h = Arrow Head size
function drawArrow(x,y,x2,y2,h) {
	h = typeof(h) != 'undefined' ? h : 10; // Default h
	var angle = Math.atan2(y2-y,x2-x);

	c.strokeStyle = '#0f0';
	c.fillStyle = '#0f0';
	c.lineWidth = "0";

	
	// Line
	c.beginPath();
	c.moveTo(x,y);
	c.lineTo(x2,y2);
	c.closePath();
    c.stroke();

	// Arrow head
	c.beginPath();
	c.moveTo(x2,y2);
    c.lineTo(x2-h*Math.cos(angle-Math.PI/8),y2-h*Math.sin(angle-Math.PI/8));
    c.lineTo(x2-h*Math.cos(angle+Math.PI/8),y2-h*Math.sin(angle+Math.PI/8));
    c.lineTo(x2,y2);
    c.closePath();
    c.fill();
}