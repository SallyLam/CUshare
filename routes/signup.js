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

  // Respond a GET request for the /signup page.
  app.get('/signup', function(req, res) {
    if (!req.session.user) {
      res.render('signup', { "isLogin": false });
    }
    else {
      res.redirect('/profile');
    }
  });

  // Respond a POST request for the /signup page.
  // Handle the signup information submitted by a new user.
  app.post('/signup', function (req, res) {
    // Strp the leading and trailing spaces.
    var User = global.dbHelper.getModel('user'),
    username = req.body.username.replace(/^\s+/, '').replace(/\s+$/, ''),
    email = req.body.email.replace(/^\s+/, '').replace(/\s+$/, ''),
    password = req.body.password,
    confirmpwd = req.body.confirmpwd,
    firstname = req.body.firstname.replace(/^\s+/, '').replace(/\s+$/, '');
    if (username == "" || email == "" || password == "" || confirmpwd == "" || firstname == "") {
      req.session.error = 'Please fill out all * blanks.';
      res.sendStatus(409);
    }
    else if (!/^\w+$/.test(username)){
      req.session.error = 'Please fill out the correct username.';
      res.sendStatus(409);
    }
    else if (!/^[ -~]+$/.test(password)){
      req.session.error = 'Please fill out the correct password.';
      res.sendStatus(409);
    }
    else if (password != confirmpwd){
      req.session.error = 'Please confirm with the same password.';
      res.sendStatus(409);
    }
    else if (!/^\w+([\.-]?\w+)*@\w+\.cuhk\.edu\.hk$/.test(email))
    {
      req.session.error = 'Please fill out the correct cuhk email address.';
      res.sendStatus(409);
    }
    else {
      // Find the user in the database, given the username.
      User.findOne({"username": username}, function (error, doc) {
        if (error) {
          req.session.error = 'Network Error!';
          res.sendStatus(500);
          console.log(error);
        }
        // Print error if successfully find it.
        else if (doc) {
          req.session.error = 'Username existed!';
          res.sendStatus(409);
        }
        // Otherwise, insert the information of the new user into the database.
        else {
          User.findOne({"email": email}, function (error, doc) {
            if (error) {
              req.session.error = 'Network Error!';
              res.sendStatus(500);
              console.log(error);
            } else if (doc) {
              req.session.error = 'Email registered!';
              res.sendStatus(409);
            } else if (req.body.password != req.body.confirmpwd) {
              req.session.error = 'PASSWORD and CONFIRM PASSWORD should be the same!';
              req.send(409);
            } else {
              User.create({
                "username": username,
                "pwd": password,
                "email": email,
                "firstname": firstname,
                "lastname": req.body.lastname.replace(/^\s+/, '').replace(/\s+$/, ''),
                "phone": req.body.phone.replace(/^\s+/, '').replace(/\s+$/, ''),
                "address": req.body.address.replace(/^\s+/, '').replace(/\s+$/, '')
              }, function (error, doc) {
                if (error) {
                  req.session.error = 'Network Error!';
                  res.sendStatus(500);
                  console.log(error);
                } else {
                  req.session.notification = 'Successfully created!';
                  res.sendStatus(200);
                }
              });
            }
          });
        }
      });
    }
  });

};
