const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    duration: 500,
    autoplay: {
      delay: 3000,             // 3 seconds between slides
      disableOnInteraction: false, // keep autoplay even if user clicks/swipes
    },
    loop: true,
    navigation: {
      nextEl: ".swiper-next",
      prevEl: ".swiper-previous",
    },
  });

  
 const fixedNav = (function(){
        let header = document.querySelector("header.page-header");
        return function (){
        if(isDisplay()) return;
        
        if(window.pageYOffset > 30){
            header.classList.add("active");
        } else{
            header.classList.remove("active");
        }
    }

    })();

const backToTop = (function(){
        let backTop = document.getElementById("backTop");
        return function (){
        if(window.scrollY > 200){
            backTop.classList.add("active");
        }else{
            backTop.classList.remove("active");
        }
    }
    }
)();

  
    window.addEventListener("scroll", () => {
        fixedNav();
        backToTop();
    });

    
    
    document.getElementById("backTop").addEventListener("click", () => {
         window.scrollTo({ top: 0, behavior: "smooth" });
    });



    
    

let isDisplay =  (function (){
        let navCon = document.querySelector(".nav-con");
        let menuToggle = document.querySelector(".menu-toggle");
        let header = document.querySelector(".page-header");
        let dr = false;
        menuToggle.addEventListener("click", () => {
            
            if(navCon.classList.contains("active")){
                navCon.classList.remove("active");
                menuToggle.innerHTML = ' <i class="fas fa-bars"></i>';
                dr = false;
                if(window.pageYOffset < 30){
                    header.classList.remove("active");
                }
            } else{
                navCon.classList.add("active");
                header.classList.add("active");
                menuToggle.innerHTML = '<i class="fas fa-times"></i>'
                dr = true;
            }
        })

        navCon.querySelectorAll(".menu-items").forEach( item => {
            let dropdown = item.querySelector(".dropdown-menu");
            
            if(dropdown){
                item.addEventListener("click", () => {
                    item.classList.toggle("active")
                })
            }
        });

        return function(){
            return dr;
        }

   })();

  

   (function (){
    let accordionCon = document.querySelectorAll(".accordion");
    let accordionItems = Array.from(accordionCon).map(ele => {
        return ele.querySelectorAll(".accordion-items");
    });
    
    let opened = null;

    accordionItems.forEach(item => {
        item.forEach( (ele, i) => {
            ele.addEventListener("click", (e) => {
                
                if(e.target.closest(".accordion-title")){
                    item.forEach( ele => {
                        if(!(opened === i)){
                        ele.classList.remove("active");
                        }
                    });
                    opened === i ? ele.classList.toggle("active") :
                    ele.classList.add("active");
                    opened = i;
                }
            })
        });    
        
    });
   
   })();

AOS.init({
    duration: 1000, // animation duration
    once: true      // animate only once
  });   
