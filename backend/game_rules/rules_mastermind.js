//
// TEMPLATE RULESET
//

exports.gameInit = function(globalGameState, room) {
    var users = {}
    var user0 = globalGameState[room]["users"][0];
    var user1 = globalGameState[room]["users"][1];
    
    userC = user0.split("%");
    console.log("userC[0] = " + userC[0] + ", userC[1] = " + userC[1]);
    if(userC[1] == "codemaster") {
        users[user0] = "codemaster";
        users[user1] = "codekraker";
        globalGameState[room]["active"] = 0;
    } else {
        users[user0] = "codekraker";
        users[user1] = "codemaster";
        globalGameState[room]["active"] = 1;
    }
    return users;
}

exports.gameMove = function(globalGameState, room, move) {
    console.log(move);
    // GET current gamestate and active player
    var gamestate = move; //JSON.parse(globalGameState[room]["gamestate"]);
    var currentPLayer = globalGameState[room]["active"]; 
    

    //  CHECK win condition (Fills globalGameState[room]["result"] with an ARRAY, 
    //  first value of array after game end HAS to be "gameEnd", leave empty for no game end)
    // globalGameState[room]["result"] = winCon(gamestate, currentPLayer);

    // SUBMIT new gamestate

    l = gamestate.length - 1;
    tp = gamestate[l][0];
    if (tp == 1 || tp == 3) {
        globalGameState[room]["count"]--;
    }


    gamestate = JSON.stringify(gamestate);
    globalGameState[room]["gamestate"] = gamestate;
}

exports.gameEnd = function(socket, room, globalGameState, server) {
    globalGameState[room]["winner"] = "" // SET WINNER NAME HERE FOR DATABASE BACKUP
    // This gets executed when globalGameState[room]["result"][0] === "gameEnd", use this to send data to user, eg: winner, etc
}

function ruleSet(move, gamestate) {
    // You can use a function like this to check the game input against game rules, for exmaple
    // return 1 for valid input and 0 for invalid, and use this as an if(ruleSet){} around your game logic.
    // This can be used in any way though. 
}

function winCon(gamestate, user) {
    // Function should handle all game ending events, wins or stalemates. Return array with first value being "gameEnd"
}