let view = {
    displayMessage : function(msg){
        let message = document.getElementById('messageArea');
        message.setAttribute("class","content__messageArea");
        message.innerHTML = msg;    
    },
    displayHit : function(hit){
        let step = document.getElementById(hit);
        step.setAttribute("class","hit")
    },
    displayMiss : function(miss){
        let step = document.getElementById(miss);
        step.setAttribute("class", "miss");
    },
    displaySunk : function(sunk){
        let step = document.getElementById(sunk);
        step.setAttribute("class", "sunk");
    },
}
let model = {
    boardSize: 7,
    step: 1,
    numShips: 10,
    shipLength: [1,1,1,1,2,2,2,3,3,4],
    shipsSunkFirst: 0,
    shipsSunkSecond:0,
    lastFireFirst: 0,
    lastFireSecond: 0,
    shipsFirst:
     [
        {location : ["00"], hits : [""]},
        {location : ["01"], hits : [""]},
        {location : ["02"], hits : [""]},
        {location : ["03"], hits : [""]},
        {location : ["0","0"], hits : ["",""]},
        {location : ["0","0"], hits : ["",""]},
        {location : ["0","0"], hits : ["",""]},
        {location : ["0","0","0"], hits : ["","",""]},
        {location : ["0","0","0"], hits : ["","",""]},
        {location : ["0","0","0","0"], hits : ["","","",""]}
    ],
    shipsSecond:
    [
       {location : ["67"], hits : [""]},
       {location : ["0"], hits : [""]},
       {location : ["0"], hits : [""]},
       {location : ["0"], hits : [""]},
       {location : ["0","0"], hits : ["",""]},
       {location : ["0","0"], hits : ["",""]},
       {location : ["0","0"], hits : ["",""]},
       {location : ["0","0","0"], hits : ["","",""]},
       {location : ["0","0","0"], hits : ["","",""]},
       {location : ["0","0","0","0"], hits : ["","","",""]}
   ],
   fire: function(guess){
       let step = this.step%2;
        if(step === 0)
        {
            if(guess => "66" ){
                for(let i=0;i<this.numShips;i++){
                    let shipFirst = this.shipsFirst[i].location;
                    let hitsFirst = this.shipsFirst[i].hits;
                    for(let j=0; j<shipFirst.length;j++){
                        if(shipFirst[j]===guess){
                            if(hitsFirst[j] !== "hit"){
                                hitsFirst[j] = "hit";
                                view.displayHit(guess);
                                view.displayMessage("You hitted");
                                this.step++;
                                return true;
                            }
                            else{
                                alert("oops you already fired here");
                                return false;
                            }
                        }
                        if(this.lastFireFirst === 0 || guess !== this.lastFireFirst){
                            view.displayMiss(guess);
                            view.displayMessage("You missed");
                            this.lastFireFirst = guess;
                            console.log(this.step)
                            this.step++;
                            return false;
                        }
                        else{
                            alert("oops you already fired here");
                            return false;
                        }
                    }
                }
                
            }
            else{
                alert("Now not your turn");
                return false;  
            }
        }
        if(step !== 0)
        {
            if(guess <= "67" ){
                for(let i=0;i<this.numShips;i++){
                    let shipSecond = this.shipsSecond[i].location;
                    let hitsSecond = this.shipsSecond[i].hits;
                    for(let j=0; j<shipSecond.length;j++){
                        if(shipSecond[j]==guess){
                            if(hitsSecond[j] !== "hit"){
                                view.displayHit(guess);
                                this.step++;
                                return true;
                            }
                            else{
                                alert("oops you already fired here");
                                return false;
                            }
                        }
                        if(this.lastFireSecond === 0 || guess !== this.lastFireSecond){
                            view.displayMiss(guess);
                            view.displayMessage("You missed");
                            this.step++;
                            this.lastFireSecond = guess;
                            return false;
                        }
                        else{
                            alert("oops you already fired here");
                            return false;
                        }
                    }
                }
            }
            else{
                alert("Now not your turn");
                return false;
            }
        }
 }
}
let controller = {
    listenCell: function(evt) {
        controller.proccesGuess(evt.target.getAttribute('id'));
    },
    proccesGuess : function(guess){
        if(guess){
            let hit = model.fire(guess);
        }
    }
}
function init()
{
    let arr = document.querySelectorAll('td')
    for(let i=0; i< arr.length; i++){
            arr[i].addEventListener('click', controller.listenCell)
        }  
    
}
window.onload = init;

