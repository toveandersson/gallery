//let { posters } = require('./scripts/postersData');
//import posters from './scripts/postersData.js';
//import posters from './scripts/postersData.js';
// const express = require('express')
// const app = express()
class CartItem {
    constructor(id, name, price, size, quantity = 1) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.size = size;
        this.quantity = quantity;
    }
}
let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"))?.map(item => new CartItem(item.id, item.name, item.price, item.size, item.quantity)) || [];
//showSwish();

localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
const shippingPrices = [18, 38];
const posterPrices = [45, 55];
const freeShippingMin = 120;
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
        document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
        addCheckoutButton();
    }
    if (document.body.dataset.page === 'product'){
        console.log("productpage");
        showProductInfo();
    }
    if (document.body.dataset.page !== 'posters'){
        console.log("return, on ",document.body.dataset.page);
        return;
    }
    const posterGrid = document.getElementsByClassName('painting-grid-posters')[0];
    fetch('/getAllPosters')
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

                const imageLink = document.createElement('a');
                imageLink.href = `/posters/${poster.id}`;
                //link.setAttribute('class', 'poster-link');

                // Create a link to wrap the image
                const link = document.createElement('a');
                link.href = `/posters/${poster.id}`;
                link.setAttribute('class', 'poster-link');

                const poster_flex = document.createElement('div');
                poster_flex.setAttribute('class', 'poster-flex')

                const title = document.createElement('h3');
                title.setAttribute('id', 'title');
                title.setAttribute('class', 'poster-flex-child .poster-flex-child-left');

                const add = document.createElement('button');
                add.setAttribute('type', 'button');
                add.setAttribute('class', 'fa-plus poster-flex-child add-button');
                add.setAttribute('id', 'add-button-id');
                add.setAttribute('onclick', 'addToCart(this.id)');
                
                const inner_flex = document.createElement('div');
                inner_flex.setAttribute('class', 'inner-flex');

                const price_text = document.createElement('h2');
                price_text.style = 'margin: 0rem;';

                const selectSizes = document.createElement('select');
                selectSizes.setAttribute('type', 'select');
                selectSizes.setAttribute('class', 'product-select');
                selectSizes.setAttribute('id', `s${poster.id}`);
                selectSizes.style = "background-color: var(--h2-text-color);";

                
                const sizes = poster.sizes; // Extract sizes

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

                selectSizes.addEventListener('change', (event) => {
                    const sizesIndex = Object.keys(sizes).indexOf(event.target.value);
                    if (sizesIndex == 0){
                        price_text.textContent = posterPrices[0]+'kr';
                    }
                    else if (sizesIndex >= 0){
                        price_text.textContent = posterPrices[1]+'kr';
                    }
                    else {
                        price_text.textContent = posterPrices[0]+'kr'; 
                    }
                });

                selectSizes.dispatchEvent(new Event('change'));
                
                if (!selectSizes.value) {
                    price_text.textContent = 'no left';
                    selectSizes.style.width = '30%';
                    selectSizes.style.marginLeft = '0rem';
                }

                //add sizes to it

                add.id = poster.id;
                title.innerText = poster.name;
                imgBg.style.backgroundColor = "#fdf8e5";

                imgBg.appendChild(imageLink);
                imageLink.appendChild(image); // Wrap the image in the link
                imgBg.appendChild(overlay); // Add the overlay over the image
                imgBg.appendChild(add);
                div_card.appendChild(imgBg);
                div_card.appendChild(poster_flex);
                poster_flex.appendChild(link);
                link.appendChild(title);
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

function addCheckoutButton(){
    
    // Dynamic country and currency select setup
    const countryToCurrencyMap = {
        'SE': 'sek', 'FR': 'eur', 'DE': 'eur', 'IT': 'eur', 'ES': 'eur',
        'NL': 'eur', 'BE': 'eur', 'DK': 'dkk', 'FI': 'eur', 'NO': 'nok',
        'PL': 'pln', 'AT': 'eur', 'IE': 'eur', 'PT': 'eur', 'GR': 'eur',
        'LU': 'eur', 'CZ': 'czk', 'SK': 'eur', 'SI': 'eur',
        'LT': 'eur', 'LV': 'eur', 'EE': 'eur', 'BG': 'bgn', 'RO': 'ron',
        'HR': 'eur', 'CY': 'eur', 'MT': 'eur'
    };
    
    const countrySelect = document.getElementById("country-select");
    const currencySelect = document.getElementById("currency-select");
    countrySelect.addEventListener('change', function() {
        const selectedCountry = countrySelect.value;
        const selectedCurrency = countryToCurrencyMap[selectedCountry];
        currencySelect.value = selectedCurrency; // Update the currency select based on country
    });
    
    // Initialize the currency select when the page loads
    function initializeCurrencySelect() {
        const defaultCountry = 'SE'; // Default country or fetched country code
        const defaultCurrency = countryToCurrencyMap[defaultCountry];
        countrySelect.value = defaultCountry; // Set default country
        currencySelect.value = defaultCurrency; // Set default currency
    }
    
    document.getElementById("checkout-button").addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
        const amount_shipping = calculatePrices();
        const country = countrySelect.value;
        const currency = currencySelect.value;
        document.documentElement.setAttribute('lang', country);
        console.log('lang: ',document.documentElement.getAttribute('lang'));
        //return; 
        if (shoppingCart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        console.log({ cartItems: shoppingCart, amount_shipping, country : country || "unknown", currency: currency});
        if (country !== 'SE'){
            amount_shipping = shippingPrices[1];
        }
    
        const response = await fetch("/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cartItems: shoppingCart, amount_shipping, country : country || "unknown", currency: currency}),
        });
    
        const data = await response.json();
        if (data.url) {
            window.location.href = data.url; // Redirect to Stripe checkout
        } else {
            console.error("Error creating checkout session:", data.error);
        }
    });
    initializeCurrencySelect();
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
    const selectedSize = document.getElementById(`s${posterId}`)?.value;
    if (!selectedSize) {
        alert("Please select a size before adding to cart!");
        return;
    }
    fetch(`/getPosterWithId/${posterId}`)
        .then(response => response.json())
        .then(data => {
            const foundItem = shoppingCart.find(item => item.id === posterId && item.size === selectedSize);

            if (foundItem) { foundItem.quantity++; } 
            else {
                let newItem = new CartItem(posterId, data.name, posterPrices[document.getElementById(`s${posterId}`).selectedIndex], selectedSize);
                shoppingCart.push(newItem);
            }

            localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
        })
        .catch(error => console.error("Error fetching poster:", error));
}


function getShoppingCart() {
    const storedCart = localStorage.getItem("shoppingCart");
    if (storedCart) {
        shoppingCart = JSON.parse(storedCart).map(item => 
            new CartItem(item.id, item.name, item.price, item.size, item.quantity)
        );
    } else {
        shoppingCart = [];
    }
}

function calculatePrices(){
    let price = 0;
    shoppingCart.forEach(item=>{
        console.log('price: ',item.price,' quantity : ',item.quantity);
        price += item.price * item.quantity;
    })
    let amount_shipping = price > freeShippingMin ? 0 : shippingPrices[0];
    amount_shipping = Math.round(amount_shipping);
    price = Math.round(price);
    document.getElementById('price').innerText = `Price: ${price} kr\u2003\u2003\u2003${price > 120 ? "free shipping!" : shoppingCart.length === 0 ?  " " : "shipping: 18kr"}`;
    document.getElementById('total-price').innerText = `Total price: ${price + amount_shipping} kr`;

    return amount_shipping;
}

function addCartItems() {
    console.log("Adding updated list to cart:", shoppingCart);
    calculatePrices();
    const itemGrid = document.getElementsByClassName('shopping-cart')[0];
    itemGrid.innerHTML = "";  // Clear previous items to prevent duplication
    // document.getElementById('price').innerText = `Price: ${price} kr\u2003\u2003\u2003${price > 120 ? "free shipping!" : shoppingCart.length === 0 ?  " " : "shipping: 18kr"}`;
    // document.getElementById('total-price').innerText = `Total price: ${price + (price > 120 ? 0 : shoppingCart.length === 0 ?  " " : 18)} kr`;
    fetch('/getAllPosters')
        .then(response => response.json())
        .then(postersData => {
            shoppingCart.forEach(cartItem => {
                const itemPoster = postersData.find(poster => Number(poster.id) === Number(cartItem.id));
                if (!itemPoster) {
                    console.warn("Poster not found for ID:", cartItem.id);
                    return;
                }

                const imgBg = document.createElement('div');
                imgBg.setAttribute('class', 'imgBg');

                const div_card = document.createElement('div');
                div_card.setAttribute('class', 'cart-item');
                div_card.setAttribute('id', itemPoster.id);

                const image = document.createElement('img');
                image.setAttribute('class', 'thumbnail');
                image.src = itemPoster.image;

                const poster_flex = document.createElement('div');
                poster_flex.setAttribute('class', 'order-poster-flex')

                const title = document.createElement('h3');
                title.innerText = `${itemPoster.name}`;
                title.style.marginBottom = '0rem';

                const quantityDiv = document.createElement("div");
                quantityDiv.className = "quantity";

                const quantityInput = document.createElement("input");
                quantityInput.type = "number";
                quantityInput.className = "input-box";
                quantityInput.value = cartItem.quantity;
                quantityInput.min = "1";
                quantityInput.max = "10";

                quantityInput.addEventListener("change", (event) => {
                    cartItem.quantity = Number(event.target.value);
                    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
                    calculatePrices();
                });
                
                const size = document.createElement('h4');
                size.innerText = cartItem.size;
                size.style.margin = '0rem';
                size.style.marginBottom = '1rem';
                
                const price = document.createElement('h4');
                price.innerText = cartItem.price + 'kr';
                
                const remove = document.createElement('button');
                remove.setAttribute('class', 'fa-minus remove-button');
                remove.setAttribute('onclick', `removeFromCart(${cartItem.id}, '${cartItem.size}')`);
                
                imgBg.appendChild(image);
                div_card.appendChild(imgBg);
                div_card.appendChild(title);
                div_card.appendChild(size);
                div_card.appendChild(poster_flex);
                quantityDiv.appendChild(quantityInput);
                poster_flex.appendChild(quantityDiv);
                poster_flex.appendChild(price);
                poster_flex.appendChild(remove);
                itemGrid.appendChild(div_card);
            });
        })
        .catch(error => console.error('Error fetching posters:', error));
}

// document.getElementById('checkout-form').onsubmit = function() {
//     const amount = calculateAmount();  // Your function to calculate the amount dynamically
//     document.getElementById('amount').value = amount;
// };

function calculateAmount() {
    //kolla så allt finns först
    
}

function showProductInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const posterData = Object.fromEntries(urlParams.entries()); // Parse query parameters into an object
   
    if (posterData) {
      document.getElementById('product-img').src = posterData.image;
      document.getElementById('product-title').textContent = posterData.name;
      document.getElementById('product-desc').textContent = posterData.desc + 'This image has reduzed quality, look at home to see the real quality of the print';
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

function removeFromCart(posterId, size) {
    let idCartItems = Array.from(document.getElementsByClassName('cart-item'));
    let filteredList = idCartItems.filter(item => Number(item.id) === posterId);
    console.log('filtered list: ', filteredList);
    
    if (filteredList.length > 0) {
        filteredList.forEach(item => {
            for (const child of item.children) {
                if (child.innerHTML === size) {
                    console.log('child innerhtml: ',child.innerHTML);
                    item.remove();
                    return;
                }
            }
        });
    }
    const removeCartItem = shoppingCart.find(item => Number(item.id) === Number(posterId) && item.size === size);
    if (removeCartItem){
        shoppingCart.splice(shoppingCart.indexOf(removeCartItem), 1);
    }
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    calculatePrices();
}

function clearCart() {
    Array.from(document.getElementsByClassName('cart-item')).forEach(item => item.remove());
    shoppingCart = [];
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    calculatePrices();
}

function showSwish() {
    const swishDiv = document.getElementsByClassName('swish-div');
    for (let i = 0; i < swishDiv.length; i++) {
        swishDiv[i].style.display = 'block';
        console.log(swishDiv[i]);
        console.log(swishDiv[i].style.display);
    }
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