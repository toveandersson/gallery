import {buildPosterCards, buildCheckoutCart, buildSelectSize, buildCheckout, buildPortfolio, addOverlayResponse, nightMode, buildHomeInteraction, clearCart } from './builder.js';

// ---------------------- VARIABLES --------------------- //

const body = document.body;
if (!localStorage.getItem("shoppingCart")) { localStorage.setItem("shoppingCart", JSON.stringify([])); }
export let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"));
const frontendPriceData = { shippingPrices: { domestic: 18, international: 38 }, freeShippingMin: 120};

// ---------------- CALLS TO BACKEND -----------------------//

//----- fetch 

document.addEventListener("DOMContentLoaded", async () => {
    const page = body.dataset.page;
    addOverlayResponse();
    if(page === 'success'){
        displayUserPurchaseInformation();
        updateStock();
        clearCart();
        return;
    }
    nightMode(false);
    if (page === 'home'){
        buildHomeInteraction();
        body.style.backgroundColor = "#b62517";
        redMarks();
    }
    //else { body.querySelector('footer').style.backgroundColor = 'var(--red-theme)';}
    if (page === 'order'){
        loadCartCards();
        document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
        addCheckoutButton();
    }
    if (page === 'portfolio'){
        buildPortfolio();
    }
    const productPages = ['poster', 'mug', 'jewellery'];
    if (page === 'product'){
        showProductInfo();
        //document.getElementsByClassName("go-back-btn")[0].href = '/' + localStorage.getItem("goBackToPage");
    }
    else if (!productPages.includes(page)){
        localStorage.setItem("scrollPosition", null);
        return;
    }
    loadPosterCards();
});

function loadPosterCards(){
    const posterGrid = document.getElementsByClassName('painting-grid-posters')[0];
    fetch(`/get-all-products/${body.dataset.page}`)
        .then(res => res.json())
        .then(data => buildPosterCards(data, posterGrid))
        .catch(err => console.error('Error:', err));
}

function loadCartCards() {
    calculatePrices();
    const itemGrid = document.getElementsByClassName('shopping-cart')[0];
    itemGrid.innerHTML = "";  // Clear previous items to prevent duplication
    // document.getElementById('price').innerText = `Price: ${price} kr\u2003\u2003\u2003${price > 120 ? "free shipping!" : shoppingCart.length === 0 ?  " " : "shipping: 18kr"}`;
    // document.getElementById('total-price').innerText = `Total price: ${price + (price > 120 ? 0 : shoppingCart.length === 0 ?  " " : 18)} kr`;
    fetch('/get-all-products') 
        .then(response => response.json())
        .then(productData => buildCheckoutCart(productData, shoppingCart, itemGrid))
        .catch(error => console.error('Error fetching posters:', error));
}

function showProductInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const productData = Object.fromEntries(urlParams.entries()); // Parse query parameters into an object
    const formContainer = document.getElementsByClassName('formContainer')[0];
    if (productData) {
        document.getElementById('product-img').src = productData.image;
        document.getElementById('product-title').textContent = productData.name;
        document.getElementsByClassName('add-button')[0].id = productData._id;
        document.getElementsByClassName('product-select')[0].id = productData._id;
        formContainer.id = 'form'+productData._id;
        let extraText = "";
        if (productData.type === "mug"){
            extraText = "Dishwasher safe.";
        }
        document.getElementById('product-desc').textContent = productData.desc + extraText;// ' The image quality is reduzed, look at the homepage to see a more realistic quality of the print!';
    }
    fetch(`/get-product/${productData._id}`)
        .then(response => response.json())
        .then(selectedProduct => {
            if (!selectedProduct) {
                console.error("Product not found");
                return;
            }
            console.log("data ",selectedProduct);
            const sizes = selectedProduct.sizes; // Extract sizes
            if (sizes && typeof sizes === 'object' && Object.keys(sizes).length > 0) {
                const selectSizes = document.getElementsByClassName('product-select')[0];
                buildSelectSize(selectSizes, sizes, document.getElementById('product-price'), selectedProduct.prices);
            }
            else (console.log("error: no sizes or no object etc"));
        })
        .catch(error => console.error("Error fetching poster:", error));
}

// ---- post  

function addCheckoutButton(){
    // Dynamic country and currency select setup
    let {country, currency} = buildCheckout();
    document.getElementById("checkout-button").addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent default form submission
        const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
        const buyingSizesAmount = shoppingCart.map(item => ({
            id: item._id,
            size: item.size,
            quantity: item.quantity
        }));
        const stock = await checkStockBeforeCheckout(buyingSizesAmount);
        if (!stock.success){ 
            return; }
        const pluralText= stock.lastItemsLength > 1 ? 'them' : 'it';
        if (stock.lastItems){  const text = 
`Note that you have the last item of:
${stock.lastItems} 
in your cart

Somebody could buy ${pluralText} before you on the next page and Stripe will not notify you, so don't take longer than necessary!`
        alert(text); }

        if (shoppingCart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const response = await fetch("/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cartItems: shoppingCart, country : country || "unknown", currency: currency}),
        });

        const data = await response.json();
        if (data.url) {
            window.location.href = data.url; // Redirect to Stripe checkout
        } else {
            console.error("Error creating checkout session:", data.error);
        }
    });
}

export async function sizeBackendCheck(productId, selectedSize, sizeQuantityToCheck){
    const stockResponse = await fetch('/check-stock-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
                id: productId,  
                size: selectedSize, 
                quantity: sizeQuantityToCheck 
            })
        });
    
    const stockData = await stockResponse.json();
    console.log("Stock response:", stockData); 
    const s = (stockData.quantity-1 > 1) ? 's' :'';

    if (!stockData.success) {
        alert(`The last ${stockData.availableStock} item${s} in stock of ${stockData.name} in size ${stockData.size} is in your cart`);
        return stockData;
    }
    return stockData;
}

async function checkStockBeforeCheckout(buyingSizesAmount) {
        const response = await fetch("/check-stock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ buyingSizesAmount })
        });
    
        const result = await response.json();
        if (!result.success) {
            alert(result.message);
            return false;
        }
        return result;
}

//------------- OTHER --------------//

export async function addToCart(foundItem, selectedSize, backendData, selectedIndex) {
    if (foundItem) { foundItem.quantity++; } //already in cart 
    else {
        let newCartItem = { ...backendData.product };
        newCartItem.size = selectedSize;
        newCartItem.price = backendData.product.prices[selectedIndex-1];
        newCartItem.quantity = Number(1);
        newCartItem.priceIndex = selectedIndex-1;
        delete newCartItem.sizes;
        delete newCartItem.prices;

        delete newCartItem.available;
        delete newCartItem.desc;
        delete newCartItem.set;
        shoppingCart.push(newCartItem);
        console.log('New item added: ', newCartItem);
    }
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
}

export function calculatePrices(){
    let price = 0;
    shoppingCart.forEach(item=>{
        price += item.price * item.quantity;
    })
    let amount_shipping = price > frontendPriceData.freeShippingMin ? 0 : frontendPriceData.shippingPrices.domestic;
    amount_shipping = Math.round(amount_shipping);
    price = Math.round(price);
    document.getElementById('price').innerText = `Price: ${price} kr\u2003\u2003\u2003${price > 120 ? "free shipping!" : shoppingCart.length === 0 ?  " " : "shipping: 18kr"}`;
    document.getElementById('total-price').innerText = `Total price: ${price + amount_shipping} kr`;
}

export function checkAndGetSelectedSize(posterId){
    const selectElement = document.getElementById(`${posterId}`);
    const selectedSize = selectElement?.value;
    if (!selectedSize) {
        alert("Please select a size before adding to cart!");
        return null; 
    }
    const selectedOption = selectElement?.selectedOptions[0]; 
    if (selectedOption && selectedOption.getAttribute("data-disabled") === "true") {
        alert("This size is currently out of stock. Please choose another.");
        return null; 
    }
    return selectedSize;
}

export function checkIfOut(selectSizes, options, priceTextObj){
    // console.log("checking if");
    // console.log([...options].map(option => option.outerHTML)); // Debug: Check all options
    if ([...options].every(option =>  option.disabled || option.getAttribute("data-disabled") === "true")) {
        console.log("All options are unavailable.");
        priceTextObj.textContent = 'out';
        priceTextObj.style = "x-small";
        priceTextObj.style.marginBottom = "0rem"; 
        priceTextObj.style.marginTop = "0rem";
        //priceTextObj.style.fontSize = "2rem";
        selectSizes.style.marginLeft = '0rem';
        return true;
    }
    else{
        return false;
    }
}

//-------- AFTER PURCHACE---------//

function displayUserPurchaseInformation() {
    document.getElementsByClassName("purchase-info-text")[0].innerText = "I have sent an order confirmation to no one?";
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    if (sessionId) {
        // Fetch session details from your backend
        fetch(`/stripe/session/${sessionId}`)
            .then(response => response.json())
            .then(data => {
                if (data.customer_email) {
                    console.log(data.customer_email);  // Make sure this has a valid value before calling detectEmailService
                    console.log(typeof(data.customer_email));
                    const link = detectEmailService(data.customer_email);
                    if (link !== 'Unknown'){
                        console.log(link);
                        document.getElementsByClassName("purchase-info-text")[0].innerHTML = `<p><small>I have sent an order confirmation to </small> <strong><a href="${link}"target="_blank">${data.customer_email}</a></strong></p>`;
                    }
                    else {
                        console.log(link);
                        document.getElementsByClassName("purchase-info-text")[0].innerHTML = `<p><small>I have sent an order confirmation to </small> <strong>${data.customer_email}</strong></p>`;
                    }

                } else {
                    console.error("No email found in session data.");
                }
            })
            .catch(error => console.error("Error fetching session details:", error));
    }
}

function detectEmailService(email) {
    if (!email) {
        console.error('No email provided');
        return 'Unknown';  // Or handle it however you need to
    }
    const parts = email.split('@');
    const domain = parts[1].trim(); // Get the domain part
    if (domain === 'gmail.com') {  console.log("email: ",domain); return 'https://mail.google.com';
    } else if (domain === 'outlook.com' || domain === 'hotmail.com') {  console.log("email: ",domain);  return 'https://outlook.live.com';
    } else if (domain === 'yahoo.com') { console.log("email: ",domain); return 'https://mail.yahoo.com';
    } else if (domain === 'icloud.com') { console.log("email: ",domain);  return 'https://www.icloud.com/mail';
    } else {console.log("email: ",domain);  return 'Unknown';  }
}

// ------------- VALIDATION ----------- //

const nameAlert = document.getElementById("nameAlert");
const emailAlert = document.getElementById("emailAlert");
const phoneAlert = document.getElementById("phoneAlert");

export function validateEmail(email, emailAlert) {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if the email matches the regex pattern
    const isValid = emailRegex.test(email);
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

//---------- NOT IN USE ----------//

function showSwish() {
    const swishDiv = document.getElementsByClassName('swish-div');
    for (let i = 0; i < swishDiv.length; i++) {
        swishDiv[i].style.display = 'block';
        console.log(swishDiv[i]);
        console.log(swishDiv[i].style.display);
    }
}

//const button = document.getElementById('changeColorBtn');
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
function redMarks() {
    const markElements = document.getElementsByClassName("pinkMark");
    for (let i = 0; i < markElements.length; i++) {
        markElements[i].classList.add('red');
            
    }
}
//if (page === 'home'){ //document.getElementsByClassName('nav')[0].style.backgroundColor = 'rgba(29, 29, 29, 0.5)'; }


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


//addchekoutbutton function längst ner???


// async function updateStock(){ 
//     const posterSizes = shoppingCart.map(item => ({
//         id: item.id,
//         sizes: { [item.size]: item.quantity } 
//     }));
//     console.log('postersizes for updating stock: ',posterSizes);
//     const response = await fetch("/update-stock", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ posterSizes }),
//     });  
//     const result = await response.json();
//     if (!result.success) {
//         console.log("update res: ", false);
//         alert(result.message);
//     }
// }


// function setOptionsAbled(options){
//     for (const option of Object.entries(options)){
//         option.disabled = "false";
//     }
// }