/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page

 */
// creating an array of all listed cards
const memoryCard = document.getElementsByClassName("card");
let cards = [...memoryCard];
console.log(cards);
// All card container
const cardDeck= document.getElementById("deck");
//Array for opened cards
let openedCards = [];
//Array for opened cards
let matchedCards = [];
//Move Counter
const counter = document.querySelector(".moves");
let count = 0;
//Restart Game
const restart = document.querySelector(".restart");
restart.addEventListener("click", restartGame);
//Array for Star Rating
const stars = document.querySelectorAll(".fa-star");
//Timer
const timer = document.querySelector(".timer");
let sec = 0;
let min = 0;
let hour = 0;
//toggle class after clicking each card
let displayCard = function(){
	this.classList.toggle("open");
	this.classList.toggle("show");
	this.classList.toggle("disabled");
}
// adding click function and required classes after click to the card
for(const card of cards){
	card.addEventListener("click", displayCard);
	card.addEventListener("click", openCard);
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//@description shuffle the card on page refresh
window.onload = newGame();

//@description function to start a new game
function newGame(){
	let shuffledCards = shuffle(cards);
	for(const shuffledCard of shuffledCards){
		[].forEach.call(shuffledCards, function(item){
			cardDeck.appendChild(item);
			//console.log(item);
		});
	}
};
//@description function to see the opened card match or unmated
function openCard(){
	openedCards.push(this);
	let openedCardLength = openedCards.length;
	if(openedCardLength === 2){
		moveCounter();
		if(openedCards[0].type == openedCards[1].type){
			cardMatch();
		}else{
			cardUnmatched();
		}
	}
};
//@description function for when cards match
function cardMatch(){
	for(const openCard of openedCards){
		openCard.classList.add("match");
		openCard.classList.remove("open", "show");
		matchedCards.push(openCard);
	};
	openedCards = [];
};
//@description function for when cards don't match
function cardUnmatched(){
	disableOtherCards();
	for(const openCard of openedCards){
		openCard.classList.add("unmatch");
		setTimeout(function(){
			openCard.classList.remove("open", "show", "unmatch");
			enableOtherCards();
		},1200);
	};
	openedCards=[];
};
//for disabling other cards
function disableOtherCards(){
	for(const card of cards){
		card.classList.add("disabled");
	}
};
//for enabling other cards except the matched cards
function enableOtherCards(){
	for(const card of cards){
		card.classList.remove("disabled");
	};
	if(matchedCards.length>0){
		for(const matchedCard of matchedCards){
			matchedCard.classList.add("disabled");
		}
	}
};
//@description function count the Moves
function moveCounter(){
	count++;
	counter.innerHTML = count;
	starRating();
	if(count === 1){
		startTimer();
	}
}
//@description function restart the game
function restartGame(){
	newGame();
	resetTimer();
	openedCards=[];
	matchedCards=[];
	count = 0;
	counter.innerHTML = count;
	for(const card of cards){
		card.classList.remove("match","show","open","disabled","unmatch");
	};
	for(const star of stars){
		star.style.display="block";
	}
}
//@description function star rate the game
function starRating(){
	if(count > 7 && count < 12){
		for( i= 0; i < 3; i++){
			if(i > 1){
				stars[i].style.display="none";
			}
		}
	}
	else if(count >= 12 ){
		for( i= 0; i < 3; i++){
			if(i > 0){
				stars[i].style.display="none";
			}
		}
	}
}
//@description function timer
function setTimer(){
	sec++;
	if(sec >= 60){
		sec = 0;
		min++;
		if(min >= 60){
			min = 0;
			hour++;
		}
	}
	timer.textContent = (hour ? (hour > 9 ? hour : "0" + hour) : "00") + ":" + (min ? (min > 9 ? min : "0" + min) : "00") + ":" + (sec > 9 ? sec : "0" + sec);
	startTimer();
}
function startTimer(){
	t = setTimeout(setTimer, 1000);
}
function resetTimer(){
	clearTimeout(t);
	timer.textContent = "00:00:00";
	sec = 0;
	min = 0;
	hour = 0;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
