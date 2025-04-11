// ----------- STYLE AND APPEREANCE ----------------- //
let nightmodeVar = JSON.parse(localStorage.getItem("nightmode")) ?? true;
const button = document.getElementById('changeColorBtn');
const body = document.body;
const sun= document.getElementById("sun"); const moon= document.getElementById("moon");
const sun2= document.getElementById("sun-m"); const moon2= document.getElementById("moon-m");

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
function saveScrollPosition() {
    localStorage.setItem("scrollPosition", window.scrollY);
    console.log("Saved position:", localStorage.getItem("scrollPosition"));
}
function scrollToSavedPos(){
    const savedScrollPosition = localStorage.getItem("scrollPosition");
    console.log("Scrolling to:", savedScrollPosition);
    
    if (savedScrollPosition !== null) {  window.scrollTo(0, Number(savedScrollPosition));} // Ensure it's a number  
}
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
window.addEventListener('resize', moveChild); 
// -------------- ^ STYLE AND APPEREANCE ^ --------------- //

class CartItem {
    constructor(id, name, price, size, images = [], quantity = 1, itemType = "poster") {
        this.id = id;
        this.name = name;
        this.price = price;
        this.size = size;
        this.images = images;
        this.quantity = quantity;
        this.itemType = itemType;
    }
}

let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"))?.map(item => new CartItem(item.id, item.name, item.price, item.size, item.images, item.quantity)) || [];
localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
const shippingPrices = [18, 38];
const posterPrices = [45, 55];
const freeShippingMin = 120;
console.log("Initial localStorage.shoppingCart:", localStorage.getItem("shoppingCart"));

document.addEventListener("DOMContentLoaded", () => {
    if(body.dataset.page === 'success'){
        displayUserPurchaseInformation();
        updateStock();
        clearCart();
        return;
    }
    setNightMode();
    if (body.dataset.page === 'order'){
        addCartItems();
        document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
        addCheckoutButton();
    }
    if (body.dataset.page === 'product'){
        showProductInfo();
    }
    else if (body.dataset.page !== 'posters'){
        localStorage.setItem("scrollPosition", null);
    }
    if (body.dataset.page !== 'posters'){
        return;
    }
    const posterGrid = document.getElementsByClassName('painting-grid-posters')[0];
    fetch('/getAllPosters')
        .then(response => response.json())
        .then(postersData => {
            postersData.forEach((poster) => {
                if (poster.available === false){ return; }
                console.log("Poster ID:", poster._id); // Make sure this logs the real Mongo ID
                
                const imgBg = document.createElement('div');
                imgBg.setAttribute('class', 'imgBg');

                const div_card = document.createElement('div');
                div_card.setAttribute('class', 'poster-child');

                const image = document.createElement('img');
                image.setAttribute('class', 'thumbnail');
                image.setAttribute('id', 'image'); 
                image.src = poster.image;

                const imageLink = document.createElement('a');
                imageLink.setAttribute('onclick', 'saveScrollPosition();');
                imageLink.href = `/posters/${poster._id}`;

                const link = document.createElement('a');
                link.setAttribute('onclick', 'saveScrollPosition();');
                link.href = `/posters/${poster._id}`;
                link.setAttribute('class', 'poster-link');

                const poster_flex = document.createElement('div');
                poster_flex.setAttribute('class', 'poster-flex')

                const title = document.createElement('h3');
                title.setAttribute('id', 'title');
                title.setAttribute('class', 'poster-flex-child .poster-flex-child-left');
                //console.log("-id ",poster._id);

                const add = document.createElement('button');
                add.setAttribute('type', 'button');
                add.setAttribute('id', 'add-button-id');
                add.setAttribute('onclick', `addToCart('${poster._id}');`);

                add.setAttribute('class', 'fa-plus poster-flex-child add-button');
                add.style.margin = "0rem";
                add.style.padding = ".8rem";
                
                const inner_flex = document.createElement('div');
                inner_flex.setAttribute('class', 'inner-flex');
                
                const middle_flex = document.createElement('div');
                middle_flex.setAttribute('class', 'middle-flex');

                const price_text = document.createElement('h2');
                price_text.style = 'margin: 0rem;';

                const emailContainer = document.createElement('div');
                emailContainer.setAttribute('class', 'formContainer');
                emailContainer.setAttribute('id', `form${poster._id}`);
                emailContainer.style="background-color: var(--main-bg-color-rgba); padding: 1rem; position: absolute; bottom: 0rem;";
                //emailContainer.style="width: 100%; background-color: var(--main-bg-color); padding: 10px; min-height: 50px;";

                const selectSizes = document.createElement('select');
                selectSizes.setAttribute('type', 'select');
                selectSizes.setAttribute('class', 'product-select');
                selectSizes.setAttribute('id', `${poster._id}`);
                selectSizes.style = "background-color: var(--h2-text-color);";
                
                const sizes = poster.sizes; 
                selectSizes.innerHTML = ""; 

                add.id = 'btn'+poster._id;
                title.innerText = poster.name;
                imgBg.style.backgroundColor = "#fdf8e5";
                
                imgBg.appendChild(imageLink);
                imageLink.appendChild(image); // Wrap the image in the link
                //imgBg.appendChild(add);
                div_card.appendChild(imgBg);
                div_card.appendChild(poster_flex);
                poster_flex.appendChild(link);
                link.appendChild(title);
                inner_flex.appendChild(price_text);
                inner_flex.appendChild(selectSizes);
                poster_flex.appendChild(middle_flex);
                imgBg.appendChild(emailContainer);
                middle_flex.appendChild(add);
                middle_flex.appendChild(inner_flex);
                
                posterGrid.appendChild(div_card);

                if (sizes && typeof sizes === 'object' && Object.keys(sizes).length > 0) {
                    buildSelectSize(selectSizes, sizes, price_text);
                }
                checkIfOut(selectSizes, selectSizes.options, price_text);
            });
            
            scrollToSavedPos();
            window.addEventListener('resize', moveChild);
            moveChild(); // Run once on page load
        })
        .catch(error => console.error('Error fetching posters:', error));
});

function w(string){
    console.log(string);
}

async function addToCart(posterId) {
    console.log("poster.id ",posterId);
    console.log("hej");
    const selectElement = document.getElementById(`${posterId}`);
    console.log(selectElement);
    const selectedSize = selectElement?.value;
    console.log(selectedSize);
    if (!selectedSize) {
        w("no size");
        alert("Please select a size before adding to cart!");
        return; 
    }
    w(selectedSize);

    const selectedOption = selectElement?.selectedOptions[0]; 
    if (selectedOption && selectedOption.getAttribute("data-disabled") === "true") {
        w("no stock");
        alert("This size is currently out of stock. Please choose another.");
        return; 
    }

    try {
        const response = await fetch(`/getPosterWithId/${posterId}`);
        const data = await response.json();

        const foundItem = shoppingCart.find(item => item.id === posterId && item.size === selectedSize);
        const imagesArray = [data.image];

        let testQuantity = foundItem ? foundItem.quantity + 1 : 1;
        console.log('this is before adding to cart ',posterId,selectedSize,testQuantity);
        // Check stock before adding to cart
        const stockResponse = await fetch('/check-stock-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                id: posterId,  // Change posterId → id 
                size: selectedSize, 
                quantity: testQuantity 
            })
        });

        const stockData = await stockResponse.json();
        console.log("Stock check response:", stockData);
        const s = (stockData.quantity-1 > 1) ? 's' :'';

        if (!stockData.success) {
            alert(`The last ${stockData.quantity-1} item${s} in stock of ${stockData.name} in size ${stockData.size} is already in your cart 😬`);
            return;
        }
        console.log("sel ind: ",document.getElementById(`${posterId}`).selectedIndex -1);
        // Add to cart logic
        if (foundItem) {
            foundItem.quantity++; // Increase quantity if already in cart
        } else {
            let newItem = new CartItem(
                posterId, 
                data.name,
                posterPrices[document.getElementById(`${posterId}`).selectedIndex -1], 
                //posterPrices[document.getElementById(`s${posterId}`).selectedIndex], 
                selectedSize, 
                imagesArray
            );
            shoppingCart.push(newItem);
            console.log('New item added: ', newItem);
        }
        console.log("iddd: ",posterId);

        // Save cart to local storage
        localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
        console.log('Cart from storage:', localStorage.getItem("shoppingCart"));

    } catch (error) {
        console.error("Error adding to cart:", error);
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

async function checkStock(posterId,selectedSize,testQuantity) {
    const valueInStockResult = await valueInStock(testQuantity); // Assuming valueInStock() is the function you're using
    return valueInStockResult;
}

async function valueInStock(posterId,selectedSize,testQuantity){
    //console.log(posterId,selectedSize,testQuantity);
    // Check stock before adding to cart
    console.log("look at this id: ",id,'size ', selectedSize,'testquantity ',testQuantity);
    const stockResponse = await fetch('/check-stock-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            id: posterId,  // Change posterId → id 
            size: selectedSize, 
            quantity: testQuantity 
        })
    });
    
    const stockData = await stockResponse.json();
    return stockData.success;
}

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

    async function checkStockBeforeCheckout(buyingSizesAmount) {
        console.log('buying sizes: am',buyingSizesAmount);
        const response = await fetch("/check-stock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ buyingSizesAmount })
        });
    
        const result = await response.json();
        if (!result.success) {
            console.log("stock: ", false);
            alert(result.message);
            return false;
        }
        
        return true; // Stock is fine
}

document.getElementById("checkout-button").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form submission
    const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    const buyingSizesAmount = shoppingCart.map(item => ({
        id: item.id,
        size: item.size,
        quantity: item.quantity
    }));
    console.log("sizes amount: ", buyingSizesAmount);
    const stock = await checkStockBeforeCheckout(buyingSizesAmount);
    console.log("stock: ", stock);
    if (!stock){ 
        return;}
    let amount_shipping = calculatePrices();
    const country = countrySelect.value;
    const currency = currencySelect.value;
    document.documentElement.setAttribute('lang', country);
    console.log('lang: ',document.documentElement.getAttribute('lang'));

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
            const itemPoster = postersData.find(poster => poster._id === cartItem.id);
            if (!itemPoster) {
                console.warn("Poster not found for ID:", cartItem.id);
                return;
            }
            const imgBg = document.createElement('div');
            imgBg.setAttribute('class', 'imgBg');
            
            const div_card = document.createElement('div');
            div_card.setAttribute('class', 'cart-item');
            div_card.setAttribute('id', cartItem.id);
            
            const image = document.createElement('img');
            image.setAttribute('class', 'thumbnail');
            image.src = itemPoster.image;
            
            const poster_flex = document.createElement('div');
            poster_flex.setAttribute('class', 'order-poster-flex');
            
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
                // checkStock(cartItem.id,selectedSize,cartItem.quantity).then((valueInStock) => {
                    //     console.log('value in stock: ',valueInStock);
                    // if (!valueInStock) {return;}});
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
            remove.setAttribute('onclick', `removeFromCart('${cartItem.id}', '${cartItem.size}')`);
            
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

async function updateStock(){ 
    const posterSizes = shoppingCart.map(item => ({
        id: item.id,
        sizes: { [item.size]: item.quantity } 
    }));
    console.log('postersizes for updating stock: ',posterSizes);
    const response = await fetch("/update-stock", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ posterSizes }),
    });  
    const result = await response.json();
    if (!result.success) {
        console.log("update res: ", false);
        alert(result.message);
    }
}

function showProductInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const posterData = Object.fromEntries(urlParams.entries()); // Parse query parameters into an object
    const formContainer = document.getElementsByClassName('formContainer')[0];
    if (posterData) {
        document.getElementById('product-img').src = posterData.image;
        document.getElementById('product-title').textContent = posterData.name;
        document.getElementById('product-desc').textContent = posterData.desc + 'This image has reduzed quality, look at home to see the real quality of the print';
        document.getElementsByClassName('add-button')[0].id = posterData._id;
        document.getElementsByClassName('product-select')[0].id = posterData._id;
        formContainer.id = 'form'+posterData._id;
    }
    fetch(`/getPosterWithId/${posterData._id}`)
    .then(response => response.json())
    .then(selectedPoster => {
        if (!selectedPoster) {
            console.error("Poster not found");
            return;
        }
        const sizes = selectedPoster.sizes; // Extract sizes
        if (sizes && typeof sizes === 'object' && Object.keys(sizes).length > 0) {
            const selectSizes = document.getElementsByClassName('product-select')[0];
            buildSelectSize(selectSizes, sizes, document.getElementById('product-price'));
        }
        else (w("error: sizes doesnt exist or isnt an object etc"));
    })
    .catch(error => console.error("Error fetching poster:", error));
}
function setOptionsAbled(options){
    for (const option of Object.entries(options)){
        option.disabled = "false";
    }
}
function buildSelectSize(selectObject, sizesKeysObject, priceTextObject){
    const sizesTitleOption = document.createElement("option");
    sizesTitleOption.value = "";
    sizesTitleOption.disabled = true;
    sizesTitleOption.setAttribute('data-disabled', true);
    sizesTitleOption.selected = false;
    sizesTitleOption.style.color = "black";
    sizesTitleOption.textContent = "Sizes";
    selectObject.appendChild(sizesTitleOption);

    const hr = document.createElement("hr");
    selectObject.appendChild(hr);

    let hasInStock = false;
    for (const [size, quantity] of Object.entries(sizesKeysObject)) {
        console.log(`Size: ${size}, Quantity: ${quantity}`);
        const option = document.createElement('option');
        option.setAttribute('value', size);                                                                                                   
        if (quantity <= 0){
            option.setAttribute('data-disabled', true);
            //option.selected = false;
        }
        else if (!hasInStock) {
            option.selected = true; // Set the first available as selected
            hasInStock = true;
        }
        
        option.innerHTML = size;
        selectObject.appendChild(option);
    }

    selectObject.addEventListener('change', (event) => {
        const selectedSize = event.target.value;
        const selectedOption = event.target.selectedOptions[0]; // Get the selected <option>
        const sizesKeys = Object.keys(sizesKeysObject);
        const sizesIndex = sizesKeys.indexOf(selectedSize);

        const formContainers = document.getElementsByClassName("formContainer");
        const formContainer = Array.from(formContainers).find(el => el.id === 'form'+selectObject.id);
        formContainer.style.display = 'none';
        removeAddButton(document.getElementById('btn'+selectObject.id));
        console.log("event change");
        
        if (selectedOption.getAttribute("data-disabled") === "true") {
            priceTextObject.textContent = "out";
            if (body.dataset.page === 'product'){ formContainer.style.display = 'flex'; }
            else {formContainer.style.display = 'block';}
            if (formContainer && formContainer.children.length === 0){
                console.log("inside");
                createEmailInput(formContainer,selectObject);
                removeAddButton(document.getElementById('btn'+selectObject.id));
            }
        } else if (sizesIndex !== -1 && sizesIndex < posterPrices.length) {
            priceTextObject.textContent = posterPrices[sizesIndex] + "kr";
            showAddButton(document.getElementById('btn'+selectObject.id));
            removeEmailInput(formContainer);
        } else {
            priceTextObject.textContent = posterPrices[0] + "kr"; // Default price
            showAddButton(document.getElementById('btn'+selectObject.id));
            removeEmailInput(formContainer);
        }
    });
    selectObject.dispatchEvent(new Event('change'));
} 

function checkIfOut(selectSizes, options, priceTextObj){
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

function removeEmailInput(emailContainer) {
    console.log("removing");
    emailContainer.style.display = 'none';
    const children = Array.from(emailContainer.children); // Make it a static copy
    if (!children){return;}
    for (const child of children) {
      console.log(child.tagName); // or w() if that's your debug function
      child.remove();
    }
  }
  
function createEmailInput(emailContainer, selectSizes){
    // Create label
    const label = document.createElement("label");
    label.setAttribute("for", "email");
    label.textContent = "Email me when back in stock:";
    label.style.marginLeft = "auto";

    // Create span for validation message
    const emailAlert = document.createElement("span");
    emailAlert.setAttribute("id", "emailAlert");
    emailAlert.textContent = "Email is unvalid";
    emailAlert.style.marginLeft = "auto";

    // Create input field
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "email");
    input.setAttribute("name", "email");
    input.setAttribute("placeholder", "example@gmail.com");
    input.style.margin = ".5rem";
    input.style.marginLeft = "auto";

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.style.marginLeft = "auto"; 
    confirmButton.style.marginTop = "1rem"; 
    confirmButton.style.marginBottom = "1rem"; 
    confirmButton.style.padding = ".5rem 1rem";
    confirmButton.style.cursor = "pointer";
    confirmButton.style.margin = ".5rem";
    confirmButton.style.marginLeft = 'auto';
    confirmButton.style.borderRadius= '.5rem';
    confirmButton.style.backgroundColor= 'var(--h1-color)';
    confirmButton.style.textDecoration= 'none';

    const addedToListAlert = document.createElement("span");
    addedToListAlert.setAttribute("id", "addedToListAlert");
    addedToListAlert.style.marginLeft = "auto";

    // Append elements to the DOM (for example, inside a form or a div)
    emailContainer.appendChild(label);   
    emailContainer.appendChild(input);
    emailContainer.appendChild(confirmButton);
    emailContainer.appendChild(emailAlert);
    emailContainer.appendChild(addedToListAlert);
    if (body.dataset.page === 'product'){
        emailContainer.style.display = 'flex';
    }   
    else{emailContainer.style.display = 'block';}

    confirmButton.addEventListener("click", () => {
        console.log("Email confirmed:", input.value);
        // if (!selectSizes.value){
        //     emailAlert.textContent = "Choose a size to add";
        // }
        if (validateEmail(input.value, emailAlert)){
            console.log('database: ', selectSizes.selectedIndex,' ', input.value);
            console.log(selectSizes.value);
            addedToListAlert.textContent = `I'll send a mail to ${input.value} when back in stock!`;
            addedToListAlert.style.display = 'block';
        }
    });

    input.addEventListener("input", (event) => {
        //validateEmail(input.value, emailAlert);
        addedToListAlert.style.display = 'none';
        emailAlert.style.display = 'none';
    });
}

function removeAddButton(addButton){
    if (!addButton){
        document.getElementsByClassName("add-button")[0].style.display = 'none';
    }
    else {
        addButton.style.display = 'none';
    }
}

function showAddButton(addButton){
    if (!addButton){
        document.getElementsByClassName("add-button")[0].style.display = 'block';
    }
    else {
        addButton.style.display = 'block';
    }
}

function removeFromCart(posterId, size) {
    console.log("remove id: ",posterId);
    let idCartItems = Array.from(document.getElementsByClassName('cart-item'));
    console.log("Checking IDs in cart items:");
    idCartItems.forEach(item => console.log("Item ID:", item.id));

    let filteredList = idCartItems.filter(item => item.id === posterId);
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
    const removeCartItem = shoppingCart.find(item => item.id === posterId && item.size === size);
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
    if(body.dataset.page === 'success'){return;}
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

const nameAlert = document.getElementById("nameAlert");
const emailAlert = document.getElementById("emailAlert");
const phoneAlert = document.getElementById("phoneAlert");
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
function validateEmail(email, emailAlert) {
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