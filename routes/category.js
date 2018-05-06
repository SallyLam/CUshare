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

  // Respond a GET request for the /painting page.
  // Display painting artworks.
  app.get('/painting', function (req, res) {
    res.redirect('/painting/1');
  });

  // Respond a GET request for the /painting/:page page.
  // Display painting artworks at the particular page.
  app.get('/painting/:page', function (req, res) {
    var Item = global.dbHelper.getModel('item');
    Item.find({ "type": "painting" }, function (error, docs) {
      if (error) {
        res.redirect('/');
      } else if (!docs) {
        req.session.error = "No item yet!";
        res.redirect('/');
      } else {
        delete req.session.error;
        delete req.session.notification;
        var page = req.params.page;
        if (req.session.user) {
          res.render('painting', { "Items": docs.slice(16*(page-1), 16*page),
                                   "isLogin": true, "page": page,
                                   "firstname": req.session.user.firstname });
        } else {
          res.render('painting', { "Items": docs.slice(16*(page-1), 16*page),
                                   "isLogin": false, "page": page});
        }
      }
    });
  });

  // Respond a GET request for the /sculpture page.
  // Display sculpture artworks.
  app.get('/sculpture', function (req, res) {
    res.redirect('/sculpture/1');
  });

  // Respond a GET request for the /sculpture/:page page.
  // Display sculpture artworks at the particular page.
  app.get('/sculpture/:page', function (req, res) {
    var Item = global.dbHelper.getModel('item');
    Item.find({ "type": "sculpture" }, function (error, docs) {
      if (error) {
        res.redirect('/');
      } else if (!docs) {
        req.session.error = "No item yet!";
        res.redirect('/');
      } else{
        delete req.session.error;
        delete req.session.notification;
        var page = req.params.page;
        if (req.session.user) {
          res.render('sculpture', { "Items": docs.slice(16*(page-1), 16*page),
                                   "isLogin": true, "page": page,
                                   "firstname": req.session.user.firstname });
        } else {
          res.render('sculpture', { "Items": docs.slice(16*(page-1), 16*page),
                                   "isLogin": false, "page": page});
        }
      }
    });
  });

  // Respond a GET request for the /photography page.
  // Display photography artworks.
  app.get('/photography', function (req, res) {
    res.redirect('/photography/1');
  });

  // Respond a GET request for the /photography page.
  // Display photography artworks at the particular page.
  app.get('/photography/:page', function (req, res) {
    var Item = global.dbHelper.getModel('item');
    Item.find({ "type": "photography" }, function (error, docs) {
      if (error) {
        res.redirect('/');
      } else if (!docs) {
        req.session.error = "No item yet!";
        res.redirect('/');
      } else {
        delete req.session.error;
        delete req.session.notification;
        var page = req.params.page;
        if (req.session.user) {
          res.render('photography', { "Items": docs.slice(16*(page-1), 16*page),
                                   "isLogin": true, "page": page,
                                   "firstname": req.session.user.firstname });
        } else {
          res.render('photography', { "Items": docs.slice(16*(page-1), 16*page),
                                   "isLogin": false, "page": page});
        }
      }
    });
  });

  // Respond a GET request for the /1500 page.
  // Display artworks under 1500 HKD.
  app.get('/1500', function (req, res) {
    res.redirect('/1500/1');
  });

  // Respond a GET request for the /1500/:page page.
  // Display artworks under 1500 HKD at the particular page.
  app.get('/1500/:page', function (req, res) {
    var Item = global.dbHelper.getModel('item');
    Item.find({ "price": { "$lt": 1500 } }, function (error, docs) {
      if (error) {
        res.redirect('/');
      } else if (!docs) {
        req.session.error = "No item yet!";
        res.redirect('/');
      } else {
        delete req.session.error;
        delete req.session.notification;
        var page = req.params.page;
        if (req.session.user) {
          res.render('1500', { "Items": docs.slice(16*(page-1), 16*page),
                                   "isLogin": true, "page": page,
                                   "firstname": req.session.user.firstname });
        } else {
          res.render('1500', { "Items": docs.slice(16*(page-1), 16*page),
                                   "isLogin": false, "page": page});
        }
      }
    });
  });

  // Respond a GET request for the /1500-3000 page.
  // Display artworks between 1500 HKD and 3000 HKD.
  app.get('/1500-3000', function (req, res) {
    res.redirect('/1500-3000/1');
  });

  // Respond a GET request for the /1500-3000/:page page.
  // Display artworks between 1500 HKD and 3000 HKD at the particular page.
  app.get('/1500-3000/:page', function (req, res) {
    var Item = global.dbHelper.getModel('item');
    Item.find({ "price": { "$gte": 1500, "$lt": 3000 } }, function (error, docs) {
      if (error) {
        res.redirect('/');
      } else if (!docs) {
        req.session.error = "No item yet!";
        res.redirect('/');
      } else {
        delete req.session.error;
        delete req.session.notification;
        var page = req.params.page;
        if (req.session.user) {
          res.render('1500-3000', { "Items": docs.slice(16*(page-1), 16*page),
                                   "isLogin": true, "page": page,
                                   "firstname": req.session.user.firstname });
        } else {
          res.render('1500-3000', { "Items": docs.slice(16*(page-1), 16*page),"page": page,
                                   "isLogin": false});
        }
      }
    });
  });

  // Respond a GET request for the /3000 page.
  // Display artworks over 3000 HKD.
  app.get('/3000', function (req, res) {
    res.redirect('/3000/1');
  });

  // Respond a GET request for the /3000/:page page.
  // Display artworks over 3000 HKD at the particular page.
  app.get('/3000/:page', function (req, res) {
    var Item = global.dbHelper.getModel('item');
    Item.find({ "price": { "$gte": 3000 } }, function (error, docs) {
      if (error) {
        res.redirect('/');
      } else if (!docs) {
        req.session.error = "No item yet!";
        res.redirect('/');
      } else {
        delete req.session.error;
        delete req.session.notification;
        var page = req.params.page;
        if (req.session.user) {
          res.render('3000', { "Items": docs.slice(16*(page-1), 16*page),
                                   "isLogin": true, "page": page,
                                   "firstname": req.session.user.firstname });
        } else {
          res.render('3000', { "Items": docs.slice(16*(page-1), 16*page),"page": page,
                                   "isLogin": false});
        }
      }
    });
  });

};
