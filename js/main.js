const firebaseConfig = {
  apiKey: "AIzaSyBLrhwxhwGaacpUyb3ObJmfobNuYFbWjd8",
  authDomain: "studio5ive-5bf17.firebaseapp.com",
  databaseURL: "https://studio5ive-5bf17-default-rtdb.firebaseio.com",
  projectId: "studio5ive-5bf17",
  storageBucket: "studio5ive-5bf17.appspot.com",
  messagingSenderId: "457593489662",
  appId: "1:457593489662:web:49d08f5a6fca59669d7daf",
  measurementId: "G-CBYDPWJC7R"
};

firebase.initializeApp(firebaseConfig);
var contactFormDB = firebase.database().ref('contactForm');
var serviceForm = firebase.database().ref('serviceForm');

document.getElementById('contactForm').addEventListener('submit', submitForm);
document.getElementById('serviceForm').addEventListener('submit', submitService);

function submitForm(e){
    e.preventDefault();
    var name = getElementVal('name');
    var email = getElementVal('email');
    var message = getElementVal('message');

    saveMessage(name, email, message);
    document.querySelector('.alert').style.display = 'block';
    setTimeout(()=>{
        document.querySelector('.alert').style.display = 'none';  
    }, 3000);
    document.getElementById("contactForm").reset();
}

const saveMessage = (name, email, message) => {
    var newContacForm = contactFormDB.push();
    newContacForm.set({
        name: name,
        email:email,
        message:message
    })
};

function submitService(e){
    e.preventDefault();
    var name = getElementVal('sName');
    var email = getElementVal('sEmail');
    var phone = getElementVal('sPhone');
    var company = getElementVal('sCompany');
    var message = getElementVal('sMessage');
    var time = Date.now();

    saveService(name, email, phone, company, message, time);
    document.querySelector('.sAlert').style.display = 'block';
    setTimeout(()=>{
        document.querySelector('.sAlert').style.display = 'none';  
        document.querySelector('.dialog-request').style.display = 'none';  
    }, 2000);
    document.getElementById("serviceForm").reset();
}

const saveService = (name, email, phone, company, message, time) => {
    var newContacForm = serviceForm.push();
    newContacForm.set({
        name: name,
        email:email,
        phone: phone,
        company:company,
        message:message,
        time:time
    })
};

const getElementVal = (id) => {
    return document.getElementById(id).value;
}


// Scroll Animation
window.addEventListener("scroll", function() {
    var header = document.querySelector(".header");
    var headerContainers = document.querySelectorAll(".dropdown__container");
    header.classList.toggle("sticky", window.scrollY > 0);

    headerContainers.forEach(function(headerContainer) {
        headerContainer.classList.toggle("sticky", window.scrollY > 0);
    });
    
});

const faders = document.querySelectorAll(".fade-in");
const sliders = document.querySelectorAll(".slide-in");



const appearOptions = {
    rootMargin: "0px 0px -250px 0px",
    threshold: 0,
};

const appearOnScroll = new IntersectionObserver(
    function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    },
    appearOptions
);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
}); 

sliders.forEach(slider => {
    appearOnScroll.observe(slider);
});

window.addEventListener('scroll', reveal);
        function reveal(){
        var reveals = document.querySelectorAll('.reveal');
        for(var i = 0; i < reveals.length; i++){
            var windowheight = window.innerHeight;
            var revealtop = reveals[i].getBoundingClientRect().top;
            var revealpoint = 150;

        if(revealtop < windowheight - revealpoint){
            reveals[i].classList.add('active');
        } else {
            reveals[i].classList.remove('active');
        }
    }
}

// COOKIE
function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + ";" + expires + "; path=/";
}

getCookie = (cName)  => {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split("; ");
    let value;
    cArr.forEach(val => {
        if(val.indexOf(name) === 0) value = val.substring(name.length);
    })

    return value;
}

document.querySelector('.cookie-btn').addEventListener("click", () => {
    document.querySelector('.cookie').style.display = "none";
    setCookie("cookie", true, 30);
});

cookieMessage = () => {
    if(!getCookie("cookie"))
      document.querySelector(".cookie").style.display = "block";  
}


// logo
window.addEventListener("load", cookieMessage);

 function detectDeviceMode() {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isDarkMode ? 'dark' : 'light';        
}
function updateFavicon() {
    const mode = detectDeviceMode();
    const favicon = document.getElementById('favicon');
                
    if (mode === 'dark') {
        favicon.href = 'images/5logo_white.png'; 
    } else {
        favicon.href = 'images/5logo_black.png'; 
    }
}
updateFavicon();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);




/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId)
 
    toggle.addEventListener('click', () =>{
        nav.classList.toggle('show-menu')
        toggle.classList.toggle('show-icon')
    })
 }
 
 showMenu('nav-toggle','nav-menu')
 
 /*=============== SHOW DROPDOWN MENU ===============*/
 const dropdownItems = document.querySelectorAll('.dropdown__item')
  dropdownItems.forEach((item) =>{
     const dropdownButton = item.querySelector('.dropdown__button') 
      dropdownButton.addEventListener('click', () =>{
         const showDropdown = document.querySelector('.show-dropdown')
         toggleItem(item)
         if(showDropdown && showDropdown!== item){
             toggleItem(showDropdown)
         }
     })
 })
 
 const toggleItem = (item) =>{
     const dropdownContainer = item.querySelector('.dropdown__container')
     if(item.classList.contains('show-dropdown')){
         dropdownContainer.removeAttribute('style')
         item.classList.remove('show-dropdown')
     } else{
         dropdownContainer.style.height = dropdownContainer.scrollHeight + 'px'
         item.classList.add('show-dropdown')
     }
 }
 
 /*=============== DELETE DROPDOWN STYLES ===============*/
 const mediaQuery = matchMedia('(min-width: 1118px)'),
       dropdownContainer = document.querySelectorAll('.dropdown__container')
 
 const removeStyle = () =>{
     if(mediaQuery.matches){
         dropdownContainer.forEach((e) =>{
             e.removeAttribute('style')
         })
         dropdownItems.forEach((e) =>{
             e.classList.remove('show-dropdown')
         })
     }
 }
 
 addEventListener('resize', removeStyle)
 
 
 
 