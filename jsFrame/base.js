(function (win, cb) {
    
})(this, function () {
        'use strict'
        
        requestAnimationFrame = function (callback) {
            if (requestAnimationFrame) return requestAnimationFrame(callback);
            else if (webkitRequestAnimationFrame) return webkitRequestAnimationFrame(callback);
            else if (mozRequestAnimationFrame) return mozRequestAnimationFrame(callback);
            else  return setTimeout(callback, 1000 / 60);
            
        };
        cancelAnimationFrame = function (id) {
            if (cancelAnimationFrame) return cancelAnimationFrame(id);
            else if (webkitCancelAnimationFrame) return webkitCancelAnimationFrame(id);
            else if (mozCancelAnimationFrame) return mozCancelAnimationFrame(id);
            else return clearTimeout(id);
            
        };


        return {
            
        }
})