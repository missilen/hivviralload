commSphereApp.directive('syncScroll', [function() {
    var directive = {
        link: link
    }
    return directive;
    function link(scope, element, attrs) {
        setTimeout(function() {
            var $gridToSync = $("#" + attrs['syncScroll']);
            var $horizontalScrollToSync = $gridToSync.find('.horizontal');
            var $verticalScrollToSync = $gridToSync.find('.vertical');

            var $horizontalScroll = element.find('.horizontal');
            var $verticalScroll = element.find('.vertical');

            //Bind scroll Events
            $horizontalScroll.scroll(function () {
                $horizontalScrollToSync.scrollLeft($(this).scrollLeft()); 
            });
            $verticalScroll.scroll(function() {
                $verticalScrollToSync.scrollTop($(this).scrollTop());
            }); 
        }, 300); 
    }
 }]);