
var dragitem; var dragid; var dragparent;
var dropitem; var dropid;
var ouder; 
var kloon;
var bauto;

var speltype;
var beurt; 
var dum;

var statusArr2 = new Array;
var delstat;

var klix = ["red", "#3b91ff", "#39aa39", "yellow", "#f0f0f0", "black", "#ff66d9", "#f60", "#c9f"];

var xgis = new Array(6);
var ygis = new Array(6)


function drawrondjes() {
	var ij;

	for (i=1; i<=10; i++) {
		for (j=1; j<=5; j++) {
			ij = 10 * i + j;
			document.write ('	<div class="dropholder" >');
			document.write ('		<div  class="dropid" id="dropid' + ij + '" ondrop="drop(event)" ondragover="allowDrop(event)">');
			document.write ('		</div>');
			document.write ('	</div>');
		}
	}

		for (j=1; j<=5; j++) {
			document.write ('	<div class="dropholder0" >');
			document.write ('		<div  class="dropid" id="dropid0' + j + '" ondrop="drop(event)" ondragover="allowDrop(event)">');
			document.write ('		</div>');
			document.write ('	</div>');
		}
}

function drawpinnetjes() {
	var ij;

	for (i=1; i<=10; i++) {
		document.write ('	<div class="pinrij" >');
		for (j=1; j<=5; j++) {
			ij = 10 * i + j;
			document.write ('	<div class="pinholder" >');
			document.write ('		<div  class="pinid" id="pinid' + ij + '" ondrop="drop(event)" ondragover="allowDrop(event)">');
			document.write ('		</div>');
			document.write ('	</div>');
		}
		document.write ('	</div>');
	}
}

function drawbuttons() {
	for (i=1; i<=10; i++)  {
		document.write ('<p><button class="knoppen" id = "knop' + i + '" />Enter</button></p>');
	}
	document.write ('<p><button class="knop0" id = "knop0" />Enter</button></p>');
}

function drawcolors() {

	for (i=1; i<=3; i++) {
		document.write ('<div class="paletrij">');
		for (j=1; j<=3; j++) {
			var ij = 3 * (i - 1) + j;
			document.write ('<div class="paletkol">');
			document.write ('	<div id = "dragidd' + ij + '">');
			document.write ('	<div class = "dragcl" id="dragid' + ij + '" draggable="true" ondragstart="drag(event)">');
			document.write ('		<svg>');
			document.write ('			<circle id="kleur" cx="11" cy="11" r="11" fill="' + klix[ij-1] + '" />');
			document.write ('		</svg>');
			document.write ('	</div>');
			document.write ('	</div>');
			document.write ('</div>');
		}
		document.write ('</div>');
	}
}

function drawblackwhite() {
	var klix = ["black", "#e8e8e8"];

	for (i=1; i<=2; i++) {
		document.write ('<div class="zwartwitrij">');
		for (j=1; j<=5; j++) {
			var ij = 5 * (i - 1) + j;
			document.write ('<div class="zwartwitkol">');
			document.write ('	<div id = "zwdd' + ij + '">');
			document.write ('	<div class = "blackwhite" id="zwartwitid' + ij + '" draggable="true" ondragstart="drag(event)">');
			document.write ('		<svg>');
			document.write ('			<circle id="zwwi" cx="5" cy="5" r="5" fill="' + klix[i-1] + '" />');
			document.write ('		</svg>');
			document.write ('	</div>');
			document.write ('	</div>');
			document.write ('</div>');
		}
		document.write ('</div>');
	}
}


//	Drag & Drop functions

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	dragitem = ev.target;
	dragparent = dragitem.parentNode.id
	dragid = dragitem.id;

	if (speltype == "handmatig" || dragid.substr (0, 4) == "drag") {
		var bdrop = 0;
		if (dragparent.substr (0, 4) == "drop") {
			jj = dragparent.replace ("dropid", "") * 1;
			jj = (jj - jj % 10) / 10;
			if (jj != beurt) { bdrop = 1; }
		}
		if (bdrop == 0) {
			bauto = 1;
			ev.dataTransfer.setData("text", ev.target.id);

			ouder = document.getElementById(dragid).parentElement.id;
			kloon = dragitem.cloneNode(true);
		} }
	else {
		bauto = 0;
	}
}

function drop(ev) {
	dropitem = ev.target;
	dropid = dropitem.id;

	rol = document.getElementById("rol").innerHTML;
	console.log("nu in drop-functie: rol = " + rol);
	delstat = 0;

	b2 = 0;
	c1 = dragid.substr (0, 4);
	c21 = (beurt == 0 && rol == "codekraker") ? true : false;
	c22 = (beurt > 0 && rol == "codemaster") ? true : false;

	if (c1 == "drag" && (c21 || c22)) {
		b2 = -1;
	}
	if (dragid.substr (0, 5) == "zwart" && rol == "codekraker") {
		b2 = -1;
	}
	if (b2 >= 0) {
		if (dropid.substr (0, 4) == "drop") {
			ii = dropid.replace ("dropid", "") * 1;
			ii = (ii - ii % 10) / 10;
		}
		if (dropid.substr (0, 3) == "pin") { ii = dropid.substr (5, 1); }

		if ((dropid.substr (0, 4) == "drop" && dragid.substr (0, 4) == "drag") || (dropid.substr (0, 3) == "pin" && dragid.substr (0, 5) == "zwart")) {
			if (dropid.substr (0, 4) == "drop" && dragid.substr (0, 4) == "drag") { x = 0; }
			if (dropid.substr (0, 3) == "pin" && dragid.substr (0, 5) == "zwart") { x = 1; }

			b = 1; }
		else {
			b = 0;
		}
	}
	if (b == 1 && ii == beurt - x) {
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		ev.target.appendChild(document.getElementById(data));

		document.getElementById(ouder).appendChild(kloon);
		if (dropid.substr (0, 4) == "drop" && dragid.substr (0, 4) == "drag") {
			var jj = dropid.substr (7,1);
			var kl = dragid.substr (6,1);
			if (beurt == 0) {
				xgis[jj] = kl;
			} else {
				ygis[jj] = kl;
			}
		}
		if (dropid.substr (0, 4) == "drop" && dragparent.substr (0, 4) == "drop") {
			var jj = dragparent.replace ("dropid", "") ;
			var j = jj % 10;
			$("#dropid" + jj).empty();
			j = (jj[0] == "0") ? jj[1] * 1 : jj * 1;
			if (beurt == 0) {
				xgis[j] = 0;
			} else {
				ygis[j] = 0;
			}
		}

	}
	else {
		if (bauto == 1) {
			alert ("U kunt hier geen pinnetje plaatsen."); }
		else {
			alert ("pinnetjes worden automatisch geplaatst...");
		}
    }

	tp = (rol == "codemaster") ? 3 : 1;
	statusArr2[beurt] = updStatusArr(1, beurt, 0, 0);
	// console.log("statusArr2[" + beurt + "] = " + statusArr2[beurt]);
	// console.log("statusArr2 = " + statusArr2);
    makeMove(statusArr2);
    
}

function updStatusArr(tp, brt, nzw, nwi) {
	var statusArr = new Array;

	npos = 5;
	rolx = (tp <=2) ? "codemaster" : "codekraker";

	statusArr[0] = tp;
	statusArr[1] = brt;
	if (brt == 0) {
		for (j=1; j<=npos; j++) {
			statusArr[j+1] = 1 * xgis[j];
		}
	} else {
		for (j=1; j<=npos; j++) {
			statusArr[j+1] = 1 * ygis[j];
		}
	}
	statusArr[8] = nzw;
	statusArr[9] = nwi;
	statusArr[10] = delstat;

	return statusArr;
}

function fmt00(i) {
	i00 = (i<10) ? "0" + i : i;
	return i00;
}
