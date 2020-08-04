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
   .setClassToggle(animeTrigger, "animation__slideIn")
   // .addIndicators({trigger: "start"})
   .addTo(controller);

   return {scene: scene, trigger: animeTrigger}
}

const openMenu = (menu, menuList, menuBtn, btnIconMenu, btnIconClose) => {
   // Menu animation control
   if(menuList.classList.contains("animation__slideUp")) {
      menuList.classList.remove("animation__slideUp");
      menu.classList.remove("animation__menuUp");
   }
   menu.classList.add("animation__menuDown");
   menuList.classList.add("animation__slideDown");
   menuList.classList.remove("u-hidden");

   // Button animation control
   menuBtn.classList.add("animation__flipBtn");
   setTimeout(()=> {
      btnIconClose.classList.remove("u-hidden");
      btnIconMenu.classList.add("u-hidden");
   }, 150);
   menuBtn.addEventListener(
      'animationend', 
      () => menuBtn.classList.remove("animation__flipBtn"),
      { once: true }
   );
}

const closeMenu = (menu, menuList, menuBtn, btnIconMenu, btnIconClose) => {
   // Menu animation control
   if(menuList.classList.contains("animation__slideDown")) {
      menuList.classList.remove("animation__slideDown");
      menu.classList.remove("animation__menuDown");
   }
   menu.classList.add("animation__menuUp");
   menuList.classList.add("animation__slideUp");
   menuList.addEventListener(
      'animationend', 
      () => menuList.classList.add("u-hidden"), 
      { once: true }
   );
   
   // Button animation control
   menuBtn.classList.add("animation__flipBtn");
   setTimeout(()=> {
      btnIconMenu.classList.remove("u-hidden");
      btnIconClose.classList.add("u-hidden");
   }, 150);
   menuBtn.addEventListener(
      'animationend', 
      () => menuBtn.classList.remove("animation__flipBtn"), 
      { once: true }
   );
}

const menuCloseSel = (menu, menuList, menuBtn, btnIconMenu, btnIconClose) => {
   const navList = document.querySelector(".main-nav__list").children;
   [...navList].forEach(li => li.addEventListener("click", () => {
      if(window.innerWidth <= 900){
         closeMenu(menu, menuList, menuBtn, btnIconMenu, btnIconClose);
      }
   }));
}

const controlRespMenu = () => {
   const menu = document.querySelector(".main-nav");
   const menuList = document.querySelector(".main-nav__list");
   const menuBtn = document.querySelector(".main-nav__btn");
   const btnIconMenu = document.querySelector(".main-nav__icon--menu");
   const btnIconClose = document.querySelector(".main-nav__icon--close");

   menuBtn.addEventListener('click', () => {
      if(btnIconClose.classList.contains("u-hidden")) {
         // when Menu is clicked
         openMenu(menu, menuList, menuBtn, btnIconMenu, btnIconClose);
         
      } else if(btnIconMenu.classList.contains("u-hidden")) {
         // when Close is clicked
         closeMenu(menu, menuList, menuBtn, btnIconMenu, btnIconClose);
      }
   });

   menuCloseSel(menu, menuList, menuBtn, btnIconMenu, btnIconClose);
}

const resetNavBtn = () => {
   const btnIconMenu = document.querySelector(".main-nav__icon--menu");
   const btnIconClose = document.querySelector(".main-nav__icon--close");
   if(btnIconMenu.classList.contains("u-hidden")) {
      btnIconClose.classList.add("u-hidden");
      btnIconMenu.classList.remove("u-hidden");
   }
}

const resetNav = () => {
   const menu = document.querySelector(".main-nav");
   const menuList = document.querySelector(".main-nav__list");

   // Remove all animation or hidden class
   menu.classList.remove("animation__menuDown", "animation__menuUp");
   menuList.classList.remove("animation__slideDown", "animation__slideUp", "u-hidden");
}

const handleScreenSize = (respSize, scene = []) => (event) => {
   // callback for handling content duration of animation when window resized or loaded
   const currentSize = event.currentTarget.innerWidth;

   if (respSize !==1200 && currentSize >=1200) {
      // 1200 and up
      // handle navigation menu change due to resize
      if(respSize <= 600) { resetNav(); }
      return 1200;

      } else if(respSize !== 900 && currentSize >= 900 && currentSize < 1200) {
         //between 1200 and 900
         // handle navigation menu change due to resize
         if(respSize <= 600) { resetNav(); }
         return 900;

         } else if(respSize !== 600 && currentSize >= 600 && currentSize < 900) {
            // between 600 and 900, when nav menu change
            // handle navigation menu change due to resize
            if(respSize >= 900) {
               resetNavBtn();
               document.querySelector(".main-nav__list").classList.add("u-hidden");
               }
            return 600;

            } else if(respSize !== 0 && currentSize >= 0 && currentSize < 600) {
               // less then 600
               // handle navigation menu change due to resize
               if(respSize >= 900) {
                  resetNavBtn();
                  document.querySelector(".main-nav__list").classList.add("u-hidden");
                  }
               return 0;

               } else { return respSize; }
}

const main = () => {
   let respSize = window.innerWidth;
   // holds the state for max window size for responsive container, used to update values for media queries.
   const controller = new ScrollMagic.Controller();
   pinNav(controller);
   defineNavLink(controller, ".main-nav__list", 59);
   defineNavLink(controller, ".footer__link--scroll", 59);
   defineNavLink(controller, ".header__btn", 59);
   [...document.querySelectorAll('.h-secondary')].forEach(heading => scrollAnimationSlide(controller, heading));
   controlRespMenu();
   // window.addEventListener('scroll', event => {console.log(scene[0].scene.controller().info().scrollDirection)})
   // statement to check for scroll direction, not used for this project
   window.addEventListener("load", event => {
      respSize = handleScreenSize(respSize)(event);
      if(respSize <= 600) {
         resetNavBtn();
         document.querySelector(".main-nav__list").classList.add("u-hidden");
      }
   });
   window.addEventListener("resize", event => { respSize = handleScreenSize(respSize)(event) });
}

// equivalent to ready()
if(document.readyState === "complete" || 
   (document.readyState !== "loading" && !document.documentElement.doScroll)) {
      main();
   } else{
      document.addEventListener("DOMContentLoaded", main);
   }
