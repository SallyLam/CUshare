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

  // Respond a GET request for the /profile page.
  // Display the user's personal information.
  app.get('/profile', function (req, res) {
    if (!req.session.user) {
      req.session.error = "You must login first!";
      res.redirect('/login');
    }
    else {
      var User = global.dbHelper.getModel('user');
      User.findOne({"username": req.session.user.username}, function (error, doc) {
        if (error) {
          res.redirect('/');
        } else if (!doc) {
          res.redirect('/logout');
        } else {
          var data = { "firstname": doc.firstname, "lastname": doc.lastname,
          "email": doc.email, "phone": doc.phone,
          "address": doc.address, "username": doc.username,
          "isLogin": true };
          res.render('profile', data);
        }
      });
    }
  });

  // Respond a GET request for the /editprofile page.
  app.get('/editprofile', function (req, res) {
    if (!req.session.user) {
      req.session.error = "You must login first!";
      res.redirect('/login');
    }
    else {
      var User = global.dbHelper.getModel('user');
      User.findOne({"username": req.session.user.username}, function (error, doc) {
        if (error) {
          res.redirect('/');
        } else if (!doc) {
          res.redirect('/logout');
        } else {
          var data = { "firstname": doc.firstname, "lastname": doc.lastname,
          "email": doc.email, "phone": doc.phone,
          "address": doc.address, "username": doc.username,
          "isLogin": true };
          res.render('editprofile', data);
        }
      });
    }
  });

  // Respond a POST request for the /editprofile page.
  // Edit the user's personal information.
  app.post('/editprofile', function (req, res) {
    if (!req.session.user) {
      req.session.error = 'You must login first!';
      res.sendStatus(409);
    } else {
      var User = global.dbHelper.getModel('user'),
      // Strip the leading and trailing spaces.
      newData = { "firstname": req.body.firstname.replace(/^\s+/, '').replace(/\s+$/, ''),
      "lastname": req.body.lastname.replace(/^\s+/, '').replace(/\s+$/, ''),
      "phone": req.body.phone.replace(/^\s+/, '').replace(/\s+$/, ''),
      "address": req.body.address.replace(/^\s+/, '').replace(/\s+$/, '') };
      User.findOneAndUpdate({ "username": req.session.user.username }, newData, function (error, doc) {
        if (error) {
          req.session.error = 'Error occurred';
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });

  // Respond a GET request for the /changepassword page.
  app.get('/changepassword', function (req, res) {
    if (!req.session.user) {
      req.session.error = "You must login first!";
      res.redirect('/login');
    }
    else {
      var data = { "isLogin": true, "firstname": req.session.user.firstname,
      "username": req.session.user.username };
      res.render('changepassword', data);
    }
  });

  // Respond a POST request for the /changepassword page.
  // Change the user's password.
  app.post('/changepassword', function (req, res) {
    if (!req.session.user) {
      req.session.error = 'You must login first!';
      res.sendStatus(409);
    } else {
      var User = global.dbHelper.getModel('user');
      User.findOne({ "username": req.session.user.username }, function (error, doc) {
        if (error) {
          req.session.error = 'Network Error!';
          res.sendStatus(500);
        } else if (!doc) {
          req.session.error = 'Internal Error!';
          res.sendStatus(500);
        } else if (req.body.oldPassword != doc.pwd) {
          req.session.error = 'Original password is wrong!';
          res.sendStatus(409);
        } else if (req.body.newPassword != req.body.confirmpwd) {
          req.session.error = 'New password and confirm password not matched!';
          res.sendStatus(409);
        } else {
          var newData = { "pwd": req.body.newPassword };
          User.findOneAndUpdate({ "username": req.session.user.username }, newData, function (error, doc) {
            if (error) {
              req.session.error = 'Error occurred';
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
        }
      });
    }
  });

};
