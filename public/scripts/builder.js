import {checkAndGetSelectedSize, sizeBackendCheck, addToCart, checkIfOut, calculatePrices, shoppingCart, validateEmail} from './mainScript.js';

export async function buildPosterCards(data, posterGrid){
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
        console.log("build posters");

        const imageLink = document.createElement('a');
        //imageLink.setAttribute('onclick', `storePageScrollData('${product.type}');`); 
        const singularPages = ['jewellery'];
        // const s = singularPages.includes(product.type) ? '' : 's';
        // imageLink.setAttribute('onclick', `storePageScrollData('${product.type+s}')`);
        imageLink.href = `/posters/${product._id}`;

        const link = document.createElement('a');
        //link.setAttribute('onclick', `storePageScrollData('${product.type+s}')`);
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
            const foundCartItem = shoppingCart.find(item => item._id === product._id && item.size === selectedSize);
            //console.log("build cards event ",item._id, product._id, item.size, selectedSize);
            const sizeQuantityToCheck = foundCartItem ? Number(foundCartItem.quantity) + 1 : 1;
            const backendData = await sizeBackendCheck(product._id, selectedSize, sizeQuantityToCheck);
            if (!backendData.success) return;

            addToCart(foundCartItem, selectedSize, backendData, selectSizes.selectedIndex);
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
            buildSelectSize(selectSizes, sizes, price_text, product.prices);
        }
        checkIfOut(selectSizes, selectSizes.options, price_text);
    });
    //scrollToStoredPos();
    window.addEventListener('resize', moveChild);
    moveChild(); // Run once on page load
}

export function buildSelectSize(selectObject, sizesKeysObject, priceTextObject, productPrices){
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
            if (document.body.dataset.page === 'product'){ formContainer.style.display = 'flex'; }
            else {formContainer.style.display = 'block';}
            if (formContainer && formContainer.children.length === 0){
                createEmailInput(formContainer, selectObject, selectObject.id, sizesKeys[sizesIndex]);
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

export function buildCheckout(){                                                             
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

    const country = countrySelect.value;
    const currency = currencySelect.value;
    //document.documentElement.setAttribute('lang', country);
    //console.log('lang: ',document.documentElement.getAttribute('lang'));
    initializeCurrencySelect();
    return {country: country, currency: currency};
}

export async function buildHomeInteraction() {
    const children = document.getElementsByClassName('painting-child');
    for (const child of children) {
        const img = child.querySelector('img'); // finds first <img> anywhere inside
        if (img) {
            img.addEventListener("mouseover", () => img.classList.add("hover-float"));
            img.addEventListener("mouseout", () => img.classList.remove("hover-float"));
        }
    }
}

export async function buildCheckoutCart(productData, shoppingCart, itemGrid){
    shoppingCart.forEach(cartItem => {
        const product = productData.find(product => product._id === cartItem._id);
        if (!product) {
            console.warn("Product not found for ID:", cartItem._id);
            return;
        }
        const imgBg = document.createElement('div');
        imgBg.setAttribute('class', 'imgBg');
        
        const div_card = document.createElement('div');
        div_card.setAttribute('class', 'cart-item');
        div_card.setAttribute('id', cartItem._id);
        
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
            if (parseInt(event.target.value) === 0 ){ event.target.value = 1; }
            const check = await sizeBackendCheck(cartItem._id, cartItem.size, parseInt(event.target.value));
            if (!check.success){
                quantityInput.value = parseInt(check.availableStock);
                if (parseInt(check.availableStock) === 0 ) {  event.target.value = 1; }
            }
            cartItem.quantity = parseInt(event.target.value);
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
        remove.addEventListener("click", () => {
            removeFromCart(cartItem._id, cartItem.size);
        })

        //remove.setAttribute('onclick', `removeFromCart('${cartItem._id}', '${cartItem.size}')`);
        
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
}

async function createEmailInput(emailContainer, selectSizes, productId, size){
    const label = document.createElement("label");
    label.setAttribute("for", "email");
    label.setAttribute("class", "email-label");
    label.textContent = "Email me when back in stock:";
    label.style.marginLeft = "auto";

    const emailAlert = document.createElement("span");
    emailAlert.setAttribute("id", "emailAlert");
    emailAlert.textContent = "Email is unvalid";
    emailAlert.style.marginLeft = "auto";

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

    const pParent = document.createElement('div');
    const addedToListAlert = document.createElement("p");
    addedToListAlert.setAttribute("id", "addedToListAlert");
    addedToListAlert.style.marginLeft = "auto";

    emailContainer.appendChild(label);   
    emailContainer.appendChild(input);
    emailContainer.appendChild(confirmButton);
    emailContainer.appendChild(emailAlert);
    emailContainer.appendChild(pParent);
    pParent.appendChild(addedToListAlert);
    if (document.body.dataset.page === 'product'){
        emailContainer.style.display = 'flex';
    }   
    else{ emailContainer.style.display = 'block';   }

    confirmButton.addEventListener("click", () => {
        console.log("Email confirmed:", input.value);
        if (validateEmail(input.value, emailAlert)){
            addedToListAlert.textContent = `I'll send a mail to ${input.value} when back in stock!`;
            addedToListAlert.style.display = 'block';
            console.log("send:: ", input.value, productId, size);
            addMailToList(input.value, productId, size);
            // skicka produkt, strl, email
            //hitta produkten o lägg till mail under, om inte, skapa produkten o lägg till produkten under
        }
    });

    input.addEventListener("input", (event) => {
        //validateEmail(input.value, emailAlert);
        addedToListAlert.style.display = 'none';
        emailAlert.style.display = 'none';
    });
}

//-------- CART LOGIC ---------//

export function removeFromCart(posterId, size) {
    let idCartItems = Array.from(document.getElementsByClassName('cart-item'));
    let filteredList = idCartItems.filter(item => item.id === posterId);
    
    if (filteredList.length > 0) {
        filteredList.forEach(item => {
            for (const child of item.children) {
                if (child.innerHTML === size) {
                    item.remove();
                    return;
                }
            }
        });
    }
    const removeCartItem = shoppingCart.find(item => item._id === posterId && item.size === size);
    if (removeCartItem){
        shoppingCart.splice(shoppingCart.indexOf(removeCartItem), 1);
    }
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    calculatePrices();
}

export function clearCart() {
    Array.from(document.getElementsByClassName('cart-item')).forEach(item => item.remove());
    shoppingCart.splice(0,shoppingCart.length);
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    if(document.body.dataset.page === 'success'){return;}
    calculatePrices(); 
}

//------SMALLER BUILD RELATED------//

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

async function addMailToList(mail, productId, size){
    console.log("fetching mail stuff");
    const stockResponse = await fetch('/add-mail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
                mail: mail,
                idCopy: productId.toString(),
                size: size    
            })
        });
}

function removeEmailInput(emailContainer) {
    emailContainer.style.display = 'none';
    const children = Array.from(emailContainer.children); 
    if (!children){return;}
    for (const child of children) { 
      child.remove();
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

function removeAddButton(addButton){
    if (!addButton){
        document.getElementsByClassName("add-button")[0].style.display = 'none';
    }
    else {
        addButton.style.display = 'none';
    }
}

function storePageScrollData(goBackToPage) {
    console.log("go back to: ",goBackToPage);
    localStorage.setItem("scrollPosition", window.scrollY);
    localStorage.setItem("goBackToPage", goBackToPage);
}

function scrollToStoredPos(){
    const savedScrollPosition = localStorage.getItem("scrollPosition");
    if (savedScrollPosition !== null) {  window.scrollTo(0, Number(savedScrollPosition));} // Ensure it's a number  
}

//---   overlay  

export function addOverlayResponse(){
    var openNav = document.getElementById('open-nav');
    var closeBtn = document.getElementsByClassName('close-button')[0];

    openNav.addEventListener("click", (event) => {
        displayOverlay();
    })

    closeBtn.addEventListener("click", (event) =>{
        hideOverlay();
    })
}

//--- nightmode

export function nightMode(switchMode){
    const body = document.body;
    let nightmodeVar = JSON.parse(localStorage.getItem("nightmode")) ?? false;
    const suns = Array.from(document.getElementsByClassName("sun"));
    const moons = Array.from(document.getElementsByClassName("moon"));

    const btns = document.querySelectorAll('#changeColorBtn');
    btns.forEach(b => b.addEventListener('click', nightmodeSwitch));

    if (switchMode) {
        nightmodeSwitch();
    }
    else {
        setNightMode();
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
}

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

//--------------- PORTFOLIO ------------------//

export async function buildPortfolio(data){
    fetch('/api/builds')
        .then(res => res.json())
        .then(data => {
            let games = data;
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
                        `/builds/${gameName}/thumbnail.png`
                        `/builds/${gameName}/thumbnail.jpg`,
                        `/builds/${gameName}/thumbnail.gif`,
                        `/builds/${gameName}/gif.png`,
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
                title.setAttribute('class','game-title');
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

async function addTagsToGames(games){
    for (let i = games.length - 1; i >= 0; i--) {
        const gameName = games[i];
        const card = document.querySelector(`[data-game="${gameName}"]`);

        if (!card) continue;

        try {
            const res = await fetch(`/builds/${gameName}/Tags.json`);
            if (!res.ok) throw new Error("No tag file found");
            const tags = await res.json(); 

            tags.forEach(tag => {
                if (tag === tags[0] && tag === 'Unity'){
                    const image = document.createElement('img');  
                    image.setAttribute('class', 'engine-logo');
                    image.src = "/TemplateData/unity-logo-light.png";
                    card.children[1].appendChild(image);
                }
                else if (tag === tags[0]) {
                    const image = document.createElement('img');
                    image.setAttribute('class', 'engine-logo');   
                    image.src = "/TemplateData/UE-Icon-2023-Black.png";
                    card.children[1].appendChild(image);
                }
                const tagElement = document.createElement('span');
                //tagElement.classList.add('tag');
                if (tag === tags[1]){
                    const text = document.createElement('p');  
                    text.textContent = tag;
                    card.children[1].appendChild(text);
                    text.style.margin = 'auto';
                    text.style.marginLeft = '0rem';
                    text.style.alignSelf= 'stretch';
                }
                else if (tag === tags[2] ){
                    const text = document.createElement('h4');  
                    text.textContent = tag;
                    card.children[1].appendChild(text);
                    text.style.textAlign = 'center';
                    text.style.margin = "0rem";
                }
                if (tags[2]==null){
                    let link = null;
                    if (gameName === 'Gun Juggler'){
                        link = 'https://yrgo-game-creator.itch.io/gun-juggler';
                    }
                    else if (gameName === 'Epos'){
                        link = "https://yrgo-game-creator.itch.io/epos";
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
    