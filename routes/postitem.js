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

  // Respond a GET request for the /postitem page.
  app.get('/postitem', function(req, res) {
    if (!req.session.user) {
      req.session.error = "You must login first!";
      res.redirect('/login');
    }
    else {
      res.render('postitem', { "isLogin": true,
      "firstname": req.session.user.firstname });
    }
  });

  // Respond a POST request for the /postitem page.
  // Insert a new item into the database.
  app.post('/postitem', function (req, res) {
    var Item = global.dbHelper.getModel('item'),
    name = req.body.name;
    // Find the item in the database given its name.
    Item.findOne({"name": name}, function (error, doc) {
      if (error) {
        req.session.error = 'Network Error！';
        res.sendStatus(500);
        console.log(error);
      }
      // Print error if it already exists.
      else if (doc) {
        req.session.error = 'Item name existed';
        res.sendStatus(409);
      }
      // Otherwise insert it into the database.
      else {
        Item.create({
          "name": name,
          "price": req.body.price,
          "description": req.body.description,
          "imgSrc": req.body.imgSrc,
          "type": req.body.type,
          "uUName": req.session.user.username,
          "uFName": req.session.user.firstname
        }, function (error, doc) {
          if (error) {
            req.session.error = 'Network Error！';
            res.sendStatus(500);
            console.log(error);
          } else {
            req.session.notification = 'Successfully posted！';
            res.sendStatus(200);
          }
        });
      }
    });
  });

};
