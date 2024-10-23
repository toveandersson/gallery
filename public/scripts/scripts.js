
const button = document.getElementById('changeColorBtn');

document.body.classList.add('lightmode'); // Add the default lightmode class on load

const sun= document.getElementById("sun");
sun.style.display = "none";
const moon= document.getElementById("moon");
moon.style.display = "block";
const sun2= document.getElementById("sun-m");
sun2.style.display = "none";
const moon2= document.getElementById("moon-m");
moon2.style.display = "block";

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

function nightmode() {
    const body = document.body;
    if (body.classList.contains('lightmode')) {
        body.classList.remove('lightmode');
        body.classList.add('nightmode');
        moon.style.display = "none";
        sun.style.display = "block";
        moon2.style.display = "none";
        sun2.style.display = "block";
    } else {
        body.classList.remove('nightmode');
        body.classList.add('lightmode');
        sun.style.display = "none";
        moon.style.display = "block";
        sun2.style.display = "none";
        moon2.style.display = "block";
    }
};


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