

function splitGamestate(gamestate, l) {
    var ygs = new Array;

    ygs['type'] = gamestate[l][0];
    ygs['beurt'] = gamestate[l][1];
    ygs['pos1'] = gamestate[l][2];
    ygs['pos2'] = gamestate[l][3];
    ygs['pos3'] = gamestate[l][4];
    ygs['pos4'] = gamestate[l][5];
    ygs['pos5'] = gamestate[l][6];
    ygs['pos6'] = gamestate[l][7];
    ygs['nzw'] = gamestate[l][8];
    ygs['nwi'] = gamestate[l][9];
    ygs['delstat'] = gamestate[l][10];

    return ygs;
}

function vulrijenSpeelbord(npos, brt, ygsi) {
    for (i = 0; i <= brt; i++) {
        verwijderrij(npos, i);
        for (j = 1; j <= npos; j++) {
            ij = (i == 0) ? "0" + j : 10 * i + j;
            xkl = ygsi['pos' + j];
            if (xkl > 0) {
                knopje = document.getElementById("dragid" + xkl);
                dropje = document.getElementById("dropid" + ij);
                knopkloon = knopje.cloneNode(true);
                dropje.appendChild(knopkloon);                               
            }
        }
    }
}

function verwijderrij(ni, i) {
    for (j = 1; j <= ni; j++) {
        ij = (i == 0) ? "0" + j : 10 * i + j;
        $("#dropid" + ij).empty();
    }
}

function procesturn(turn) {
    console.log("procesturn: statusArr2 = " + statusArr2);
    rol = document.getElementById("rol").innerHTML;

    l = statusArr2.length - 1;

    if (l >= 0) {
        tp = statusArr2[l][0];
        beurt = statusArr2[l][1];

        // if (beurt == 0) {
        //     if (rol == "codemaster") {
        //         document.getElementById("knop0").style.visibility = "hidden";
        //         document.getElementById("kleurenpalet").style.visibility = "hidden";
        //     } else {
        //         document.getElementById("knop1").style.visibility = "visible";
        //         document.getElementById("kleurenpalet").style.visibility = "visible";
        //         document.getElementById("kleurenpalet").style = "margin-top:0";
        //     }
        // } else {
        //     h = 45 * beurt;
        //     bvis = (rol == "codemaster") ? "visible" : "hidden";
        //     bhid = (rol == "codemaster") ? "hidden" : "visible";
        //     if (rol == "codemaster") {
        //         if (tp == 1) {
        //             document.getElementById("knop" + beurt).style.visibility = "visible";
        //         } else {

        //         }
        //     } else
        //         if (beurt < 10) {
        //         document.getElementById("knop" + beurt + 1).style.visibility = "visible";
        //     }
        //     document.getElementById("kleurenpalet").style.visibility = bhid;
        //     document.getElementById("kleurenpalet").style = "margin-top:" + h + "px";
        //     document.getElementById("pinnen").style.visibility = bvis;
        //     document.getElementById("pinnen").style = "margin-top:" + h + "px";
        // }
        
        if (tp == 4) { beurt++; l++; }
        tp = (tp == 4) ? 1 : tp + 1;

        // alert("Hallo, l = " + l);
        console.log("nu in procesturn-functie");
        console.log("l = " + l);
        console.log(statusArr2);
        statusArr2[l] = [];
        statusArr2[l][0] = tp;
        statusArr2[l][1] = beurt;

        alert("beurt, l, tp = " + beurt + ", " + l + ", " + tp);
    }
}
    



// ***********************************************************************************************************


function visHide(brt, rol) {

    if (brt == 0) {
        document.getElementById("kleurenpalet").style = "margin-top: 450px";
    } else {
        mt = 40 * brt;
        document.getElementById("kleurenpalet").style = "margin-top: " + mt + "px";                   
    }

    if (brt == 0 && rol == "codemaster" || brt > 0 && rol == "codekraker") {
        document.getElementById("kleurenpalet").style.visibility = "visible";
        document.getElementById("pinnen").style.visibility = "hidden";                  
    } else {
        document.getElementById("kleurenpalet").style.visibility = "hidden";
        document.getElementById("pinnen").style.visibility = "visible";                       
    }
    if (brt == 0) {
        document.getElementById("pinnen").style.visibility = "hidden";
        if (rol == "codemaster") {
            document.getElementById("knop0").style.visibility = "visible";
        } else {
            document.getElementById("knop0").style.visibility = "hidden";                        
        }
    } 

    if (rol == "codemaster") {
        document.getElementById("cover").style.visibility="hidden"; 
    } else {
        document.getElementById("cover").style.visibility="visible";
    }
    
}


// ***********************************************************************************************************


function consoleLog(ygsi) {
    console.log ("type = " + ygsi['type']);
    console.log ("pos1 = " + ygsi['pos1']);
    console.log ("pos2 = " + ygsi['pos2']);
    console.log ("pos3 = " + ygsi['pos3']);
    console.log ("pos4 = " + ygsi['pos4']);
    console.log ("pos5 = " + ygsi['pos5']);
}
