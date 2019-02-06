
function genereercode() {
	var testkl = new Array(7, 9, 3, 3, 8);

	for (i=1; i<=5; i++) {

		var random = Math.floor(Math.random() * 10);
		var rnd10 = random % 10;
		xgis[0, i] = rnd10;

//		alert(i + ": " + xgis[0,i] + ", " + xgis[i]);

//		xgis[i] = testkl[i-1];

		if (rnd10 > 0) {
			kleur = document.getElementById("dragid" + xgis[0, i]);  // was xgis[i]... (?)
			klkloon = kleur.cloneNode(true);
			document.getElementById("dropid0" + i).appendChild(klkloon);
		}

		updStatus("kncon", 1, 0, 0, 0);
		statusArr2[0] = updStatusArr(1, 0, 0, 0);

	}
}

/*	-----------------------------------------------------------------------------------------------------------------	*/

function plaatspins(ii) {
	var nwi;
	var zwjj = new Array(6);
	var jpin = new Array(1, 4, 2, 5, 3);
	var zwart; var zwkloon;
	var wit; var witkloon;

	nzw = nzwartpin (ii, zwjj);

//	alert ("nzw = " + nzw);

	if (nzw < 5) {
		nwi = nwitpin (ii, zwjj);

//		alert ("nwit = " + nwi);

		for (j=1; j<=nzw; j++) {
			zwart = document.getElementById("zwartwitid1");
			zwkloon = zwart.cloneNode(true);
			document.getElementById("pinid" + ii + jpin[j-1]).appendChild(zwkloon);
		}
		for (j=nzw + 1; j<=nzw + nwi; j++) {
			wit = document.getElementById("zwartwitid6");
			witkloon = wit.cloneNode(true);
			document.getElementById("pinid" + ii + jpin[j-1]).appendChild(witkloon);
		}
		if (ii == 10) {
			eindespel (ii, 0);
		}
		
		updStatus("contr", 0, 1, ii, nzw, nwi);

	} else {
		for (j=1; j<=5; j++) {
			zwart = document.getElementById("zwartwitid1");
			zwkloon = zwart.cloneNode(true);
			document.getElementById("pinid" + ii + jpin[j-1]).appendChild(zwkloon);
		}
		eindespel (ii, 1);

		updStatus("contr", 1, 1, ii, nzw, 0);
	}

	return nzw;
}

function nzwartpin(ii, zwjj) {
	var t;

	t = 0;
	for (j=1; j<=5; j++) {
		if (ygis[j] == xgis[j])  {
			t++;
			zwjj[j] = 1; }
		else {
			zwjj[j] = 0;
		}
	}
	return t;
}


function nwitpin(ii, zwjj) {
	var t; var b;
	var dkl0; var dkl;

	t = 0;
	for (j=1; j<=5; j++) {
		b = 0;
		dkl0 = 0; dkl = 0;

//		alert ("zwjj(" + j + ") =  " + zwjj[j]);

		if (zwjj[j] == 0) {

//			alert ("vindkl(" + ii + ", " + j + ") =  " + vindkl(ii, j));

			if (vindkl (ii, j) == 1) {
				if (j > 1) {
					for (jj=1; jj<=j-1; jj++) {
						if (ygis[jj] == ygis[j] && ygis[jj] != xgis[jj]) {
							dkl++;
						}
					}
					for (jj=1; jj<=5; jj++) {
						if (jj != j) {
							if (ygis[j] == xgis[jj] && ygis[jj] != xgis[jj]) {
								dkl0++;
							}
						}
					} }
				else {
					if (ygis[j] != xgis[j]) {
						for (jj=2; jj<=5; jj++) {
							if (xgis[jj] == ygis[j] && xgis[jj] != ygis[jj]) {
								b = 1;
							}
						}
					}
				}
				if (b == 1 || dkl0 > dkl) {
					t++;
				}
			}
		}

//		alert ("j =  " + j + "        zwjj(" + j + ") =  " + zwjj[j] + "        vindkl(" + ii + ", " + j + ") =  " + vindkl(ii, j));
//		alert ("b =  " +b + "        dkl0 =  " + dkl0 + "        dkl =  " + dkl);

	}

	return t;
}

function vindkl (ii, j) {
	var jj; var b;

	jj = 0; b = 0;
	do {
		jj++;
		if (xgis[jj] == ygis[j]) {
			b = 1;
		}
	}
	while (b == 0 && jj < 5);

	return b;
}

function eindespel(ii, res) {
	var strtry;

	if (res == 0) {
		alert ("Sorry!  You haven't cracked the code.  Try again!");
	}
	else {
		if (ii == 1) {
			strtry = "try"; }
		else {
			strtry = "tries";
		}

		alert ("Congratulations!  You cracked the code in " + ii + " " + strtry + ".");
	}

	$("#cover").css("visibility", "hidden");
	$("#nwspelknop").css("visibility", "visible");
}

function vulinitdata(arg) {
	document.getElementById("initdata").innerHTML = arg;
}

function showdata() {
	x1 = document.getElementById("npos").value;
	x2 = document.getElementById("nkleur").value;
	alert ("npos = " + x1 + ", nkleur = " + x2);
}
