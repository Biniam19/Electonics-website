const showStatus = (function (){
        const statusPopup = document.getElementById("statusPopup");
        const displayAlert = document.querySelector(".displayAlert");
        const statusMessage = displayAlert.querySelector("span");
        let timeout;

        function reset(){
            statusPopup.classList.remove("success", "error");
            statusMessage.innerHTML = "";
        }

        return function (message, type){
            clearTimeout(timeout);
            reset();
            
            if (type === "success" || type === "error") {
                statusPopup.classList.add(type);
                statusMessage.innerHTML = message;
            } else {
                console.warn(`Unknown status type: ${type}`);
            }

            timeout = setTimeout(() => {
                reset();
            }, 5000)
        };

    })();

   
  window.onLoadCallback = function() {
    const SITEKEY = '6Lcube0rAAAAAJ21bIb0PHbWJwz4MnRJ7XR34_7i';
    try{
        const faqCaptcha = grecaptcha.render("faqCaptcha", { sitekey: SITEKEY });
        const reportCaptcha = grecaptcha.render("reportCaptcha", { sitekey: SITEKEY });
        const subscribeCaptcha = grecaptcha.render("subscribeCaptcha", { sitekey : SITEKEY, theme: "dark" });
        const contactCaptcha = grecaptcha.render("commentCaptcha", { sitekey: SITEKEY, theme: "dark" });
        window.allCaptcha = {faqForm : faqCaptcha, reportForm : reportCaptcha, subscribeForm : subscribeCaptcha, commentForm : contactCaptcha};
    } catch(e){
        console.log(e);
    }
    };


    (function (){

        const url = "https://script.google.com/macros/s/AKfycbwn9u5rDv49hE_9SPdU5V8FxqkuBxSR0OW6juIs48VfVi9veAIRLpTbigGkTPNyfmKUKg/exec";

        const buttonName = {
            faqForm : '.faqBtn',
            reportForm : '.repairBtn',
            subscribeForm : '.subscribeBtn',
            commentForm : '.commentBtn',
        }

        const currentForm = {id : null, current: false};

        ["faqForm", "reportForm", "subscribeForm", "commentForm"].forEach(formId => {
                document.getElementById(formId).addEventListener("submit", e => prepareSubmit(e, formId, "POST"));
        });

       
        function startLoading(formId){
            console.log('started log ' + buttonName[formId]);
            document.querySelectorAll(buttonName[formId]).forEach( btn => {
                btn.classList.add('loading');
                btn.disabled = true;
            })
            
            currentForm.current = true;
            currentForm.id = formId;
        }

        function stopLoading(resetForm = false, clear = false){
            console.log('stoped load');
            if(currentForm.current === true){
                document.querySelectorAll(buttonName[currentForm.id]).forEach( btn => {
                    btn.classList.remove('loading');
                    btn.disabled = false;
                });
                
                grecaptcha.reset(allCaptcha[currentForm.id]);

                if(resetForm)  document.getElementById(currentForm.id).reset();
                    

            } else{
                console.warn("Loading is not yet diplayed");
            }
            
            if(clear) currentForm.current = false;
             
            
        }


        function prepareSubmit(event,mode, method, afterSent){
            event.preventDefault();
            const captchaResponse = grecaptcha.getResponse(allCaptcha[mode]);
            
            if(!captchaResponse){
                showStatus("Please verify you are not a robot", "error");
                return
            }

            const formElement = event.currentTarget;
           
            formElement.querySelectorAll("input, textarea").forEach(field => {
                field.value = stripTags(field.value).trim();
            });    
           
            const formData = new FormData(formElement);
            formData.append("mode", mode);
            formData.append("captchaToken", captchaResponse);
            console.log(allCaptcha[mode]);
            console.log(formData.get("email"));
            const request = new Request(url, {
                method: method,
                body: formData
            })

            httpRequest(request, () =>  startLoading(mode) , afterDataFetch, () => stopLoading(false), () => stopLoading(true, true));
            
            //close pop up form after submit button clicked
            const escEvent = new MouseEvent('click');
            document.querySelector(".hide-popup").dispatchEvent(escEvent);

    }

        function stripTags(input) {
            const temp = document.createElement('div');
            temp.innerHTML = input;
            return temp.textContent || temp.innerText || '';
        }

        function afterDataFetch(data){
            let dt = data;
            if(dt.status == "success"){
                showStatus(dt.message, dt.status);
                stopLoading(true);
            }    
            else{
                showStatus(dt.message, dt.status);
                stopLoading(false);
                console.log(dt.message);
            }
        }

        

         async function httpRequest(req, beforeFetch = () => {}, afterFetch = () => {}, catchHandler = ()=>{}, finalHandler = ()=>{}){
            try{
                
                beforeFetch();
                const response = await fetch(req);
                if(!response.ok) throw new Error("Request not Succesful, please try again");
                if(!response.headers.get("content-type").includes("json")) throw new Error("Inavlid data recieved");

                const data = await response.json();
                afterFetch(data);

            } catch(err){
                
                showStatus("Some erorrr has occured x: " + err, "error " + err.stack);
                catchHandler();
                console.log(err);
            } finally{
                finalHandler();
            }

        }



        // Fetching faq questions from server

        
        document.addEventListener('DOMContentLoaded', () => {
            const mode = 'faqFetch';
            const getUrl = `${url}?mode=${mode}`;

            

            httpRequest(getUrl, faqLoader, afterFaqFetch, () => {}, () => { faqLoader(true)});
            
        });

        function afterFaqFetch(data){
                const dt = data;
                const accordion = document.querySelector('.accordion');
                
                if( dt.status === 'success'){
                    if( dt.resultData && dt.resultData.length > 0){
                        dt.resultData.forEach( item => {
                        let ele = buildAccordionHtml(item.Question, item.Solution)    
                        accordion.appendChild(ele);
                    })
                    }
                } else if( dt.status === 'error'){
                    console.error(dt.message);
                }
            }

        function faqLoader(stop = false){
            const loader = document.querySelector('.faq-loaders');
            if(!stop){
                loader.style.visibility = 'visible';
            } else{
                loader.style.visibility = 'hidden';
            }
        }

        
        function buildAccordionHtml(title, message){
            const accordionItem = document.createElement('div');
            const accordionButton = document.createElement('button');
            const spanLabel = document.createElement('span');
            const spanStatus = document.createElement('span');
            const accordionContent = document.createElement('div');
            const accordionPara = document.createElement('p');

            accordionItem.classList.add('accordion-items');
            accordionButton.classList.add('accordion-title');
            spanStatus.classList.add('status');
            accordionContent.classList.add('accordion-content');
            
            accordionItem.append(accordionButton, accordionContent);
            
            
            accordionButton.append(spanLabel, spanStatus);
            
            accordionContent.append(accordionPara);

            spanLabel.textContent = title;
            accordionPara.textContent = message;

            return accordionItem;
        }
        
})();
