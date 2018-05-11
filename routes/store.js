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

  // Respond a GET request for the /store page.
  // Display artwork commodities.
  app.get('/store', function (req, res) {
    res.redirect('/store/1');
  });

  // Respond a GET request for the /store/:page page.
  // Display artwork commodities at the particular page.
  app.get('/store/:page', function (req, res) {
    var Item = global.dbHelper.getModel('item');
    Item.find({}, function (error, docs) {
      if (error) {
        res.redirect('/');
      } else if (!docs) {
        req.session.error = "No item yet!";
        res.redirect('/');
      } else {
        var page = req.params.page;
        if (req.session.user) {
          res.render('store', { "Items": docs.slice(16*(page-1), 16*page),
          "page": page,
          "isLogin": true,
          "firstname": req.session.user.firstname });
        } else {
          res.render('store', { "Items": docs.slice(16*(page-1), 16*page),
          "page": page,
          "isLogin": false});
        }
      }
    });
  });

};
