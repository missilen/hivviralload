angular.module('app').filter('escapeDot', function() {
  return function(input) {
    // ganked lovingly from https://gist.github.com/mattwiebe/1005915

  /**
   * Turns someCrazyName into Some Crazy Name
   * Decent job of acroynyms:
   * ABCAcryonym => ABC Acryoynm
   * xmlHTTPRequest => Xml HTTP Request
   */
    if(input != null)
    {
    	return input
    		.replace(/\./g, function(txt){return '#~^';});
    }
    else
    {
      return null;
    }
  };
})