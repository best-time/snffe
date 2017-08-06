(function (win, cb) {
    
})(this, function () {
        'use strict'
        
        function _(obj) {
            if (obj instanceof _) return obj;
            if (!(this instanceof _)) return new _(obj);
        }
        var __ = _.prototype
        
        _.now = Date.now || function () {
            return +new Date() || new Date() - 0 || new Date().getTime();
        };

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


// 水波效果
        $(function(){
  $(".ripple").click(function(e){
    if ($(this).find("#wave").length){
      $(this).find("#wave").remove();
    }
    $(this).append("<div id='wave'></div>");
    var wave=$(this).find("#wave");
    wave.css({
      "display": " block",
      //涟漪的颜色
      "background": " rgba(0, 0, 0, 0.3)",
      "border-radius": " 50%",
      "position": " absolute",
      "-webkit-transform": " scale(0)",
      "transform": " scale(0)",
      "opacity": " 1",
      //涟漪的速度
      "transition": " all 0.7s",
      "-webkit-transition": " all 0.7s",
      "-moz-transition": " all 0.7s",
      "-o-transition": " all 0.7s",
      "z-index": " 1",
      "overflow": " hidden",
      "pointer-events": " none"
    });
    // 获取ripple的宽度和高度
    waveWidth = parseInt($(this).outerWidth());
    waveHeight = parseInt($(this).outerHeight());

    if(waveWidth < waveHeight){
      var R= waveHeight;
    }else {
      var R= waveWidth;
    }
    wave.css({
      "width":(R*2)+"px",
      "height":(R*2)+"px",
      "top": (e.pageY -$(this).offset().top - R)+'px',
      "left": ( e.pageX -$(this).offset().left -R)+'px',
      "transform":"scale(1)",
      "-webkit-transform":"scale(1)",
      "opacity":"0"
    });
  });
});        

    // 刷新页面的几种方法
    function reload() {
        history.go(0)
        location.reload()
        location=location
        location.assign(location)
        document.execCommand('Refresh')
        window.navigate(location)
        location.replace(location)
        document.URL=location.href
    }



function nameSpace(str, obj) {
            var parts = str.split('.'), 
                item,
                container = window

            while(parts.length > 0) {
                item = parts.shift()
                if(parts.length === 0) {
                    container[item] = obj || container[item] || {}
                    return container[item]
                } else {
                    container[item] = container[item] || {}
                }
                container = container[item]
            }
            return obj
        }    


        return {
            
        }
})