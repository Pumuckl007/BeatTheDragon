var dragon = {};
dragon.tree = [];
dragon.posibilites = ["tic", "tac", 100, 150, 250, 300, 400, 500, "dragon"];
dragon.loses = [];
dragon.wins = [];
dragon.win = 0;
dragon.loose = 0;
dragon.factorials = [1,9,72,504,3024,15120,60480,181440,362880]
dragon.genTable = function(){
  dragon.tree = dragon.genSubTree(dragon.posibilites, 0, 0, []);
}
dragon.genSubTree = function(posibilitesLeft, ticTac, money, history){
  if(posibilitesLeft.length <= 1){
    return posibilitesLeft;
  }
  var array = [];
  for(var i = 0; i<posibilitesLeft.length; i++){
    var doUpdate = true;
    var localTicTac = ticTac;
    var localMoney = money;
    var posibilitesLeftNext = posibilitesLeft.slice(0);
    posibilitesLeftNext.splice(i, 1);
    if(posibilitesLeft[i] != "dragon"){
      if(typeof posibilitesLeft[i] === 'string' || posibilitesLeft[i] instanceof String){
        if(localTicTac > 0){
          doUpdate = false;
          array[posibilitesLeft[i]] = "WIN!";
        } else {
          localTicTac ++;
        }
      } else {
        if(localMoney + posibilitesLeft[i] >= 1000){
          doUpdate = false;
          array[posibilitesLeft[i]] = "WIN!";
        } else {
          localMoney += posibilitesLeft[i];
        }
      }
      if(doUpdate){
        var his = history.slice(0);
        his.push(posibilitesLeft[i]);
        array[posibilitesLeft[i]] = dragon.genSubTree(posibilitesLeftNext, localTicTac, localMoney, his);
      }
    } else {
      array[posibilitesLeft[i]] = "LOOSE!";
      var his = history.slice(0);
      his.push(posibilitesLeft[i]);
      dragon.loses.push(his);
    }
    if(array[posibilitesLeft[i]] === "WIN!"){
      var his = history.slice(0);
      his.push(posibilitesLeft[i]);
      dragon.wins.push(his);
    }
  }
  return array;
}

dragon.updateDom = function(){
  var wins = document.getElementById("wins");
  for(var i = 0; i<dragon.wins.length; i++){
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.innerHTML = (i+1).toString();
    tr.appendChild(td);
    for(var k = 0; k<dragon.wins[i].length; k++){
      var td = document.createElement("td");
      td.innerHTML = dragon.wins[i][k];
      tr.appendChild(td);
    }
    td = document.createElement("td");
    var math = dragon.factorials[dragon.wins[i].length];
    td.innerHTML = "1/" + (math).toString();
    tr.appendChild(td);
    dragon.win += 60480/math;
    wins.appendChild(tr);
  }
  var loses = document.getElementById("loses");
  for(var i = 0; i<dragon.loses.length; i++){
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.innerHTML = (i+1).toString();
    tr.appendChild(td);
    for(var k = 0; k<dragon.loses[i].length; k++){
      var td = document.createElement("td");
      td.innerHTML = dragon.loses[i][k];
      if(k+1===dragon.loses[i].length){
        td.style.backgroundColor = "red";
      }
      tr.appendChild(td);
    }
    td = document.createElement("td");
    var math = dragon.factorials[dragon.loses[i].length];
    td.innerHTML = "1/" + (math).toString();
    tr.appendChild(td);
    dragon.loose += 60480/math;
    loses.appendChild(tr);
  }
}

dragon.playGame = function(){
  var times = parseInt(document.getElementById("numberOfTries").value);
  var wins = 0;
  var loses = 0;
  for(var i = 0; i<times; i++){
    var finished = false;
    var ticTac = 0;
    var money = 0;
    var posibilitesLeft = dragon.posibilites.slice(0);
    while(!finished){
      var index = Math.floor(Math.random()*posibilitesLeft.length);
      if(posibilitesLeft[index] === "dragon"){
        finished = true;
        loses ++;
      } else if(typeof posibilitesLeft[index] === 'string' || posibilitesLeft[index] instanceof String){
        ticTac ++;
        if(ticTac >= 2){
          finished = true;
          wins++;
        }
      } else {
        money += posibilitesLeft[index];
        if(money >= 1000){
          finished = true;
          wins ++;
        }
      }
      posibilitesLeft.splice(index, 1);
    }
  }
  dragon.wins = wins;
  dragon.loses = loses;
  return "Game Wins: " + wins + " Loses: " + loses + "<br>" +
  "Game P(Wining) = " + wins/(loses+wins) + "<br>" +
  "Predicted P(Wining) = " + dragon.win/(dragon.loose+dragon.win) + " = " + dragon.win + " / " + (dragon.loose+dragon.win);
}

window.onload = function(){
  dragon.genTable();
  dragon.updateDom();
}
