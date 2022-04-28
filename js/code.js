//Объект для вывода состояния игры
let view = {
    displayMessage : function(msg){
        let message = document.getElementById('messageArea');
        message.setAttribute("class","content__messageArea");
        message.innerHTML = msg;    
    },
    displayHit : function(hit){
        let step = document.getElementById(hit);
        step.setAttribute("class", "hit");
    },
    displayMiss : function(miss){
        let step = document.getElementById(miss);
        step.setAttribute("class", "miss");
    },
    displaySunk : function(sunk){
        let step = document.getElementById(sunk);
        step.setAttribute("class", "sunk");
    },
    displayCount : function(ship, sunk){
        let message = document.getElementById('count');
        let str = ("Ships above the water: " + (ship-sunk) + " Ships under the water: " + sunk);
        message.innerHTML = str;    
    }
}
//Логика игры
let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    lastFire: 0,
    ships:
     [
        {location : ["0","0","0"], hits : ["","",""]},
        {location : ["0","0","0"], hits : ["","",""]},
        {location : ["0","0","0"], hits : ["","",""]}
    ],
    fire: function(guess)
    { 
        for(let i=0; i<this.numShips;i++)
        {
            let ship = this.ships[i];
            let location = ship.location;
            let hits = ship.hits;
            for(let i=0; i<location.length;i++)
            {   
                if(location[i]==guess)
                {
                    if(hits[i]!=='hit')
                    {
                        ship.hits[i] = "hit";
                        view.displayHit(guess);
                        view.displayMessage("You hit");
                        if(this.isSunk(ship))
                        {
                            for(let i=0; i<location.length;i++){
                                view.displaySunk(location[i]);
                            }
                            this.shipsSunk++;
                            view.displayMessage("You sunk my ship");
                        }
                        return true;
                    }
                    else{
                        alert("oops you already fired here");
                        return false;
                    }
                }
            }
            
        }
        if(this.lastFire === 0 || guess !== this.lastFire){
            view.displayMiss(guess);
            view.displayMessage("You miss");
            this.lastFire = guess;
            return false;
        }
        else{
            alert("oops you already fired here");
            return false;
        }
    
    },
    isSunk: function(sunk){
        for(let i=0; i<this.shipLength;i++){
            if(sunk.hits[i] !== "hit")
                return false;
            else {
                for(let i=0; i<sunk.hits.length;i++){
                    if(sunk.hits[i] !== "hit")
                    return false;
                }
                return true;
            }
        }
    },
    //Создание кораблей
    generateShipLocations: function(){
        for(let i=0; i<this.numShips;i++){
            this.ships[i].location = this.generateShip();
        }
        for(i=0; i<this.numShips;i++){
            let ship = this.generateShip();
            if(this.collision(ship))
            this.ships[i].location = ship;
            console.log(this.ships[i].location)    
        }
    },
    //Генерация позиций кораблей
    generateShip: function(){
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        let newShipLocation = [];
        if(direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
         }
         else{
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
         }
         for (var i = 0; i < this.shipLength; i++){
             if(direction === 1){
                 newShipLocation.push(row + "" + (col + i));
             }
             else{
                newShipLocation.push((row + i) + "" + (col));
             }
         }
        return newShipLocation;
    },
    //Проверка на правильное расположение
    collision: function(locations){
        for(let i = 0; i < this.shipLength; i++){
            for(let j=0; j < this.shipLength; j++){
                for(let k=0; k< this.shipLength; k++){
                    if(locations[k]===this.ships[i].location[j]) return false;
                }
            }
        }
        return true;
    }

}
// Итоговая связь остальных объектов 
controller = {
    guesses: 0,
    listenCell: function(evt) {
        controller.proccesGuess(evt.target.getAttribute('id'));
    },
    proccesGuess: function(guess){
        if(guess){
            this.guesses++;
            let hit = model.fire(guess);
            view.displayCount(model.numShips,model.shipsSunk);
            if(hit && model.shipsSunk === model.numShips){
                let arr = document.querySelectorAll('td')
                for(let i=0; i< arr.length; i++){
                        arr[i].removeEventListener('click', this.listenCell);
                    }  
                setTimeout(() =>
                {
                    view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
                    alert("You win, congratulation!!!!")
                },1000)
            }
        }
    },
}

function init()
{
    model.generateShipLocations();
    let arr = document.querySelectorAll('td')
    for(let i=0; i< arr.length; i++){
            arr[i].addEventListener('click', controller.listenCell)
        }  
    
}
window.onload = init;

