// SOCKET.IO VARIABLES
var mysql = require('mysql');
var io = require('socket.io');
var server = io.listen(3000);
var gameserver = server.of('/game');
var queueserver = server.of('/queue');

// DATABASE VARIABLES
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'ohg'
})

// GAME SERVER VARIABLES & FUNCTIONS
// Games Available Template = Game Name: [Player Count, Initial Game State, Extra player input per turn]
var gamesAvailable = {
    bke: [2, '[[0,0,0],[0,0,0],[0,0,0]]', 0],
    bke2: [2, '[[0,0,0],[0,0,0],[0,0,0]]', 0],
    mastermind: [2, '[[],[],[]]', 0],
    mejn: [4, '[]', 0],
    mejn2: [2, '[]', 0],
    mejn3: [3, '[]', 0],
    mejn4: [4, '[]', 0],
    chess: [2, '\"init\"', 0],
    voer: [2, "[[],[],[],[],[],[],[]]", 0],
    template: [2, "[[],[],[]]", 0]
};
var globalGameState = [];
var globalQueueData = [];
var connectedUsers = [];
function randomUser(amount) {
    return Math.floor(Math.random() * amount)
}

// USER CONNECT
gameserver.on('connection', function(socket) {
    // JOIN ROOM
    // console.log("hallo");
    socket.on('join room', function(gData) {
        if(Object.keys(gamesAvailable).indexOf(gData.game) !== -1){
            connectedUsers[gData.user] = socket.id;
            var room = gData.game + gData.room;
            socket["game"] = gData.game;
            socket["room"] = room;
            var playerAmount = gamesAvailable[gData.game][0];
            socket.join(room);
            socket["username"] = gData.user;

            // SET UP INITIAL GAMESTATE
            if (globalGameState[room] == null) {
                globalGameState[room] = [];
                globalGameState[room]['users'] = [];
                globalGameState[room]['count'] = 0;
                globalGameState[room]['gamestate'] = gamesAvailable[gData.game][1];
                globalGameState[room]['game'] = gData.game;
                globalGameState[room]['result'] = [];
            } else if (globalGameState[room]["active"] != null) {
                var sendTo = connectedUsers[globalGameState[room]["users"][globalGameState[room]["active"]]];
                gameserver.to(`${sendTo}`).emit('game turn', 1);
            }
            if (globalGameState[room] != null) {
                gameserver.to(room).emit('game state', JSON.parse(globalGameState[room]['gamestate']));
                if (globalGameState[room]["result"][0] == "gameEnd") {
                    gameserver.to(room).emit('game turn', 2);
                    var ruleSet = require('./game_rules/rules_' + globalGameState[room]['game'] + '.js');
                    ruleSet.gameEnd(socket, room, globalGameState, server);
                    delete require.cache[require.resolve('./games_rules/rules_' + globalGameState[room]['game'] + '.js')];
                }
            }
            // SET UP INITIAL USERS
            if (globalGameState[room]['users'].length < playerAmount) {
                if (globalGameState[room]['users'].indexOf(gData.user) < 0) {
                    globalGameState[room]['users'].push(gData.user);
                }
                if (globalGameState[room]['users'].length == playerAmount) {
                    globalGameState[room]["active"] = randomUser(playerAmount);
                    
                    // SETTING UP PLAYER ROLES/INIT
                    var ruleSet = require('./game_rules/rules_' + globalGameState[room]['game'] + '.js');
                    globalGameState[room]["init"] = ruleSet.gameInit(globalGameState, room);
                    delete require.cache[require.resolve('./game_rules/rules_' + globalGameState[room]['game'] + '.js')];
                    
                    gameserver.to(room).emit('game init', globalGameState[room]["init"]);
                    console.log("game full, room '" + room + "' started with players: " + globalGameState[room]['users'] + ", starting player: " + globalGameState[room]["active"]);
                    var sendTo = connectedUsers[globalGameState[room]["users"][globalGameState[room]["active"]]];
                    gameserver.to(`${sendTo}`).emit('game turn', 1);
                }
            }
        }
    });

    // PROCESS GAME MOVE
    socket.on('game move', function(move) {
        if(Object.keys(gamesAvailable).indexOf(socket.game) !== -1){
            room = socket.room;
            if (globalGameState[room]["users"][globalGameState[room]["active"]] == socket.username) {

                // GAME SPECIFIC MOVE
                var ruleSet = require('./game_rules/rules_' + globalGameState[room]['game'] + '.js');
                ruleSet.gameMove(globalGameState, room, move);

                // RETURN GAMESTATE TO ALL USERS IN ROOM
                gameserver.to(room).emit('game state', JSON.parse(globalGameState[room]['gamestate']));

                // BACKUP GAME STATE TO DATABASE
                var dbData = false;
                db.query(`SELECT id FROM ${socket.game} WHERE room = "${room}"`)
                .on('result', function(data){
                    dbData = data;
                })
                .on('end', function(){
                    if(dbData){
                        db.query(`UPDATE ${socket.game} SET gamestate = '${globalGameState[room]['gamestate']}' WHERE room = "${room}"`)
                    } else {
                        db.query(`INSERT INTO ${socket.game} (room, gamestate, winner) VALUES ("${room}", '${globalGameState[room]['gamestate']}', 0)`); 
                    }
                })

                // END OF MOVE - SWAP PLAYER
                if (globalGameState[room]['count'] < gamesAvailable[globalGameState[room]['game']][2]) {
                    globalGameState[room]['count']++
                } else {
                    globalGameState[room]['count'] = 0;
                    socket.emit('game turn', 0);
                    if (globalGameState[room]["active"] < (globalGameState[room]["users"].length - 1)) {
                        globalGameState[room]["active"]++
                    } else {
                        globalGameState[room]["active"] = 0;
                    }
                    var sendTo = connectedUsers[globalGameState[room]["users"][globalGameState[room]["active"]]];
                    gameserver.to(`${sendTo}`).emit('game turn', 1);
                }
                // DETECT GAME ENDING
                if (globalGameState[room]["result"][0] == "gameEnd") {
                    gameserver.to(room).emit('game turn', 2);
                    ruleSet.gameEnd(socket, room, globalGameState, server);
                    db.query(`UPDATE ${socket.game} SET winner = '${globalGameState[room]["winner"]}' WHERE room = "${room}"`);
                    globalGameState[room]['active'] = -1;
                    console.log("game in room '" + room + "' ended");
                }
                delete require.cache[require.resolve('./game_rules/rules_' + globalGameState[room]['game'] + '.js')];
            }
        }
    });
    // DISCONNECT
    socket.on('disconnect', function() {
        delete connectedUsers[socket.username]
    });
});

/**
 * 
 * END OF GAMESERVER
 * 
 * START OF QUEUE SYSTEM
 * 
 */

queueserver.on('connection', function(socket) {
    socket.on('join room', function(data) {
        var room = data.game;
        socket["room"] = room;
        socket["user"] = data.user;
        if (globalQueueData[room] == null) {
            globalQueueData[room] = [];
        }
        socket.join(room);
        globalQueueData[room][data.user] = [data.user, socket.id];
        queueserver.to(room).emit('queue', Object.keys(globalQueueData[room]));
    });

    socket.on('invite', function(invite) {
        if(globalQueueData[socket.room][invite] != null) {
            var sendTo = globalQueueData[socket.room][invite][1];
            queueserver.to(`${sendTo}`).emit('invited', socket.user);
        }
    });

    socket.on('response', function(res) {
        if(res[0]){
            var sendTo = globalQueueData[socket.room][res[1]][1];
            queueserver.to(`${sendTo}`).emit('confirm', socket.user);
        }
    });

    socket.on('disconnect', function() {
        if(socket.room != null){
            delete globalQueueData[socket.room][socket.user];
            queueserver.to(socket.room).emit('queue', Object.keys(globalQueueData[socket.room]));
        }
    });
});