gsap.registerPlugin(ScrollToPlugin);

const pinNav = (controller) => {
   
   // Stick nav after header, parameter takes scrollmagic controller
   const pinTrigger = document.querySelector(".sec-aboutme");
   const scene = new ScrollMagic.Scene({
         offset: -60,
         triggerElement: pinTrigger,
         triggerHook: 0
      })
      .on('start', event => {
         const pinElement = document.querySelector("nav");
         if(event.scrollDirection === "FORWARD") {
            pinElement.classList.add('u-sticky');
         } else {
            pinElement.classList.remove('u-sticky');
         }
      })
      // .setClassToggle("nav", "u-sticky")
      // .addIndicators({trigger: "start"})
      .addTo(controller);

      return {scene: scene, trigger: pinTrigger};
}

const scrollToSection = (controller, offset) => (event) => {
   /*  
      callback takes scrollmagic controller, and called when listened event is passed in. 
      There is also a offset for where the scroll should stop. scroll to position based 
      on href attribute from event. It will return null if rhe target does not exist.
   */
   const navTo = event.target.getAttribute('href');
   if(navTo === null) { return null; }
  
   controller.scrollTo(target => {
      TweenMax.to(
         window, 
         1, 
         { 
            scrollTo: {
               // 1 above is for 1 sec
               // offset of 60px
               y: target - offset,
               autoKill : true
            },
            ease: Cubic.easeOut
         }
      );
   });

   if(navTo.length > 0) {
      event.preventDefault();
      controller.scrollTo(navTo);

      // code to update URL to /navTo
      if(window.history && window.history.pushState) {
         history.pushState("", document.title, navTo);
      }
   }
}

const defineNavLink = (controller, navClassFrom, offset = 0) => {
   /*
      function to handle click navigation, takes scrollmagic controller and a 
      class from anchor or an ul. The default offset for where scroll should stop is 0.
   */
   const navFrom = document.querySelector(navClassFrom);
   const navChildren = navFrom.children;
   if(navChildren.length > 0) {
      [...navChildren].forEach(li => li.addEventListener("click", scrollToSection(controller , offset)));
   } else if(navChildren.length === 0) {
      navFrom.addEventListener("click", scrollToSection(controller, offset));
   } else {
      throw(Error("parameter not accepted."));
   }
   
}

const scrollAnimationSlide = (controller, trigger, offset = 0) => {
   /* 
      Create scroll animation based on class to be triggered,
      require a scrollmagic controller, and offset can be used to
      adjust starting point and fading point.
    */
   let animeTrigger = '';
   typeof trigger === 'string' ? 
   animeTrigger = document.querySelector(trigger) :
   animeTrigger = trigger;

   const scene = new ScrollMagic.Scene({
      triggerElement: animeTrigger,
      triggerHook: .95,
      offset: -offset
   })
   .setClassToggle(animeTrigger, "animation__SlideIn")
   // .addIndicators({trigger: "start"})
   .addTo(controller);

   return {scene: scene, trigger: animeTrigger}
}

const controlRespMenu = () => {
   const menu = document.querySelector(".main-nav");
   const menuBtn = document.querySelector(".main-nav__btn");
   const btnIconMenu = document.querySelector(".main-nav__icon--menu");
   const btnIconClose = document.querySelector(".main-nav__icon--close");

   menuBtn.addEventListener('click', () => {
      if(btnIconClose.classList.contains("u-hidden")) {
         // when Menu is clicked
         setTimeout(()=> {
            btnIconClose.classList.remove("u-hidden");
            btnIconMenu.classList.add("u-hidden");
         }, 500)
      } else if(btnIconMenu.classList.contains("u-hidden")) {
         // when Close is clicked
         setTimeout(()=> {
            btnIconMenu.classList.remove("u-hidden");
            btnIconClose.classList.add("u-hidden");
         }, 500)
      }
   });
}

const main = () => {
   let respSize = window.innerWidth;
   // holds the state for max window size for responsive container, used to update values for media queries.
   const scene = [];
   const controller = new ScrollMagic.Controller();
   scene.push(pinNav(controller));
   defineNavLink(controller, ".main-nav__list", 59);
   defineNavLink(controller, ".footer__link--scroll", 59);
   defineNavLink(controller, ".header__btn", 59);
   [...document.querySelectorAll('.h-secondary')].forEach(heading => scrollAnimationSlide(controller, heading));
   controlRespMenu();
   // window.addEventListener('scroll', event => {console.log(scene[0].scene.controller().info().scrollDirection)})
   // function to check for scroll direction
   // window.addEventListener("load", handleScreenSize(respSize, scene));
   // window.addEventListener("resize", handleScreenSize(respSize, scene));

}

// equivalent to ready()
if(document.readyState === "complete" || 
   (document.readyState !== "loading" && !document.documentElement.doScroll)) {
      main();
   } else{
      document.addEventListener("DOMContentLoaded", main);
   }
