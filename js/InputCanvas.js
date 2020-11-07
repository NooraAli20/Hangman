// keyboard object that will handle all keys and their corresponding events. in this case, the click event
const ButtonsCanvas = {
    
    // the elements in the keyboard object
    elements: {
        main: null,
        buttonsContainer: null,
        buttons: [],
        buttonsDisabled: []
    },

    // This method is called to initialize the keyboard object and render all the keys to be displayed
    // together with all their styles. Everything is built dynamically using javascript
    init() {
        // Create main elements
        this.elements.main = document.createElement("section");
        this.elements.buttonsContainer = document.createElement("section");

        // Setup main elements
        this.elements.main.classList.add("keyboard");
        this.elements.buttonsContainer.classList.add("keyboard__keys");
        this.elements.buttonsContainer.appendChild(this._createButtons());

        // Add to DOM
        this.elements.main.appendChild(this.elements.buttonsContainer);
        document.body.appendChild(this.elements.main);
    },

    _createButtons() {
        const fragment = document.createDocumentFragment();

        // An array of keys that we want to build
        const qwertyKeyboardLayout = [
          "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å",
          "a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä",
          "z", "x", "c", "v", "b", "n", "m"
        ];

        // forEach loop to go through every individual key in keyLayout and render it and its CSS
        qwertyKeyboardLayout.forEach(key => {
            
            // create a button element
            const buttonElement = document.createElement("button");

            //If we are at the end of the respective keyLayout ends, we insert a linebreak, as we shall see later on
            const insertLineBreak = ["å", "ä", "m"].indexOf(key) !== -1;

            // Add attributes/classes
            buttonElement.setAttribute("type", "button");
            buttonElement.style.cursor = "pointer";
            buttonElement.classList.add("keyboard__key");

            // Make the text of the button to be uppercase
            buttonElement.textContent = key.toUpperCase();

            // Add a click event listener for every button so that 
            // we can get the inner text when it is clicked. 
            buttonElement.addEventListener("click", () => {

                // when a button is clicked, check to see if theres an element with the class name .square.lousy.LETTER i.e .square.lousy.A
                // Not that it returns a collection/array of items because there could be two or more same letters in a given word
                var elements = document.querySelectorAll('.square.lousy.' + buttonElement.innerText);

                // If the elements collection is defined, i.e we found some items on the DOM wih the given search criteria in querySelectorAll function
                if(typeof elements[0] !== 'undefined')
                {
                    // We then loop through each item to set some custom css for it and innerText
                    // Not that we remove the class name 'lousy' so that it doesn't appear in the next button we randomly click with querySelectorAll function
                    elements.forEach(element => {
                        element.classList.remove('lousy')
                        element.classList.add('visualizeKey');
                        element.textContent = buttonElement.innerText;
                        buttonElement.style.color = 'red';
                        buttonElement.disabled = true;

                        ButtonsCanvas.elements.buttonsDisabled.push(buttonElement);

                        RandomWords.locals.score += RandomWords.locals.pointsPerCorrectLetterGuessed;

                        RandomWords.locals.properlyGuessedCharacterPerWord++;

                        RandomWords.updateWordsAndScore();
                    });

                    ButtonsCanvas.playAudio('correct');
                }
                
                if(RandomWords.locals.imageOnDisplay < 5 && typeof elements[0] === 'undefined')
                {
                    buttonElement.style.color = 'rgba(210, 136, 136, 0.5)';
                    buttonElement.style.background = 'rgba(235, 234, 233, 0.9)';
                    buttonElement.title = 'Letter disabled. Already used';
                    buttonElement.disabled = true;
                    RandomWords.updateImageOnFailedAttempt(RandomWords.locals.imageOnDisplay);
                    RandomWords.locals.imageOnDisplay++;

                    ButtonsCanvas.elements.buttonsDisabled.push(buttonElement);

                    ButtonsCanvas.playAudio('wrong');
                }
                else if(RandomWords.locals.imageOnDisplay == 5)
                {
                    // reveal the word for 1.5s
                    let wordHTML = document.querySelectorAll('.square.lousy');
                    wordHTML.forEach(article => {
                        article.textContent = article.classList[2];
                        article.classList.add('squareReveal');
                    });

                    this.playAudio('endgame');

                    this.resetHTMLRandomWord(5000);
                }
                // When every letter is correctly guessed
                else if(RandomWords.locals.charsInWord === RandomWords.locals.properlyGuessedCharacterPerWord)
                {
                    this.playAudio('cheers');
                    RandomWords.locals.wordsPassed++;
                    RandomWords.updateWordsAndScore();
                    this.resetHTMLRandomWord(7000);
                }
            });

            // add the created button to the fragment
            fragment.appendChild(buttonElement);

            // Now, if we are at the end of our array list above, i.e keyLayout, we insert a linebreak as follows
            if (insertLineBreak) {  // if true
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },
    playAudio(fileName)
    {
        let correctAudio = new Audio('../sounds/' + fileName +'.wav');
        correctAudio.play();
    },
    resetHTMLRandomWord(duration)
    {
        setTimeout(function() {

            // Reset the correctly guessed characters to zero
            RandomWords.locals.properlyGuessedCharacterPerWord = 0;

            // reset the image counter variable 
            RandomWords.locals.imageOnDisplay = 1;

            // then refresh the container for a new word
            document.querySelector('.container > .sectionParagraph').removeChild(document.querySelector('p'));

            // randomize the new word
            RandomWords.generateAndRenderSampleWord();

            // reset the image src button
            document.querySelector('#suicideImage').setAttribute('src', ' ');

            // Enable all disabled keyboard keys 
            ButtonsCanvas.elements.buttonsDisabled.forEach(button => {
                button.disabled = false;
                button.style.color = 'black';
                button.style.background = 'rgba(255, 255, 255, 0.6)';
            });
            
        }, duration);
    }
};

const RandomWords = {

    locals: {
        word: [],
        charsInWord: 0,
        imageBaseUrl: '../images/',
        imagesExt: '.png',
        imageOnDisplay: 1,
        numberOfWordsAttempted: 0,
        score: 0.0,
        pointsPerCorrectLetterGuessed: 0.5,
        properlyGuessedCharacterPerWord: 0,
        wordsPassed: 0
    },

    generateAndRenderSampleWord()
    {
        // Randomly choose a word
        var arrayOfWords = randWords.words;
        var randomWordChoosen = arrayOfWords[Math.floor(Math.random() * arrayOfWords.length)];

        console.log(randomWordChoosen);

        let choosenWordParagraph = document.createElement("p")
        choosenWordParagraph.classList.add("placeHolderChoosen");

        this.locals.numberOfWordsAttempted++;

        let splitRandomChosenWord = randomWordChoosen.trim().split('');

        this.locals.word = splitRandomChosenWord;
        this.locals.charsInWord = splitRandomChosenWord.length;

        splitRandomChosenWord.forEach(character => {
            var letter = document.createElement("article");
            letter.classList.add("square");
            letter.classList.add("lousy");
            letter.style.color = 'black';
            letter.classList.add(character.toUpperCase());
            letter.textContent = " ";
            choosenWordParagraph.appendChild(letter);
        });

        document.querySelector('.container > .sectionParagraph').appendChild(choosenWordParagraph);

        // Add the words and score section
        let scoreBoard = document.createElement("section");
        scoreBoard.classList.add("scoreBoard");
        let paragraph = document.createElement("p");
        scoreBoard.appendChild(paragraph);
       
        document.querySelector('.container').appendChild(scoreBoard);

        this.updateWordsAndScore();
    },
    updateImageOnFailedAttempt(imageNumber)
    {
        document.querySelector('#suicideImage').setAttribute('src', this.locals.imageBaseUrl + imageNumber + this.locals.imagesExt);
    },
    updateWordsAndScore()
    {
        let scoreBoardParagraph = document.querySelector('.scoreBoard p')
        scoreBoardParagraph.textContent = "#Words : " + this.locals.wordsPassed + "/" +  this.locals.numberOfWordsAttempted + " - Score : " + this.locals.score; 
    }
}