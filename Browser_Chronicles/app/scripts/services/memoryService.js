'use strict';
/* Memory Game Models and Business Logic */

function Card(title, img) {
  this.title = title;
  this.img = img;
  this.flipped = false;
  this.removed = false;
}

Card.prototype.flip = function() {
  this.flipped = !this.flipped;
};


function Game(cardNames) {
  var cardDeck = makeDeck(cardNames);
  this.win = false;
  this.grid = makeGrid(cardDeck);
  this.unmatchedPairs = cardNames.length;
  var lastCard;

  this.flipCard = function(card) {
    if (card.flipped) {
      return;
    }
    card.flip();

    if (!this.firstPick || this.secondPick) {
      if (this.secondPick) {
        this.firstPick.flip();
        this.secondPick.flip();
        this.firstPick = this.secondPick = undefined;
      }
      this.firstPick = card;
      lastCard = card;
    } else {

      if (this.firstPick.title === card.title) {
        this.unmatchedPairs--;
        this.win = (this.unmatchedPairs<=0);
        lastCard.removed = true;
        card.removed = true;
        this.firstPick = this.secondPick = undefined;
      } else {
        this.secondPick = card;
        lastCard = undefined;
      }
    }
  }
}




/* Create an array with two of each cardName in it */
function makeDeck(cardNames) {
  var cardDeck = [];
  cardNames.forEach(function(name) {
    if(name._img){
      cardDeck.push(new Card(name.__text, name._img));
      cardDeck.push(new Card(name.__text, name._img));
    }
    else {
      cardDeck.push(new Card(name,""));
      cardDeck.push(new Card(name,""));
    }
  });

  return cardDeck;
}


function makeGrid(cardDeck) {
  var gridDimension = Math.sqrt(cardDeck.length), grid = [], maxCard = cardDeck.length;
  for (var row = 0; row < gridDimension; row++) {
    grid[row] = [];
    for (var col = 0; col < gridDimension; col++) {
      grid[row][col] = removeRandomCard(cardDeck);
      maxCard--;
      if(maxCard<=0) return grid;
    }
  }
  return grid;
}


function removeRandomCard(cardDeck) {
  var i = Math.floor(Math.random()*cardDeck.length);
  return cardDeck.splice(i, 1)[0];
}

angular.module('projetS6App')
  .factory('memoryGame', function() {
    return {
      generateNewGame: function(step){
        var defaultDeck = ['A','B','C'], stepDeck = [];
        if(step.deck){
          step.deck.card.forEach( function(card) {stepDeck.push(card)});
          if(stepDeck.length===step.deck.card.length) return new Game(stepDeck)
        }
        return new Game(defaultDeck);
      }
    }
  });
