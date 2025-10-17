//function for showing and hiding pop up forms

(function (){
    let hidePopup = document.querySelector(".hide-popup")
    let repairBtn = document.querySelectorAll(".repairBtn");
    let faqBtn = document.querySelector(".faqBtn");
    let popupCon = document.querySelector(".popup-con");
    let popupFaq = document.querySelector(".popup-faq");
    let popupReport = document.querySelector(".popup-report");
    const POPUPCLASSES = ['display-faq', 'display-report'];

    repairBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            popupCon.classList.add("display-report");
            keepOne(popupFaq);
        })
    });

    faqBtn.addEventListener("click", () => {
        popupCon.classList.add("display-faq");
        keepOne(popupReport);
    })

    hidePopup.addEventListener("click", () => {
        removeClass(POPUPCLASSES);
    })

    popupCon.addEventListener("click", (e) => {
        if(!( popupFaq.contains(e.target) ||  popupReport.contains(e.target) )){
            removeClass(POPUPCLASSES);
        }
    })

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            removeClass(POPUPCLASSES);
        }
    });

    function removeClass(cl){
        popupCon.classList.remove(...cl);
        keepOne("", false);
    }

    function keepOne(popform, b = true){
        if(b) popform.style.display = "none";
        else{
            popupFaq.style.display = "block";
            popupReport.style.display = "block";
        } 
        
    }
})();


// anynmous function for navigation buttons

(function (){
    const homeButton = document.querySelector(".home-button");
    const introButton = document.querySelectorAll(".intro-button");
    const logo = document.querySelector('.logo');
    const blogPost = document.querySelectorAll('.blog-post');
    const postLink = ['Blog-post/blog_v1.html', 'Blog-post/blog_v2.html', 'Blog-post/blog_v3.html']
    
    blogPost.forEach( (blog, index) => {
        blog.addEventListener('click', () => {
            window.location.assign(postLink[index]);
        })
    });

    homeButton.addEventListener("click", () => {
        scrollIntoSection("about-us");
    });

    logo.addEventListener("click", () => {
        scrollIntoSection("hero-page");
    });

    introButton.forEach( ele => {
        ele.addEventListener("click", () => {
        scrollIntoSection("contact");
    })
});

function scrollIntoSection(id){
    let ele = document.getElementById(id);
    if(ele){
        ele.scrollIntoView({behavior : "smooth"});
        history.pushState(null, null, `#${id}`);
    }
}
})();



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

        menuToggle.addEventListener("click", toggleMobileMenu)
        

        function toggleMobileMenu()  {
            
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
        }

        navCon.querySelectorAll(".menu-items").forEach( item => {
            let dropdown = item.querySelector(".dropdown-menu");
            
            if(dropdown){
                item.addEventListener("click", (e) => {
                    e.preventDefault();
                    item.classList.toggle("active");
                })
            } else{
                item.addEventListener("click", () => {
                    if(window.matchMedia("(max-width: 930px)").matches)
                       toggleMobileMenu();
                })
            }

            item.querySelectorAll(".dropdown-menu a").forEach(link => {
                link.addEventListener("click", e => {
                    e.stopPropagation();
                    if(window.matchMedia("(max-width: 930px)").matches)
                        toggleMobileMenu();
                }); // allow normal navigation
            });
        });

        return function(){
            return dr;
        }

   })();

  
/*
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
*/
   (function () {
    const accordionCon = document.querySelector(".accordion");
    let opened = null;

    // Event delegation — works for dynamically added items too
    accordionCon.addEventListener("click", (e) => {
        const titleBtn = e.target.closest(".accordion-title");
        if (!titleBtn) return; // Clicked outside any accordion title

        const item = titleBtn.closest(".accordion-items");
        const allItems = accordionCon.querySelectorAll(".accordion-items");

        // Remove "active" from all others
        allItems.forEach((ele, i) => {
            if (ele !== item) ele.classList.remove("active");
        });

        // Toggle the current one
        item.classList.toggle("active");
    });
})();


AOS.init({
    duration: 1000, // animation duration
    once: true      // animate only once
  });   
