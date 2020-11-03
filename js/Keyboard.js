// keyboard object that will handle all keys and their corresponding events. in this case, the click event
const Keyboard = {
    
    // the elements in the keyboard object
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    // the events on the created object
    eventHandlers: {
        onclose: null
    },

    // the values of each clickable element in the keyboard object, i.e button
    properties: {
        value: ""
    },

    // This method is called to initialize the keyboard object and render all the keys to be displayed
    // together with all their styles. Everything is built dynamically using javascript
    init() {
        // Create main elements
        this.elements.main = document.createElement("section");
        this.elements.keysContainer = document.createElement("section");

        // Setup main elements
        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();

        // An array of keys that we want to build
        const keyLayout = [
          "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å",
          "a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä",
          "z", "x", "c", "v", "b", "n", "m"
        ];

        // forEach loop to go through every individual key in keyLayout and render it and its CSS
        keyLayout.forEach(key => {
            
            // create a button element
            const keyElement = document.createElement("button");

            //If we are at the end of the respective keyLayout ends, we insert a linebreak, as we shall see later on
            const insertLineBreak = ["å", "ä", "m"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            // Make the text of the button to be uppercase
            keyElement.textContent = key.toUpperCase();

            // Add a click event listener for every button so that 
            // we can get the inner text when it is clicked. 
            keyElement.addEventListener("click", () => {
                console.log(keyElement.innerText);
            });

            // add the created button to the fragment
            fragment.appendChild(keyElement);

            // Now, if we are at the end of our array list above, i.e keyLayout, we insert a linebreak as follows
            if (insertLineBreak) {  // if true
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};