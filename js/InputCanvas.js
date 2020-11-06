// keyboard object that will handle all keys and their corresponding events. in this case, the click event
const ButtonsCanvas = {
    
    // the elements in the keyboard object
    elements: {
        main: null,
        buttonsContainer: null,
        buttons: []
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

                        // update the score for each right letter chosen
                        RandomWords.locals.score++;
                    });
                }
                else
                {
                    RandomWords.locals.currentWeightAggregate += RandomWords.locals.weightOfEachCharacterPerWord;
                    RandomWords.calculateImageToUpdate(RandomWords.locals.currentWeightAggregate);
                }
               
                // Update the attempts made so far
                RandomWords.locals.numberOfAttemptsDone++;

                // Render the <p></p> to re-update the attemps and scores sheet
                document.querySelector('.scores').textContent = RandomWords.attempsAndScoresMessage();

                // Now check if there is any .square element with the lousy class attached to it. If not any, then the 
                // user has finished the game. Ask if he wants to play again and generate the markup again
                var notAnsweredElements = document.querySelectorAll('.square.lousy').length;
                if(notAnsweredElements == 0)
                {
                    setTimeout(function() {
                        document.querySelector('.container').removeChild(document.querySelector('.placeHolderChoosen'));
                        RandomWords.generateAndRenderSampleWord();
                        document.querySelector('#suicideImage').setAttribute('src', ' ');
                    }, 1500);
                
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
    }
};

const RandomWords = {

    locals: {
        word: [],
        charsInWord: 0,
        levelOfDifficulty: 2,
        weightOfEachCharacterPerWord: 0.0,
        imageBaseUrl: '../images/',
        currentWeightAggregate: 0.0,
        imagesExt: '.png',
        currentImageOnDisplay: 0,
        previousImageOnDisplay: 0,
        numberOfAttemptsDone: 0,
        totalNumberOfAttemps: 0,
        score: 0
    },

    generateAndRenderSampleWord()
    {
        // Randomly choose a word
        var arrayOfWords = randWords.words;
        var randomWordChoosen = arrayOfWords[Math.floor(Math.random() * arrayOfWords.length)];

        console.log(randomWordChoosen);

        let choosenWordPlaceHolder = document.createElement("section");
        choosenWordPlaceHolder.classList.add("placeHolderChoosen");

        let splitRandomChosenWord = randomWordChoosen.trim().split('');

        this.locals.word = splitRandomChosenWord;
        this.locals.charsInWord = splitRandomChosenWord.length;

        // Get the weight as a percentage
        this.locals.weightOfEachCharacterPerWord = (1 / this.locals.charsInWord) * 100;

        // Give the number of available attempts. 
        this.locals.totalNumberOfAttemps = this.locals.charsInWord + 2;

        // Since we have 5 pictures to display from the /images folder, that means each character will minimamly have 20% weight
        // But we have to cater for words whose character weighs more than 20%, i.e words with atmost 5 characters
        if(this.locals.charsInWord <= 5)
        {
            this.locals.weightOfEachCharacterPerWord = (1 / (this.locals.charsInWord + 6) ) * 100;
        }

        console.log(this.locals.weightOfEachCharacterPerWord);

        splitRandomChosenWord.forEach(character => {
            var letter = document.createElement("article");
            letter.classList.add("square");
            letter.classList.add("lousy");
            letter.classList.add(character.toUpperCase());
            letter.textContent = " ";
            choosenWordPlaceHolder.appendChild(letter);
        });
        
        document.querySelector('.container').appendChild(choosenWordPlaceHolder);
        this.generateAttemptsAndScoreSection();
    },
    generateAttemptsAndScoreSection()
    {
        let secktion = document.createElement('section');
        secktion.classList.add('centralizeLabelAndScore');

        let label = document.createElement('p');
        label.classList.add('scores');
        
        label.textContent = this.attempsAndScoresMessage();;

        secktion.appendChild(label);

        document.querySelector('.container').appendChild(secktion);
    },
    calculateImageToUpdate(y)
    {
        if(y > 0 && y <= 20)
        {
            this.currentImageOnDisplay = 1;
        }else if(y > 20 && y <= 40)
        {
            this.currentImageOnDisplay = 2;
        }
        else if(y > 40 && y <= 60)
        {
            this.currentImageOnDisplay = 3;
        }
        else if(y > 60 && y <= 80)
        {
            this.currentImageOnDisplay = 4;
        }
        else if(y > 80)
        {
            this.currentImageOnDisplay = 5;
        }

        this.updateImageOnFailedAttempt(this.currentImageOnDisplay);
        this.previousImageOnDisplay = this.currentImageOnDisplay;
    },
    updateImageOnFailedAttempt(imageNumber)
    {
        if(this.currentImageOnDisplay !== this.previousImageOnDisplay)
            document.querySelector('#suicideImage').setAttribute('src', this.locals.imageBaseUrl + imageNumber + this.locals.imagesExt);
    },
    attempsAndScoresMessage()
    {
        return 'Attempts ' + 
                this.locals.numberOfAttemptsDone + '/' + 
                this.locals.totalNumberOfAttemps +  ' - Score : ' + this.locals.score +  ' pts';
    }
}