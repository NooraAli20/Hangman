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

                        /* disable that button as used */
                        ButtonsCanvas.elements.buttonsDisabled.push(buttonElement);

                        // increment the score for guessing the right word
                        RandomWords.locals.score += RandomWords.locals.pointsPerCorrectLetterGuessed;

                        // Increment with one, the number of guessed right letter. This number is later on compared with 
                        // RandomWords.locals.charInWord to see if they match
                        RandomWords.locals.properlyGuessedCharacterPerWord++;

                        // Then update the score board 
                        RandomWords.updateWordsAndScore();
                    });

                    // play the correct audio for guessing right
                    ButtonsCanvas.playAudio('correct');
                }
                
                // If the image to display is still equal or less than 5, and we didn't get any .square class picked from the DOM,
                else if(typeof elements[0] === 'undefined')
                {
                    // Then change the style of that button to indicate false selection
                    buttonElement.style.color = 'rgba(210, 136, 136, 0.5)';
                    buttonElement.style.background = 'rgba(235, 234, 233, 0.9)';
                    buttonElement.title = 'Letter disabled. Already used';
                    buttonElement.disabled = true;

                    // Update the image on this failed attempt
                    RandomWords.updateImageOnFailedAttempt(RandomWords.locals.imageOnDisplay);
                    RandomWords.locals.imageOnDisplay++;

                    // Add this button to a list of already used buttons
                    ButtonsCanvas.elements.buttonsDisabled.push(buttonElement);

                    // play the wrong button clicked wav fil
                    ButtonsCanvas.playAudio('wrong');
                }
                
                // IF the number of images to display exceeds 5, then 
                // the user has failed way too many times.
                if(RandomWords.locals.imageOnDisplay > 5)
                {
                    // If we dont have any images left to display, then just reveal the word to the player
                    this.revealFailedWord();
                }
                
                // When every letter is correctly guessed
                if(RandomWords.locals.charsInWord === RandomWords.locals.properlyGuessedCharacterPerWord)
                {
                    // Download more audio on https://freesound.org/
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
        correctAudio.autoplay = true;
        correctAudio.muted = false;
        correctAudio.play();
    },

    revealFailedWord()
    {
        RandomWords.locals.imageOnDisplay = 1;
        let wordHTML = document.querySelectorAll('.square.lousy');
        wordHTML.forEach(article => {
            article.textContent = article.classList[2];
            article.classList.add('squareReveal');
        });

        this.playAudio('endgame');

        this.resetHTMLRandomWord(5000);
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
            ButtonsCanvas.enableDisabledButtons();
            
        }, duration);
    },
    
    enableDisabledButtons()
    {
        if(ButtonsCanvas.elements.buttonsDisabled.length > 0)
        {
            ButtonsCanvas.elements.buttonsDisabled.forEach(button => {
                button.disabled = false;
                button.style.color = 'black';
                button.style.background = 'rgba(255, 255, 255, 0.6)';
            });
        }
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
        wordsPassed: 0,
        // Time when word is available to be answered
        timer: 180,
        timerController: 0
    },

    generateAndRenderSampleWord()
    {
        // Randomly choose a word
        var arrayOfWords = randWords.words;
        var randomWordChoosen = arrayOfWords[Math.floor(Math.random() * arrayOfWords.length)];

        console.log(randomWordChoosen);

        document.querySelector('#suicideImage').setAttribute('src', '');
        ButtonsCanvas.enableDisabledButtons();

        // if there exists reference to earlier words, remove them to prepare for next word
        document.querySelectorAll('.container > .sectionParagraph > .placeHolderChoosen').forEach(el => el.remove());
        document.querySelectorAll('.container > .scoreBoard > .board').forEach(el => el.remove());

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
        let paragraph = document.createElement("p");
        paragraph.classList.add('board');

        //document.querySelector('.container > .scoreBoard').removeChild(paragraph);
        document.querySelector('.container > .scoreBoard').appendChild(paragraph);

        this.updateWordsAndScore();

        this.locals.timerController = this.locals.timer;

        var timerInterval = setInterval(() => {

            document.querySelector('.timer p').textContent = 'You MUST answer in ' +  this.locals.timerController + ' second(s)';

            if(this.locals.timerController <= 0)
            {
                clearInterval(timerInterval);
                RandomWords.generateAndRenderSampleWord();
            }
                
            this.locals.timerController--;
        }, 1000); // 1,000 milliseconds = 1 sekund
    },
    updateImageOnFailedAttempt(imageNumber)
    {
        document.querySelector('#suicideImage').setAttribute('src', this.locals.imageBaseUrl + imageNumber + this.locals.imagesExt);
    },
    updateWordsAndScore()
    {
        let scoreBoardParagraph = document.querySelector('.scoreBoard p');
        scoreBoardParagraph.textContent = "#Words : " + this.locals.wordsPassed + "/" +  this.locals.numberOfWordsAttempted + " - Score : " + this.locals.score; 
    }
}