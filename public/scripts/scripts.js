// ----------- STYLE AND APPEREANCE ----------------- //
let nightmodeVar = JSON.parse(localStorage.getItem("nightmode")) ?? false;
const button = document.getElementById('changeColorBtn');
const body = document.body;
const suns = Array.from(document.getElementsByClassName("sun"));
const moons = Array.from(document.getElementsByClassName("moon"));
function displayOverlay() {
    // display overlay
    const turnOn = document.getElementById("overlay");
    turnOn.style.display = "block";
    //turn off vertical scroll
    const overflow = document.querySelector("body");
    overflow.style.overflow = "";
}
function hideOverlay() {
    const turnOff = document.getElementById("overlay");
    turnOff.style.display = "none";
    const overflow = document.querySelector("body"); 
    overflow.style.overflow = ""; //do nothing
}
function setNightMode() {
    nightmodeVar ? dark() : light();
}
function nightmodeSwitch() {
    nightmodeVar ? light() : dark();
}
function light() {
    body.classList.remove('nightmode');
    body.classList.add('lightmode');
    suns.forEach(sun=> sun.style.display = "none");
    moons.forEach(moon=> moon.style.display = "block" );
    //hideMarks('pinkMark', 'mark-hidden', false);
    nightmodeVar = false;
    localStorage.setItem("nightmode", nightmodeVar);
}
function dark() {   
    body.classList.remove('lightmode');
    body.classList.add('nightmode');
    suns.forEach(sun=> sun.style.display = "block");
    moons.forEach(moon=> moon.style.display = "none" );
    //hideMarks('pinkMark', 'mark-hidden', true);
    nightmodeVar = true;
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
function storePageScrollData(goBackToPage) {
    localStorage.setItem("scrollPosition", window.scrollY);
    localStorage.setItem("goBackToPage", goBackToPage);
}
function scrollToStoredPos(){
    const savedScrollPosition = localStorage.getItem("scrollPosition");
    if (savedScrollPosition !== null) {  window.scrollTo(0, Number(savedScrollPosition));} // Ensure it's a number  
}
function moveChild() {
    let children = document.getElementsByClassName('middle-flex');
    const desktopParents = document.getElementsByClassName('poster-flex');
    const mobileParents = document.getElementsByClassName('poster-child');
    
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (window.innerWidth <= 1200) {
            if (mobileParents[i]) mobileParents[i].appendChild(child); // Move to mobile parent
        } else {
            if (desktopParents[i]) desktopParents[i].appendChild(child); // Move to desktop parent
        }
    }
}
// -------------- ^ STYLE AND APPEREANCE ^ --------------- //
class CartItem {
    constructor(id, name, price, size, images = [], quantity = 1, itemType = "poster", set = 0, unique = false) { //set (collection) number for special sorting, unique if there is only one item and i want to add some text saying that?
        this.id = id;
        this.name = name;
        this.price = price;
        this.size = size;
        this.images = images;
        this.quantity = quantity;
        this.itemType = itemType;
        this.set = set;
        this.unique = unique;
    }
}
let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart"))?.map(item => new CartItem(item.id, item.name, item.price, item.size, item.images, item.quantity, item.type, item.set, item.unique)) || [];
localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
frontendPriceData = { shippingPrices: { domestic: 18, international: 38 }, freeShippingMin: 120};

document.addEventListener("DOMContentLoaded", async () => {
    const page = body.dataset.page;
    if (page === 'home'){
        //document.getElementsByClassName('nav')[0].style.backgroundColor = 'rgba(29, 29, 29, 0.5)';
    }
    if(page === 'success'){
        displayUserPurchaseInformation();
        updateStock();
        clearCart();
        return;
    }
    setNightMode();
    if (page === 'order'){
        addCartItems();
        document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
        addCheckoutButton();
    }
    if (page === 'portfolio'){
        buildPortfolio();
    }
    const productPages = ['poster', 'mug', 'jewellery'];
    if (page === 'product'){
        showProductInfo();
        document.getElementsByClassName("go-back-btn")[0].href = '/' + localStorage.getItem("goBackToPage");
    }
    else if (!productPages.includes(page)){
        localStorage.setItem("scrollPosition", null);
        console.log("do not include: ",page);
        return;
    }
    const posterGrid = document.getElementsByClassName('painting-grid-posters')[0];
    fetch(`/get-all-products/${page}`)
        .then(res => res.json())
        .then(data => buildPosterCards(data, posterGrid))
        .catch(err => console.error('Error:', err));
});
async function buildPosterCards(data, posterGrid){
    data.forEach((product) => {
        if (product.available === false){ return; }
        const imgBg = document.createElement('div');
        imgBg.setAttribute('class', 'imgBg');

        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'poster-child');

        const image = document.createElement('img');
        image.setAttribute('class', 'thumbnail');
        image.setAttribute('id', 'image'); 
        image.src = product.image;

        const imageLink = document.createElement('a');
        //imageLink.setAttribute('onclick', `storePageScrollData('${product.type}');`); 
        const singularPages = ['jewellery'];
        const s = singularPages.includes(product.type) ? '' : 's';
        imageLink.setAttribute('onclick', `storePageScrollData('${product.type+s}')`);
        imageLink.href = `/posters/${product._id}`;

        const link = document.createElement('a');
        link.setAttribute('onclick', `storePageScrollData('${product.type}')`);
        link.setAttribute('class', 'poster-link');
        link.href = `/posters/${product._id}`;

        const poster_flex = document.createElement('div');
        poster_flex.setAttribute('class', 'poster-flex')

        const title = document.createElement('h3');
        title.setAttribute('id', 'title');
        title.setAttribute('class', 'poster-flex-child .poster-flex-child-left');
        title.style.textDecoration = "underline";
        title.style.textDecorationThickness = ".4rem"; //title.style.textDecorationStyle ="wavy";
        title.style.textDecorationColor = "var(--decoration)"; // title.style.textDecorationSkipInk="none";

        const add = document.createElement('button');
        add.setAttribute('type', 'button');
        add.setAttribute('id', 'add-button-id');
        //add.setAttribute('onclick', `addToCart('${product._id}');`);
        add.addEventListener('click', async () => {
            const selectedSize = checkAndGetSelectedSize(product._id);
            if (!selectedSize) return;
            const foundItem = shoppingCart.find(item => item.id === product._id && item.size === selectedSize);
            const sizeQuantityToCheck = foundItem ? foundItem.quantity + 1 : 1;
            const backendData = await sizeBackendCheck(product._id, selectedSize, sizeQuantityToCheck);
            if (!backendData) return;

            addToCart(product._id, foundItem, selectedSize, backendData, selectSizes.selectedIndex);
        });
        add.setAttribute('class', 'fa-plus poster-flex-child add-button button');
        add.style.margin = "0rem";
        
        const inner_flex = document.createElement('div');
        inner_flex.setAttribute('class', 'inner-flex');
        
        const middle_flex = document.createElement('div');
        middle_flex.setAttribute('class', 'middle-flex');

        const price_text = document.createElement('h2');
        price_text.style = 'margin: 0rem;';

        const emailContainer = document.createElement('div');
        emailContainer.setAttribute('class', 'formContainer');
        emailContainer.setAttribute('id', `form${product._id}`);
        emailContainer.style="background-color: var(--main-bg-color-rgba); padding: 1rem; position: absolute; bottom: 0rem;";
        //emailContainer.style="width: 100%; background-color: var(--main-bg-color); padding: 10px; min-height: 50px;";

        const selectSizes = document.createElement('select');
        selectSizes.setAttribute('type', 'select');
        selectSizes.setAttribute('class', 'product-select');
        selectSizes.setAttribute('id', `${product._id}`);
        
        const sizes = product.sizes; 
        selectSizes.innerHTML = ""; 

        add.id = 'btn'+product._id;
        title.innerText = product.name;
        imgBg.style.backgroundColor = "#fdf8e5";
        
        imgBg.appendChild(imageLink);
        imageLink.appendChild(image); 
        div_card.appendChild(imgBg);
        div_card.appendChild(poster_flex);
        poster_flex.appendChild(link);
        link.appendChild(title);
        poster_flex.appendChild(middle_flex);
        inner_flex.appendChild(price_text);
        inner_flex.appendChild(selectSizes);
        middle_flex.appendChild(inner_flex);
        middle_flex.appendChild(add);
        imgBg.appendChild(emailContainer);
        
        posterGrid.appendChild(div_card);
        inner_flex.style.order = 1;
        add.style.order = 2;
        //inner_flex.classList.add('add-button');

        if (sizes && typeof sizes === 'object' && Object.keys(sizes).length > 0) {
            buildSelectSize(selectSizes, sizes, price_text, product.type, product.prices);
        }
        checkIfOut(selectSizes, selectSizes.options, price_text);
    });
    
    scrollToStoredPos();
    window.addEventListener('resize', moveChild);
    moveChild(); // Run once on page load
}
function checkAndGetSelectedSize(posterId){
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
async function sizeBackendCheck(productId, selectedSize, sizeQuantityToCheck){
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
        alert(`The last ${stockData.quantity-1} item${s} in stock of ${stockData.name} in size ${stockData.size} is in your cart`);
        return;
    }
    return stockData;
}
async function retrieveProductImage(productId, productType){
    try {
        console.log("id type: ",productId,productType);
        const response = await fetch(`/get-product/${productId}/${productType}`);
        const data = await response.json();
        const imagesArray = [data.image];
        console.log('images:: ',imagesArray);
         //,'/images/ImgReducedSize/grandma_reduced_size.jpg'
        return imagesArray;
    } 
    catch (error){
       console.error("Error retrieving images:", error); 
    }
}
async function addToCart(productId, foundItem, selectedSize, backendData, selectedIndex) {
    console.log(backendData);
    const imagesArray = await retrieveProductImage(productId, backendData.type);
    const price = backendData.prices[selectedIndex-1];
    if (foundItem) {
        foundItem.quantity++; // Increase quantity if already in cart
    } 
    else {
        let newItem = new CartItem(
            productId, 
            backendData.name,
            price, 
            selectedSize, 
            imagesArray,
            1,
            backendData.type,
        );
    shoppingCart.push(newItem);
    console.log('New item added: ', newItem);
    }

    // Save cart to local storage
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    console.log('Cart from storage:', localStorage.getItem("shoppingCart"));

} 
function calculatePrices(){
    let price = 0;
    shoppingCart.forEach(item=>{
        console.log('price: ',item.price,' quantity : ',item.quantity);
        price += item.price * item.quantity;
    })
    console.log(frontendPriceData.shippingPrices);
    let amount_shipping = price > frontendPriceData.freeShippingMin ? 0 : frontendPriceData.shippingPrices.domestic;
    amount_shipping = Math.round(amount_shipping);
    price = Math.round(price);
    document.getElementById('price').innerText = `Price: ${price} kr\u2003\u2003\u2003${price > 120 ? "free shipping!" : shoppingCart.length === 0 ?  " " : "shipping: 18kr"}`;
    document.getElementById('total-price').innerText = `Total price: ${price + amount_shipping} kr`;
}
async function checkStock(posterId,selectedSize,testQuantity) {
    const valueInStockResult = await valueInStock(testQuantity); 
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
        const buyingSizesAmount = shoppingCart.map(item => ({
            id: item.id,
            size: item.size,
            quantity: item.quantity
        }));
        console.log("sizes amount: ", buyingSizesAmount);
        const stock = await checkStockBeforeCheckout(buyingSizesAmount);
        console.log("stock: ", stock);
        if (!stock.success){ 
            return; }
        const pluralText= stock.lastItemsLenth > 1 ? 'them' : 'it';
        if (stock.lastItems){ 
            const text = 
    `Note that you have the last item of:
    ${stock.lastItems} 
    in your cart

    Somebody could buy ${pluralText} before you on the next page and the Stripe payment system will not know! 

    (Of course you'll get informed in that case and get a refund for the missing item)
    `
            alert(text);}
        const country = countrySelect.value;
        const currency = currencySelect.value;
        document.documentElement.setAttribute('lang', country);
        console.log('lang: ',document.documentElement.getAttribute('lang'));

        if (shoppingCart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        console.log({ cartItems: shoppingCart, country : country || "unknown", currency: currency});
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
    initializeCurrencySelect();
}

async function buildPortfolio() {
    fetch('/api/builds')
        .then(res => res.json())
        .then(data => {
            console.log("data dirs:",data);
            games = data;

            const container = document.getElementsByClassName('painting-grid-posters')[0];
            
            for (let i = games.length - 1; i >= 0; i--) {
                const gameName = games[i];
                
                const imgBg = document.createElement('div');
                imgBg.setAttribute('class', 'imgBg');
                imgBg.style.paddingTop = "1rem";
                
                const div_card = document.createElement('div');
                div_card.setAttribute('class', 'cart-item');
                div_card.setAttribute('data-game', gameName);
                div_card.setAttribute('align-self', 'start');

                const image = document.createElement('img');    
                image.setAttribute('class', 'game-thumbnail');

                const src = [
                    `/builds/${gameName}/hej.mp4`,
                    `/builds/${gameName}/thumbnail.gif`,
                    `/builds/${gameName}/thumbnail.png`,
                    `/builds/${gameName}/thumbnail.jpg`,
                    `/builds/${gameName}/gif.png`
                ];

                const tryNextSource = (sources, image, index = 0) => {
                    if (index >= sources.length) {
                        image.onerror = null;
                        return;
                    }

                    image.onerror = () => tryNextSource(sources, image, index + 1);
                    image.src = sources[index];
                };

                tryNextSource(src, image);

                image.addEventListener("mouseover", function () {
                    image.classList.add("hover-float");
                    const hoverSources = [
                        `/builds/${gameName}/hej.mp4`,
                        `/builds/${gameName}/thumbnail.gif`,
                        `/builds/${gameName}/thumbnail.jpg`,
                        `/builds/${gameName}/gif.png`,
                        `/builds/${gameName}/thumbnail.png`
                    ];
                    tryNextSource(hoverSources, image);
                });

                image.addEventListener("mouseout", function () {
                    image.classList.remove("hover-float");
                    tryNextSource(src, image); // Revert back to original order
                });

                const link = document.createElement('a');
                link.href = `/game?id=${gameName}`;

                const tagContainer = document.createElement('p');
                tagContainer.setAttribute('class','tag-container');
                tagContainer.classList.add('tag-container');
                tagContainer.style.hitgh = '3rem';
                
                const poster_flex = document.createElement('div');
                poster_flex.setAttribute('class', 'order-poster-flex');
                
                const title = document.createElement('h2');
                title.innerText = `${gameName}`;
                title.style.margin = 'auto';
                title.style.marginBottom = '.2rem';
                title.style.marginTop = '.2rem';
                title.style.color = "var(--light)";
                //title.style.textAlign = 'center';

                link.appendChild(image);
                imgBg.appendChild(link);
                poster_flex.appendChild(title);
                div_card.appendChild(imgBg);
                div_card.appendChild(tagContainer);
                div_card.appendChild(poster_flex);
                container.appendChild(div_card);
            }
            addTagsToGames(games);
        })
        .catch(err => {
            console.error("Failed to fetch builds:", err);
        });
}

async function addTagsToGames(games) {
    for (let i = games.length - 1; i >= 0; i--) {
        const gameName = games[i];
        const card = document.querySelector(`[data-game="${gameName}"]`);

        if (!card) continue;

        try {
            const res = await fetch(`/builds/${gameName}/Tags.json`);
            if (!res.ok) throw new Error("No tag file found");
            const tags = await res.json(); 
            console.log("tags, ",tags);

            tags.forEach(tag => {
                if (tag == tags[0] && tag == 'Unity'){
                    const image = document.createElement('img');  
                    image.setAttribute('class', 'engine-logo');
                    image.src = "/TemplateData/unity-logo-light.png";
                    card.children[1].appendChild(image);
                }
                else if (tag == tags[0]) {
                    const image = document.createElement('img');
                    image.setAttribute('class', 'engine-logo');   
                    image.src = "/TemplateData/UE-Icon-2023-Black.png";
                    card.children[1].appendChild(image);
                }
                const tagElement = document.createElement('span');
                //tagElement.classList.add('tag');
                if (tag == tags[1]){
                    const text = document.createElement('p');  
                    text.textContent = tag;
                    card.children[1].appendChild(text);
                    text.style.margin = 'auto';
                    text.style.marginLeft = '0rem';
                }
                else if (tag == tags[2] ){
                    const text = document.createElement('h4');  
                    text.textContent = tag;
                    card.children[1].appendChild(text);
                    text.style.textAlign = 'center';
                    text.style.margin = "0rem";
                }
                if (tags[2]==null){
                    console.log("game",gameName);
                    let link = null;
                    if (gameName == 'Gun Juggler'){
                        link = 'https://yrgo-game-creator.itch.io/gun-juggler';
                        console.log("yup");
                    }
                    else if (gameName == 'Epos'){
                        link = "https://yrgo-game-creator.itch.io/epos";
                        console.log("yup");
                    }
                    if (link){
                        card.children[0].children[0].href = link;
                    }
                }
            });

            //card.appendChild(tagContainer);
        } catch (err) {
            console.log(`No tags for ${gameName}:`, err.message);
        }
    }
}

// function buildPortfolio(){
//     if (!games){
//         games = 
//     }
//     for (let i = 0; i < games.length; i++) {
//         const imgBg = document.createElement('div');
//         imgBg.setAttribute('class', 'imgBg');
        
//         const div_card = document.createElement('div');
//         div_card.setAttribute('class', 'cart-item');
//         div_card.setAttribute('id', cartItem.id);
        
//         const image = document.createElement('img');
//         image.setAttribute('class', 'thumbnail');
//         image.src = `/game?id=${[i]}`;
        
//         const poster_flex = document.createElement('div');
//         poster_flex.setAttribute('class', 'order-poster-flex');
        
//         const title = document.createElement('h2');
//         title.innerText = `${product.name}`;
//         title.style.marginBottom = '.2rem';
//         title.style.color = "var(--light)";
//     }
// }

function addCartItems() {
    console.log("Adding updated list to cart:", shoppingCart);
    calculatePrices();
    const itemGrid = document.getElementsByClassName('shopping-cart')[0];
    itemGrid.innerHTML = "";  // Clear previous items to prevent duplication
    // document.getElementById('price').innerText = `Price: ${price} kr\u2003\u2003\u2003${price > 120 ? "free shipping!" : shoppingCart.length === 0 ?  " " : "shipping: 18kr"}`;
    // document.getElementById('total-price').innerText = `Total price: ${price + (price > 120 ? 0 : shoppingCart.length === 0 ?  " " : 18)} kr`;
    fetch('/get-all-products') 
    .then(response => response.json())
    .then(productData => {
        shoppingCart.forEach(cartItem => {
            const product = productData.find(product => product._id === cartItem.id);
            if (!product) {
                console.warn("Product not found for ID:", cartItem.id);
                return;
            }
            const imgBg = document.createElement('div');
            imgBg.setAttribute('class', 'imgBg');
            
            const div_card = document.createElement('div');
            div_card.setAttribute('class', 'cart-item');
            div_card.setAttribute('id', cartItem.id);
            
            const image = document.createElement('img');
            image.setAttribute('class', 'thumbnail');
            image.src = product.image;
            
            const poster_flex = document.createElement('div');
            poster_flex.setAttribute('class', 'order-poster-flex');
            
            const title = document.createElement('h2');
            title.innerText = `${product.name}`;
            title.style.marginBottom = '.2rem';
            title.style.color = "var(--light)";
            
            const quantityDiv = document.createElement("div");
            quantityDiv.className = "quantity";
            
            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.className = "input-box";
            quantityInput.value = cartItem.quantity;
            quantityInput.min = "1";
            quantityInput.max = "10";
            
            quantityInput.addEventListener("change", async (event) => {
                console.log("check..:",cartItem.id, cartItem.size, Number(event.target.value));
                const check = await sizeBackendCheck(cartItem.id, cartItem.size, Number(event.target.value));
                if (!check){
                    quantityInput.value = cartItem.quantity;
                    return;
                }
                // checkStock(cartItem.id,selectedSize,cartItem.quantity).then((valueInStock) => {
                    //     console.log('value in stock: ',valueInStock);
                    // if (!valueInStock) {return;}});
                cartItem.quantity = Number(event.target.value);
                localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
                calculatePrices();
            });
            
            const size = document.createElement('p');
            size.innerText = cartItem.size;
            size.style.margin = '0rem';
            size.style.fontFamily = '"Font Awesome 6 Free", sans-serif';
            //size.style.marginBottom = '1rem';
            
            const price = document.createElement('p');
            price.innerText = cartItem.price + 'kr';
            price.style.margin = "0rem";
            price.style.marginBottom = '1rem';
            price.style.fontFamily = '"Font Awesome 6 Free", sans-serif';

            
            const remove = document.createElement('button');
            remove.setAttribute('class', 'fa-minus remove-button');
            remove.setAttribute('onclick', `removeFromCart('${cartItem.id}', '${cartItem.size}')`);
            
            imgBg.appendChild(image);
            div_card.appendChild(imgBg);
            div_card.appendChild(title);
            div_card.appendChild(size);
            div_card.appendChild(price);
            div_card.appendChild(poster_flex);
            quantityDiv.appendChild(quantityInput);
            poster_flex.appendChild(quantityDiv);
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
    const productData = Object.fromEntries(urlParams.entries()); // Parse query parameters into an object
    const formContainer = document.getElementsByClassName('formContainer')[0];
    if (productData) {
        document.getElementById('product-img').src = productData.image;
        document.getElementById('product-title').textContent = productData.name;
        document.getElementById('product-desc').textContent = productData.desc + ' The image quality is reduzed, look at the homepage to see a more realistic quality of the print!';
        document.getElementsByClassName('add-button')[0].id = productData._id;
        document.getElementsByClassName('product-select')[0].id = productData._id;
        formContainer.id = 'form'+productData._id;
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
            buildSelectSize(selectSizes, sizes, document.getElementById('product-price'), selectedProduct.type, selectedProduct.prices);
        }
        else (console.log("error: no sizes or no object etc"));
    })
    .catch(error => console.error("Error fetching poster:", error));
}
function setOptionsAbled(options){
    for (const option of Object.entries(options)){
        option.disabled = "false";
    }
}
function buildSelectSize(selectObject, sizesKeysObject, priceTextObject, productType, productPrices){
    console.log("building: ",selectObject,sizesKeysObject,priceTextObject);
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
        const option = document.createElement('option');
        option.setAttribute('value', size);                                                                                                   
        if (quantity <= 0){
            option.setAttribute('data-disabled', true);
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
        
        if (selectedOption.getAttribute("data-disabled") === "true") {
            priceTextObject.textContent = "out";
            if (body.dataset.page === 'product'){ formContainer.style.display = 'flex'; }
            else {formContainer.style.display = 'block';}
            if (formContainer && formContainer.children.length === 0){
                createEmailInput(formContainer,selectObject);
                removeAddButton(document.getElementById('btn'+selectObject.id));
                return;
            }
        }
        else {
            priceTextObject.textContent = productPrices[selectObject.selectedIndex-1] + "kr"; // Default price
        }
        showAddButton(document.getElementById('btn'+selectObject.id));
        removeEmailInput(formContainer);
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
    emailContainer.style.display = 'none';
    const children = Array.from(emailContainer.children); 
    if (!children){return;}
    for (const child of children) { 
      child.remove();
    }
}
function createEmailInput(emailContainer, selectSizes){
    // Create label
    console.log("CREATING EMAIL");
    console.log(emailContainer, selectSizes);
    const label = document.createElement("label");
    label.setAttribute("for", "email");
    label.setAttribute("class", "email-label");
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

    emailContainer.appendChild(label);   
    emailContainer.appendChild(input);
    emailContainer.appendChild(confirmButton);
    emailContainer.appendChild(emailAlert);
    emailContainer.appendChild(addedToListAlert);
    if (body.dataset.page === 'product'){
        emailContainer.style.display = 'flex';
    }   
    else{emailContainer.style.display = 'block';
        console.log("block",emailContainer);
    }

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
function showSwish() {
    const swishDiv = document.getElementsByClassName('swish-div');
    for (let i = 0; i < swishDiv.length; i++) {
        swishDiv[i].style.display = 'block';
        console.log(swishDiv[i]);
        console.log(swishDiv[i].style.display);
    }
}
// ---- validation ----
const nameAlert = document.getElementById("nameAlert");
const emailAlert = document.getElementById("emailAlert");
const phoneAlert = document.getElementById("phoneAlert");
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
 async function checkStockBeforeCheckout(buyingSizesAmount) {
    console.log('sizes check:',buyingSizesAmount);
        const response = await fetch("/check-stock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ buyingSizesAmount })
        });
    
        const result = await response.json();
        console.log("stock response:: ",result);
        if (!result.success) {
            console.log("stock: ", false);
            alert(result.message);
            return false;
        }
        
        return {success: true, lastItemsLenth: result.lastItemsLenth, lastItems: result.lastItems || null, message: result.message}; 
 }