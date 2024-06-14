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
  var serviceForm = firebase.database().ref('serviceForm');
  
  document.getElementById('serviceForm').addEventListener('submit', submitService);
  
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
  
document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', function(event) {
        const contactPhone = box.querySelector('.contact-phone');
        if (contactPhone) {
            const phoneNumber = contactPhone.textContent.trim();
            
            if (box.classList.contains('phone')) {
                box.href = `tel:${phoneNumber}`;
            } else if (box.classList.contains('whatsapp')) {
                box.href = `https://wa.me/${phoneNumber}`;
                console.log(phoneNumber);
            } 

            event.preventDefault();
            window.location.href = box.href;
        }
    });
});

    window.addEventListener("scroll", function() {
        var header = document.querySelector("nav");
        header.classList.toggle("sticky", window.scrollY > 0);
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

    function fillInput(text) {
        document.getElementById("sMessage").value = text;
    }