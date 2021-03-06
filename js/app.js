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
//console.log(cards);
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
let timerInterval;
//ideal time
let idealTime = 0;
let idealInterval;
let errorMsg = document.querySelector(".errorMsg");
//Success Modal box
const successModal = document.querySelector(".success");
const successClose = document.querySelector(".successClose");
const finalMoves = document.querySelector(".finalMoves");
const finalTime = document.querySelector(".finalTime");
const finalRating = document.querySelector(".finalRating");
const btnPlay = document.querySelector(".btnPlay");
//Expire Modal box
const expireModal = document.querySelector(".expire");
const expireClose = document.querySelector(".expireClose");
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
	card.addEventListener("click", openSuccessModal);
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
}

//@description function to see the opened card match or unmatched
function openCard(){
	openedCards.push(this);
	idealTime = 0;
	errorMsg.textContent = "Your Game will expire in 5min.";
	let openedCardLength = openedCards.length;
	if(openedCardLength === 2){
		moveCounter();
		if(openedCards[0].type == openedCards[1].type){
			cardMatch();
		}else{
			cardUnmatched();
		}
	}
}

//@description function for when cards match
function cardMatch(){
	for(const openCard of openedCards){
		openCard.classList.add("match");
		openCard.classList.remove("open", "show");
		matchedCards.push(openCard);
	}
	openedCards = [];
}

//@description function for when cards don't match
function cardUnmatched(){
	disableOtherCards();
	for(const openCard of openedCards){
		openCard.classList.add("unmatch");
		setTimeout(function(){
			openCard.classList.remove("open", "show", "unmatch");
			enableOtherCards();
		},1200);
	}
	openedCards=[];
}

//for disabling other cards
function disableOtherCards(){
	for(const card of cards){
		card.classList.add("disabled");
	}
}

//for enabling other cards except the matched cards
function enableOtherCards(){
	for(const card of cards){
		card.classList.remove("disabled");
	}
	if(matchedCards.length>0){
		for(const matchedCard of matchedCards){
			matchedCard.classList.add("disabled");
		}
	}
}

//@description function count the Moves
function moveCounter(){
	count++;
	counter.innerHTML = count;
	starRating();
	if(count === 1){
		startTimer();
		startIdealTimeOut();
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
	errorMsg.textContent = "";
	for(const card of cards){
		card.classList.remove("match","show","open","disabled","unmatch");
	}
	for(const star of stars){
		star.style.display="block";
	}
}

//@description function star rate the game
function starRating(){
	if(count > 10 && count < 15){
		for(let i= 0; i < 3; i++){
			if(i > 1){
				stars[i].style.display="none";
			}
		}
	}
	else if(count >= 15 ){
		for(let i= 0; i < 3; i++){
			if(i > 0){
				stars[i].style.display="none";
			}
		}
	}
}

//@description function timer
function startTimer(){
	timerInterval = setInterval(function(){
		sec++;
		if(sec >= 60){
			sec = 0;
			min++;
			if(min >= 5){
				openExpireModal();
			}
		}
		timer.innerHTML = `${min} minute and ${sec} second`;
	},1000);
}

//for stoping the timer
function stopTimer(){
	clearInterval(timerInterval);
}

//for refreshing the timer
function resetTimer(){
	clearInterval(timerInterval);
	timer.textContent = "0 minute and 0 second";
	sec = 0;
	min = 0;
}

//@description congratulation modal box
function openSuccessModal(){
	const totalTime = document.querySelector(".timer").innerHTML;
	const starRating = document.querySelector(".stars").innerHTML;
	finalMoves.innerHTML = count;
	finalTime.innerHTML = totalTime;
	finalRating.innerHTML = starRating;
	if(matchedCards.length === 16){
		stopTimer();
		stopIdealTimeOut();
		successModal.style.display = "block";
	}
	closeSuccessModal();
	playAgain();
}

//for closing the modal box
function closeSuccessModal(){
	successClose.addEventListener("click", function(e){
		successModal.style.display = "none";
		restartGame();
	});
}

function playAgain(){
	btnPlay.addEventListener("click", function(e){
		successModal.style.display = "none";
		restartGame();
	});
}

//@description expire modal box
function openExpireModal(){
	stopTimer();
	stopIdealTimeOut();
	expireModal.style.display = "block";
	errorMsg.textContent = "";
	closeExpireModal();
}

//for closing the modal box
function closeExpireModal(){
	expireClose.addEventListener("click", function(e){
		expireModal.style.display = "none";
		restartGame();
	});
}

//@description function ideal timeout
function startIdealTimeOut(){
	idealInterval = setInterval(function(){
		idealTime++
		if(idealTime > 120){
			stopIdealTimeOut();
			idealTime = 0;
			restartGame();
			errorMsg.textContent = "Game Reset due to inactivity of 2 Min";
		}
	},1000);
}

//for starting the ideal timeout timer
function stopIdealTimeOut(){
	clearInterval(idealInterval);
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
