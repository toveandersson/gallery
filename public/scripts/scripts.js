const night = false;

function on() {
    // display overlay
    const turnOn = document.getElementById("overlay");
    turnOn.style.display = "block";
    //turn off vertical scroll
    const overflow = document.querySelector("body");
    overflow.style.overflow = "hidden";
}

function off() {
    // display overlay
    const turnOff = document.getElementById("overlay");
    turnOff.style.display = "none";
    //turn off vertical scroll
    const overflow = document.querySelector("body");
    overflow.style.overflow = ""; //do nothing
}

const button = document.getElementById('changeColorBtn');

document.body.classList.add('lightmode'); // Add the default lightmode class on load

button.addEventListener('click', () => {
    const body = document.body;

    // Toggle between lightmode and nightmode classes
    if (body.classList.contains('lightmode')) {
        body.classList.remove('lightmode');
        body.classList.add('nightmode');
    } else {
        body.classList.remove('nightmode');
        body.classList.add('lightmode');
    }
});


// let elem = document.querySelector('i');
// let start;

// function debug(timestamp) {
//   if (start === undefined)
//     start = timestamp;
//   const elapsed = timestamp - start;
//   let rect = elem.getBoundingClientRect();
//   document.body.insertAdjacentHTML("beforeBegin",'<d style="top:'+(rect.y + rect.height/2)+'px;left:'+(rect.x + rect.width/2)+'px;"></d>')

//   if (elapsed < 20000) { 
//     window.requestAnimationFrame(debug);
//   }
// }

// document.querySelector("button").addEventListener("click",function() {
//   elem.classList.add("start");
//   window.requestAnimationFrame(debug);
// })