window.addEventListener("DOMContentLoaded", function () {
   // Initialize the keyboard
    Keyboard.init();

    generateAndRenderSampleWord();
    
});

function generateAndRenderSampleWord()
{
  // Randomly choose a word
  var arrayOfWords = randWords.words;
  var randomWordChoosen = arrayOfWords[Math.floor(Math.random() * arrayOfWords.length)];

  let choosenWordPlaceHolder = document.createElement("section");
  choosenWordPlaceHolder.classList.add("placeHolderChoosen");

  let splitRandomChosenWord = randomWordChoosen.trim().split('');

  splitRandomChosenWord.forEach(character => {
    let letter = document.createElement("article");
    letter.classList.add("square");
    letter.classList.add("lousy");
    letter.classList.add(character.toUpperCase());
    letter.textContent = " ";
    choosenWordPlaceHolder.appendChild(letter);
 });

  //document.body.appendChild(choosenWordPlaceHolder);
  document.querySelector('.container').appendChild(choosenWordPlaceHolder);
}
