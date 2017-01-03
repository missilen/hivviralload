commSphereApp.
directive('setClassWhenAtTop', function ($window) {
    var $win = angular.element($window); // wrap window object as jQuery object

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // console.log(element.offset().top);
            // //console.log(element[0].getBoundingClientRect());
            var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
                offsetTop = element.offset().top; // get element's top relative to the document

            $win.on('scroll', function (e) {
                //console.log(element,element.offset().top);
                //console.log($win.scrollTop(),offsetTop)
                if ($win.scrollTop() >= 458-101 ) {
                    element.addClass(topClass);
                } else {
                    element.removeClass(topClass);
                }
            });
        }
    };
}).

controller('ctrl', function ($scope) {
    $scope.scrollTo = function (target){
    };
});
