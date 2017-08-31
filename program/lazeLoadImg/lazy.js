
!function(win, doc, undefined) {
    if(typeof IntersectionObserver !== 'function') {
        var isInSight = function (el) {
            var bound = el.getBoundingClientRect();
            var clientHeight = window.innerHeight;
            return bound.top <= clientHeight + 100;
          }
          
          let index = 0;
          var checkImgs = function () {
            const imgs = document.getElementsByTagName('img'); //document.querySelectorAll('.my-photo');
            for (let i = index; i < imgs.length; i++) {
              if (isInSight(imgs[i])) {
                loadImg(imgs[i]);
                index = i;
              }
            }
            // Array.from(imgs).forEach(el => {
            //   if (isInSight(el)) {
            //     loadImg(el);
            //   }
            // })
          }
        //   var loadImg =  function (el) {
        //             if (!el.src) {
        //             const source = el.dataset.src;
        //             el.src = source;
        //             }
        //         }
    } else {
        var checkImgs = function () {
            const imgs = Array.from(document.getElementsByTagName('img'));
            imgs.forEach(function(item) {
                io.observe(item)
            });
          } 
           
          var io = new IntersectionObserver(function(ioes) {
              console.info(ioes)
            ioes.forEach(function(ioe) {
              const el = ioe.target;
            //   console.log(el)
              const intersectionRatio = ioe.intersectionRatio;
              console.log(intersectionRatio)
              if (intersectionRatio > 0 && intersectionRatio)  {
                  io.unobserve(el);
                  loadImg(el)
              }
            });
          });
          console.log(io)

    }

    function loadImg(el) {
        // if (!el.src) {
          var source = el.getAttribute("lazy-src")// el.dataset.src;
          el.src = source;
        // }
      }
      
      function throttle(fn, mustRun = 500) {
        const timer = null;
        let previous = null;
        return function() {
          const now = new Date();
          const context = this;
          const args = arguments;
          if (!previous) {
            previous = now;
          }
          const remaining = now - previous;
          if (mustRun && remaining >= mustRun) {
            fn.apply(context, args);
            previous = now;
          }
        }
      }

    window.onload=checkImgs;
    // window.onscroll = throttle(checkImgs);

}(this || window, document);