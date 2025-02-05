//let { posters } = require('./scripts/postersData');
//import posters from './scripts/postersData.js';
//import posters from './scripts/postersData.js';
// const express = require('express')
// const app = express()
let shoppingCart = []; 
localStorage.getItem("shoppingCart") || localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

console.log("Initial localStorage.shoppingCart:", localStorage.getItem("shoppingCart"));


let nightmodeVar = JSON.parse(localStorage.getItem("nightmode")) ?? true;
const button = document.getElementById('changeColorBtn');

const body = document.body;
const sun= document.getElementById("sun");
const moon= document.getElementById("moon");
const sun2= document.getElementById("sun-m");
const moon2= document.getElementById("moon-m");

document.addEventListener("DOMContentLoaded", () => {
    setNightMode();
    getShoppingCart();

    if (document.body.dataset.page === 'order'){
        console.log("order: go to add cart");
        addCartItems();
        document.getElementById('clear-cart-btn').addEventListener('click', clearCartData);
    }
    if (document.body.dataset.page === 'product'){
        console.log("product!!!");
        showProductInfo();
    }
    if (document.body.dataset.page !== 'posters'){
        console.log("return, on ",document.body.dataset.page);
        return;
    }
    
    const posterGrid = document.getElementsByClassName('painting-grid-posters')[0];
    fetch('/postersData')
        .then(response => response.json())
        .then(postersData => {
            postersData.forEach((poster) => {
                if (poster.available === false){ return; }
                
                const imgBg = document.createElement('div');
                imgBg.setAttribute('class', 'imgBg');

                const div_card = document.createElement('div');
                div_card.setAttribute('class', 'poster-child');

                // Create the image element
                const image = document.createElement('img');
                image.setAttribute('class', 'thumbnail');
                image.setAttribute('id', 'image');
                image.src = poster.image;

                // Create an invisible overlay
                const overlay = document.createElement('div');
                overlay.setAttribute('class', 'image-overlay');

                // Create a link to wrap the image
                const link = document.createElement('a');
                link.href = `/posters/${poster.id}`;
                link.setAttribute('class', 'poster-link');

                const poster_flex = document.createElement('div');
                poster_flex.setAttribute('class', 'poster-flex')

                const title = document.createElement('h3');
                title.setAttribute('id', 'title');
                title.setAttribute('class', 'poster-flex-child .poster-flex-child-left')

                const add = document.createElement('button');
                add.setAttribute('type', 'button')
                add.setAttribute('class', 'fa-plus poster-flex-child add-button');
                add.setAttribute('id', 'add-button-id')
                add.setAttribute('onclick', 'addToCart(this.id)')
                
                const inner_flex = document.createElement('div');
                inner_flex.setAttribute('class', 'inner-flex');

                const price_text = document.createElement('h2');
                price_text.style = 'margin: 0rem;';

                const selectSizes = document.createElement('select');
                selectSizes.setAttribute('type', 'select');
                selectSizes.setAttribute('class', 'product-select');
                selectSizes.style = "background-color: var(--h2-text-color);";

                selectSizes.addEventListener('change', (event) => {
                    const sizesIndex = Object.keys(sizes).indexOf(event.target.value);
                    if (sizesIndex == 0){
                        price_text.textContent = '45kr';
                    }
                    else if (sizesIndex >= 0){
                        price_text.textContent = '60kr';
                    }
                 else {
                        price_text.textContent = '45kr'; 
                    }
                });

                //selectSizes options
                const sizes = poster.sizes; // Extract sizes

                // Get the select element
                selectSizes.innerHTML = ""; // Clear previous options

                if (sizes && typeof sizes === 'object' && Object.keys(sizes).length > 0) {
                    for (const [size, quantity] of Object.entries(sizes)) {
                        console.log(`Size: ${size}, Quantity: ${quantity}`);
                
                        // Create a new <option> element for each size
                        const option = document.createElement('option');
                        option.setAttribute('value', size);
                        option.textContent = `${size}`;
                
                        // Disable the option if the quantity is 0 or less
                        if (quantity <= 0) {
                            option.setAttribute('disabled', true);
                        }
                
                        // Append the option to the <select> dropdown
                        selectSizes.appendChild(option);
                    }
                }

                 
                price_text.textContent = '45kr'; 
                //add sizes to it

                add.id = poster.id;
                title.innerText = poster.name;
                imgBg.style.backgroundColor = "#fdf8e5";

                link.appendChild(image); // Wrap the image in the link
                imgBg.appendChild(link);
                imgBg.appendChild(overlay); // Add the overlay over the image
                imgBg.appendChild(add);
                div_card.appendChild(imgBg);
                div_card.appendChild(poster_flex);
                poster_flex.appendChild(title);
                poster_flex.appendChild(inner_flex);
                inner_flex.appendChild(price_text);
                inner_flex.appendChild(selectSizes);

                posterGrid.appendChild(div_card);
            });
            
            window.addEventListener('resize', moveChild);
            moveChild(); // Run once on page load
        })
        .catch(error => console.error('Error fetching posters:', error));
});

function moveChild() {
    const children = document.getElementsByClassName('inner-flex');
    const desktopParents = document.getElementsByClassName('poster-flex');
    const mobileParents = document.getElementsByClassName('poster-child');

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (window.innerWidth <= 768) {
            if (mobileParents[i]) mobileParents[i].appendChild(child); // Move to mobile parent
        } else {
            if (desktopParents[i]) desktopParents[i].appendChild(child); // Move to desktop parent
        }
    }
}

// Run on page load and when window resizes
window.addEventListener('resize', moveChild);

function on() {
    // display overlay
    const turnOn = document.getElementById("overlay");
    turnOn.style.display = "block";
    //turn off vertical scroll
    const overflow = document.querySelector("body");
    overflow.style.overflow = "";
}
function off() {
    // display overlay
    const turnOff = document.getElementById("overlay");
    turnOff.style.display = "none";
    //turn off vertical scroll
    const overflow = document.querySelector("body");
    overflow.style.overflow = ""; //do nothing
}
function setNightMode(){
    console.log("set night mode function, nightmode: ",nightmodeVar);
    if (nightmodeVar === true){
        console.log("nightmode: ",nightmodeVar);
        console.log("nu blir det mörkt");
        dark();
    }
    else{
        light();
        console.log("nu blir det ljust");
    }
    //nightmodeVar ? dark() : light();
}
function nightmodeSwitch() {
    console.log("nightmode switch");
    if (nightmodeVar === false) {
        dark();
    }
    else if (nightmodeVar === true){
        light();
    }
}
function light() {
    body.classList.remove('nightmode');
    body.classList.add('lightmode');
    sun.style.display = "none";
    moon.style.display = "block";
    sun2.style.display = "none";
    moon2.style.display = "block";
    hideMarks('pinkMark', 'mark-hidden', false);
    nightmodeVar = false;
    console.log("turning light: ",nightmodeVar);
    localStorage.setItem("nightmode", nightmodeVar);
}
function dark() {   
    body.classList.remove('lightmode');
    body.classList.add('nightmode');
    moon.style.display = "none";
    sun.style.display = "block";
    moon2.style.display = "none";
    sun2.style.display = "block";
    hideMarks('pinkMark', 'mark-hidden', true);
    nightmodeVar = true;
    console.log("turning dark: ",nightmodeVar);
    localStorage.setItem("nightmode", nightmodeVar);
}
function hideMarks(className, hiddenClass, shouldHide) {
    const markElements = document.getElementsByClassName(className);
    for (let i = 0; i < markElements.length; i++) {
        if (shouldHide) {
            markElements[i].classList.remove('show-mark');
            markElements[i].classList.add(hiddenClass);
        } else {
            markElements[i].classList.remove(hiddenClass);
            markElements[i].classList.add('show-mark');
        }
    }
}

function addToCart(posterId) {
    shoppingCart.push(posterId);
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    console.log(JSON.parse(localStorage.getItem("shoppingCart")));
}

function getShoppingCart() {
    const storedCart = localStorage.getItem("shoppingCart");
    if (storedCart) {
        JSON.parse(storedCart).forEach((itemId) => {
            shoppingCart.push(itemId);
            console.log("Item to add to list before populating it: ", itemId);
        });
    }
}

function addCartItems() {
    console.log("adding updated list to cart ", shoppingCart);
    const itemGrid = document.getElementsByClassName('shopping-cart')[0];

    document.getElementById('price').innerText = `Price: ${shoppingCart.length * 60} kr\u2003\u2003\u2003${shoppingCart.length * 60 > 120 ? "free shipping!" : shoppingCart.length === 0 ?  " " : "shipping: 18kr"}`;
    document.getElementById('total-price').innerText = `Total price: ${shoppingCart.length * 60 +(shoppingCart.length * 60 > 120 ? 0 : shoppingCart.length === 0 ?  " " : 18)} kr`;
    
    // Fetch data from the server
    fetch('/postersData')
        .then(response => response.json())
        .then(postersData => {
            let i = 0;
            shoppingCart.forEach((itemId) => {
                const itemPoster = postersData[itemId - 1];
                
                const imgBg = document.createElement('div');
                imgBg.setAttribute('class', 'imgBg');

                const div_card = document.createElement('div');
                div_card.setAttribute('class', 'cart-item');

                const image = document.createElement('img');
                image.setAttribute('class', 'thumbnail');
                image.setAttribute('id', 'image');

                const title = document.createElement('h3');
                title.setAttribute('id', 'title');

                const remove = document.createElement('button');
                remove.setAttribute('class', 'fa-minus remove-button');
                remove.setAttribute('id', 'remove-button-id');
                remove.setAttribute('onclick', 'removeFromCart(this.id)');
                
                //remove.addEventListener('click', () => removeFromCart(itemId, div_card));
                // Add event listener for each remove button
                
                remove.id = i;
                title.innerHTML = itemPoster.name;
                image.src = itemPoster.image;

                imgBg.appendChild(image);
                div_card.appendChild(imgBg);
                div_card.appendChild(title);
                div_card.appendChild(remove);

                itemGrid.appendChild(div_card);
                i++;
            });
        })
        .catch(error => console.error('Error fetching posters:', error));
};

function showProductInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const posterData = Object.fromEntries(urlParams.entries()); // Parse query parameters into an object
   
    if (posterData) {
      document.getElementById('product-img').src = posterData.image;
      document.getElementById('product-title').textContent = posterData.name;
      document.getElementById('product-desc').textContent = posterData.desc;
    }
    const selectedPoster = postersData.find(poster => poster.id === Number(posterData.id));
    const sizes = selectedPoster.sizes; // Directly extract sizes

    for (const [size, quantity] of Object.entries(sizes)) {
        console.log(`Size: ${size}, Quantity: ${quantity}`);
        const option = document.createElement('option');
        option.setAttribute('value', size);         
        // option.setAttributeNS('required', true) ;                                                                                            
        if (quantity <= 0){
            option.setAttribute('disabled', true);
        };
        // if (firstTime){
        //     option.selected = true;
        //     firstTime = false;
        // }
        
        option.innerHTML = size;
        document.getElementById('product-select').appendChild(option);
        
        document.getElementById('product-select').addEventListener('change', (event) => {
            const sizesIndex = Object.keys(sizes).indexOf(event.target.value);
            if (sizesIndex == 0){
                document.getElementById('product-price').textContent = '45kr';
            }
            else if (sizesIndex >= 0){
                document.getElementById('product-price').textContent = '60kr';
            }
            else {
                document.getElementById('product-price').textContent = '45kr'; 
            }
        });
        
        document.getElementById('product-price').textContent = '45kr'; 
    }
}

function removeFromCart(posterId) {
    shoppingCart.splice(posterId, 1);
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    clearCart();
    console.log("removed from cart now add: ");
    addCartItems();
}
function clearCartData() {
    shoppingCart = [];
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    clearCart();
}
function clearCart() {
    const list = document.getElementsByClassName('cart-item');
    for (let i = list.length - 1; i >= 0; i--) {
        console.log(list[i].id);
        list[i].remove();
        console.log("clearing");
    }
}

function showSwish() {
    const swishDiv = document.getElementsByClassName('swish-div');
    for (let i = 0; i < swishDiv.length; i++) {
        swishDiv[i].style.display = 'block';
        console.log(swishDiv[i]);
        console.log(swishDiv[i].style.display);
    }
    console.log('hello');
};

//const form = document.querySelector("form");
// Select elements representing alerts for name, email, and phone
const nameAlert = document.getElementById("nameAlert");
const emailAlert = document.getElementById("emailAlert");
const phoneAlert = document.getElementById("phoneAlert");
//Add event listener for form submission
// form.addEventListener("submit", (event) => {
//     // Prevent the default form submission behavior
//     event.preventDefault();
//     showSwish();
//     // If form validation passes, reset the form
//     if (validateForm()) {
//         form.reset();
//     }
// });
// Add event listener for input events within the form
// form.addEventListener("input", (event) => {
//     // Retrieve the element that triggered the event
//     const target = event.target;
//     // console.log(target);
    
//     // Check if the event was triggered by the name input field
//     if (target.id === 'name') {
//         // console.log(target.id)
//         // Show or hide the name alert based on whether the name input has a value
//         nameAlert.style.display = target.value ? "none" : "block";        
//     } 
//     // Check if the event was triggered by the email input field
//     else if (target.id === 'email') {
//         // Call the validateEmail function with the value of the email input field
//         validateEmail(target.value);
//     } 
//     // Check if the event was triggered by the phone input field
//     else if (target.id === 'phone') {
//         // Call the validatePhone function with the value of the phone input field
//         validatePhone(target.value);
//     }
// });
// Function to validate email format using regular expression
function validateEmail(email) {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if the email matches the regex pattern
    const isValid = emailRegex.test(email);
    console.log(isValid);
    // Show or hide the email alert based on the validity of the email
    emailAlert.style.display = email ? (isValid ? "none" : "block") : "block";
    // Return whether the email is valid
    return isValid;
}
// Function to validate phone format using regular expression
function validatePhone(phone) {
    // Regular expression to validate phone format (e.g., xxx-xxx-xxxx)
    const phoneRegex =  /^((([+]46)\s*((1|7)[0236]))|(0(1|7)[0236]))\s*(([-]|())\s*[0-9]\s*[0-9]\s*[0-9]\s*[0-9]\s*[0-9]\s*[0-9]\s*[0-9]\s*|([0-9]\s*([-]|()))\s*[0-9]\s*[0-9]\s*[0-9]\s*[0-9]\s*[0-9]\s*[0-9]\s*)$/;
    // Check if the phone number matches the regex pattern
    ///^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    //const isValid = (phone.length === 10);
    const isValid = phoneRegex.test(phone);
    // Show or hide the phone alert based on the validity of the phone number
    phoneAlert.style.display = phone ? (isValid ? "none" : "block") : "block";
    // Return whether the phone number is valid
    return isValid;
}
// Function to validate the entire form
// function validateForm() {
//     // Get the values of name, email, and phone input fields
//     const name = document.getElementById('name').value;
//     const emailVal = document.getElementById('email').value;
//     const phoneVal = document.getElementById('phone').value;

//     // Show or hide the name alert based on whether the name input has a value
//     nameAlert.style.display = name ? "none" : "block";

//     // Validate the email and phone inputs
//     const isValidEmailValue = validateEmail(emailVal);
//     const isValidPhoneValue = validatePhone(phoneVal);

//     // Return true if all inputs are valid, otherwise false
//     return name && isValidEmailValue && isValidPhoneValue;
// }