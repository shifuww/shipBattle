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
    displayCount : function(ship, sunk, guesses){
        let message = document.getElementById('count');
        let str = ("Ships above the water: " + (ship-sunk) + " Ships under the water: " + sunk +" Guesses:" + (guesses-controller.guesses));
        message.innerHTML = str;    
    }
}
//Логика игры
let model = {
    boardSize: 7,
    numShips: 10,
    shipLength: [1,1,1,1,2,2,2,3,3,4],
    shipsSunk: 0,
    lastFire: 0,
    numGuess: 45,
    ships:
     [
        {location : ["0"], hits : [""]},
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
                        view.displayMessage("You hitted");
                        if(this.isSunk(ship))
                        {
                            for(let i=0; i<location.length;i++){
                                view.displaySunk(location[i]);
                            }
                            this.shipsSunk++;
                            view.displayMessage("You sunked my ship");
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
            view.displayMessage("You missed");
            this.lastFire = guess;
            return false;
        }
        else{
            alert("oops you already fired here");
            return false;
        }
    
    },
    isSunk: function(sunk){
        for(let i=0; i<this.numShips;i++){
            if(sunk.hits[i] !== "hit")
                return false;
            if(sunk.hits[i] === "hit") {
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
        outter : for(let i=0; i<this.numShips;i++){
            this.ships[i].location = this.generateShip(this.shipLength[i]);
            let step = this.shipLength[i];
            inner : for(j=0; i<this.numShips;j++){
                let ship = this.generateShip(step);
                if(this.collision(ship)){
                    this.ships[i].location = ship;
                    continue outter;
                }
            }    
        }
        for(let k=0; k<this.numShips;k++){
            console.log(this.ships[k].location)
        }
    },
    //Генерация позиций кораблей
    generateShip: function(length){
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        let newShipLocation = [];
        if(direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - length));
         }
         else{
            row = Math.floor(Math.random() * (this.boardSize - length));
            col = Math.floor(Math.random() * this.boardSize);
         }

         for (let i = 0; i < length; i++){
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
        for(let i = 0; i < this.numShips; i++){
            for(let j=0; j < this.numShips; j++){
                for(let k=0; k <  locations.length; k++){
                    if(this.ships[i].location[j] === locations[k]) return false;
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
            view.displayCount(model.numShips,model.shipsSunk,model.numGuess);
            if(hit && model.shipsSunk === model.numShips){
                let arr = document.querySelectorAll('td');
                for(let i=0; i< arr.length; i++){
                        arr[i].removeEventListener('click', this.listenCell);
                    }  
                    setTimeout(() =>
                    {
                        view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
                        alert("You win, congratulation!!!!")
                    },1000)
            }
            if(this.guesses === model.numGuess){
                let arr = document.querySelectorAll('td');
                for(let i=0; i< arr.length; i++){
                    arr[i].removeEventListener('click', this.listenCell);
                }  
                setTimeout(() =>
                {
                    view.displayMessage("you spent all your efforts");
                    alert("You lose(((")
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

