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

  // Respond a GET request for the /login page.
  app.get('/login',function(req,res){
    if (!req.session.user) {
      res.render('login', { "alert": false,
      "isLogin": false });
    }
    else {
      res.redirect('/profile');
    }
  });

  // Respond a POST request for the /login page.
  // Handle the login information submitted by the user.
  app.post('/login', function (req, res) {
    if (!req.session.user) {
      var User = global.dbHelper.getModel('user'),
      username = req.body.username;
      // Find the user in the dababase, given the username.
      User.findOne({"username": username}, function (error, doc) {
        if (error) {
          req.session.error = 'Network Error！';
          res.sendStatus(500);
          console.log(error);
        } else if (!doc) {
          req.session.error = 'Username does not exists!';
          res.sendStatus(404);
        } else {
          if(req.body.password != doc.pwd){
            req.session.error = "Wrong password!";
            res.sendStatus(404);
          }else{
            req.session.user = doc;
            res.sendStatus(200);
          }
        }
      });
    }
    else {
      req.session.error = "You have logged in!";
      res.sendStatus(409);
    }
  });

};
