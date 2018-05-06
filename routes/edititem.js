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

  // Respond a GET request for the /edititem page.
  app.get('/edititem', function(req, res) {
    if (!req.session.user) {
      req.session.error = "You must login first!";
      res.redirect('login');
    }
    else {
      delete req.session.error;
      delete req.session.notification;
      res.render('edititem', { "isLogin": true,
      "firstname": req.session.user.firstname });
    }
  });

  // Respond a POST request for the /edititem page.
  // Edit the information of a particular item.
  app.post('/edititem', function (req, res) {
    var Item = global.dbHelper.getModel('item');
    // Find the item given the name.
    Item.findOne({"name": req.body.oriname}, function (error, doc) {
      if (error) {
        req.session.error = 'Network Error！';
        res.send(500);
        console.log(error);
      }
      // Edit if successfully find it.
      else if (doc) {
        Item.update({"name":req.body.oriname}, {$set : { "type" : req.body.type, "price" : req.body.price , "imgSrc" : req.body.imgSrc, "name" : req.body.name }}, function (error, doc) {
          if (error) {
            req.session.error = 'Error occurred';
            res.send(500);
          } else {
            res.send(200);
          }
        });
      }
      // Otherwise print error.
      else {
        req.session.error = 'Item name not existed';
        res.send(409);
      }
    });
  });

};
