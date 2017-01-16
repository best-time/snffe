; (function ($, win, doc) {
    'use strict'

    function dataObject() {
        return Object.create(null)
    }
    
    var _slide = dataObject()

    var cssString = '._popup_{position:absolute;bottom:0;left:0;right:0;z-index:10000;width:100%;background:#fff;-webkit-transition:all,0.6s;transition:all,0.6s}._popup_.slide-out{-webkit-transform:translate(0, 100%) translateZ(0);transform:translate(0, 100%) translateZ(0)}._popup_.slide-in{-webkit-transform:translate(0, 0) translateZ(0);transform:translate(0, 0) translateZ(0)}'
    
    _slide.modal = function (params) {
        var htmlTemp = '<div class="_popup_ slide-out" id="aa" data-for="slide-top" style="display: none">' + params.htmlTemp + '</div>'
        


        $(doc.body).append(htmlTemp)

    }

    $.modal = _slide.modal

})($, window, document);