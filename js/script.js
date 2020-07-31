gsap.registerPlugin(ScrollToPlugin);

const scrollToSection = (controller) => (event) => {
   /*  
      callback takes scrollmagic controller, and called when event is passed in.
      scroll to position based on href attribute from event.
   */
   const navTo = event.target.getAttribute('href');
  
   controller.scrollTo(target => {
      TweenMax.to(
         window, 
         1, 
         { 
            scrollTo: {
               // 1 above is for 1 sec
               // offset of 60px
               y: target - 59,
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

const defineNavLink = (controller, navClassFrom) => {
   /*
      function to handle click navigation, takes scrollmagic controller and a 
      class from anchor or an ul.
   */
   const navFrom = document.querySelector(navClassFrom);
   const navChildren = navFrom.children;
   if(navChildren.length > 0) {
      [...navChildren].forEach(li => li.addEventListener("click", scrollToSection(controller)));
   } else if(navChildren.length === 0) {
      navFrom.addEventListener("click", scrollToSection(controller));
   } else {
      throw(Error("parameter not accepted."));
   }
   
}

const main = () => {
   let respSize = window.innerWidth;
   // holds the state for max window size for responsive container, used to update duration.
   const scene = [];
   const controller = new ScrollMagic.Controller();
   defineNavLink(controller, ".main-nav__list");
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
