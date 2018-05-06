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

  // Respond a GET request for the /about page.
  app.get('/about', function (req, res) {
    delete req.session.error;
    delete req.session.notification;
    if (req.session.user) {
      res.render('about', { "isLogin": true,
      "firstname": req.session.user.firstname });
    }
    else{
      res.render('about', { "isLogin": false });
    }
  });

  // Respond a GET request for the /contact page.
  app.get('/contact', function (req, res) {
    delete req.session.error;
    delete req.session.notification;
    if (req.session.user) {
      res.render('contact', { "isLogin": true,
      "firstname": req.session.user.firstname });
    }
    else{
      res.render('contact', { "isLogin": false });
    }
  });

  // Respond a GET request for the /message page.
  app.get('/message', function (req, res) {
    delete req.session.error;
    delete req.session.notification;
    if (req.session.user) {
      res.render('message', { "isLogin": true,
      "firstname": req.session.user.firstname });
    }
    else{
      res.render('message', { "isLogin": false });
    }
  });

};
