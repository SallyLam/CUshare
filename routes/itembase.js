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

  // Respond a GET request for the /itembase page.
  app.get('/itembase', function (req, res) {
    if (!req.session.user) {
      req.session.error = "You must login first!";
      res.redirect('login');
    }
    else {
      var Item = global.dbHelper.getModel('item');
      Item.find({}, function (error, docs) {
        if (error) {
          res.redirect('/');
        } else if (!docs) {
          req.session.error = "No item yet!";
          res.redirect('login');
        } else {
          delete req.session.error;
          delete req.session.notification;
          res.render('itembase', { "Items": docs,
          "isLogin": true,
          "firstname": req.session.user.firstname });
        }
      });
    }
  });

  // Respond a GET request for the /delFromItembase/:id page.
  // Delete a particular products in the item base.
  app.get("/delFromItembase/:id", function(req, res) {
    var Item = global.dbHelper.getModel('item');
    // Get the ID of the commodity through req.params.id
    Item.remove({"_id":req.params.id},function(error,doc){
      // Redirect to /itembase if success.
      if(doc > 0){
        res.redirect('/itembase');
      }
    });
  });

};
