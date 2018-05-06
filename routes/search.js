/*
	CUshare Resource Sharing Platform

  	CUshare allow CUers conveniently share their personal items (such as used textbooks) with each other.
    User can issue sell request, buy request, or even exchange request if needed on CUshare.
    People with corresponding needs can respond to the request and settle down time/location
    of the sharing with you directly on the website.

  	@category   View
  	@author     Xinyu (Cynric) Fu 		<xyfu6@cse.cuhk.edu.hk>
  	@author     Zhanhao (Jasper) Liu 	<zhliu6@cse.cuhk.edu.hk>
  	@author     Shinmin (Sally) lin 	<smlin6@cse.cuhk.edu.hk>
  	@author     Jiamin (Vito) Chen 		<jmchen6@cse.cuhk.edu.hk>
 	  @copyright  2018 YAMT
 	  @license    https://opensource.org/licenses/MIT
  	@version    1.0.0	04-05-2018
  	@link       to-be-deployed

*/


module.exports = function ( app ) {

  // Respond a GET request for the /search page.
  // Search items with user-input keywords.
  app.get('/search', function (req, res) {
    // Strip leading and trailing spaces.
    var searchableString = req.query.searchableString.replace(/^\s+/, '').replace(/\s+$/, '');
    if (searchableString == "") {
      res.redirect('store');
    } else {
      var Item = global.dbHelper.getModel('item'),
      keywords = searchableString.split(' '),
      regexString = "";

      // Produce a regex string in format 'keyword1|keyword2|keyword3'
      for (var i = 0; i < keywords.length; i++) {
        if (keywords[i] != "") {
          regexString += keywords[i];
          if (i < keywords.length - 1) regexString += '|';
        }
      }
      var re = new RegExp(regexString, 'ig');

      // Find items using the regex string above.
      // That is to find items matching at least one keyword entered by the user.
      Item.find({ "name": re }, function (error, doc) {
        if (error) {
          req.session.error = "Network Error!";
          res.redirect('/');
        } else if (doc.length == 0) {
          req.session.notification = "No search results.";
          res.redirect('store');
        } else {
          delete req.session.error;
          delete req.session.notification;
          if (req.session.user) {
            res.render('search', { "resultList": doc,
            "isLogin": true, "searchword": searchableString,
            "firstname": req.session.user.firstname });
          } else {
            res.render('search', { "resultList": doc, "searchword": searchableString,
            "isLogin": false });
          }
        }
      });
    }
  });

};
