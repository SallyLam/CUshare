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

var u = require('underscore');

module.exports = function ( app ) {

  // Respond a GET request for the /store page.
  // Display artwork commodities.
  app.get('/store', function (req, res) {
    res.redirect('/store/1');
  });

  app.get('/store/selling', function (req, res) {
    res.redirect('/store/selling/1');
  });

  app.get('/store/buying', function (req, res) {
    res.redirect('/store/buying/1');
  });

  // others wanna sell sth
  app.get('/store/selling/:page', function (req, res) {
    renderStore({"sellBuy": true}, 'Selling', req, res);
  });

  // others wanna buy sth
  app.get('/store/buying/:page', function (req, res) {
    renderStore({"sellBuy": false}, 'Buying', req, res);
  });

  // Respond a GET request for the /store/:page page.
  // Display artwork commodities at the particular page.
  app.get('/store/:page', function (req, res) {
    renderStore({}, null, req, res);
  });


  function renderStore(conditions, category, req, res) {
    var finished = u.after(9, doRender);

    var Item = global.dbHelper.getModel('item');
    // Get all types' sizes
    var all_size, book_size, electronics_size, groceries_size, lt100_size, gt100lt300_size, gt300_size, sell_size, buy_size;
    Item.count({}, function( err, count){
        all_size = count;
        finished();
    });
    Item.count({ "type": "book" }, function( err, count){
        book_size = count;
        finished();
    });
    Item.count({ "type": "electronics" }, function( err, count){
        electronics_size = count;
        finished();
    });
    Item.count({ "type": "groceries" }, function( err, count){
        groceries_size = count;
        finished();
    });
    Item.count({ "price": { "$lt": 100 }}, function( err, count){
        lt100_size = count;
        finished();
    });
    Item.count({ "price": { "$gte": 100, "$lt": 300 }}, function( err, count){
        gt100lt300_size = count;
        finished();
    });
    Item.count({ "price": { "$gte": 300 }}, function( err, count){
        gt300_size = count;
        finished();
    });
    Item.count({"sellBuy": true}, function (err, count) {
        sell_size = count;
        finished();
    });
    Item.count({"sellBuy": false}, function (err, count) {
        buy_size = count;
        finished();
    });

    function doRender() {
      Item.find(conditions, function (error, docs) {
        if (error) {
          res.redirect('/');
        } else if (!docs) {
          req.session.error = "No item yet!";
          res.redirect('/');
        } else {
          var page = req.params.page;
          if (req.session.user) {
            res.render('store', {
              "category": category,
              "Items": docs.slice(16*(page-1), 16*page),
              "page": page,
              "isLogin": true,
              "all_size": all_size, "lt100_size": lt100_size,
              "gt100lt300_size": gt100lt300_size, "gt300_size": gt300_size,
              "sell_size": sell_size, "buy_size": buy_size,
              "book_size": book_size, "electronics_size": electronics_size,
              "groceries_size": groceries_size,
              "firstname": req.session.user.firstname
            });
          } else {
            res.render('store', {
              "category": category,
              "Items": docs.slice(16*(page-1), 16*page),
              "page": page,
              "isLogin": false,
              "all_size": all_size, "lt100_size": lt100_size,
              "gt100lt300_size": gt100lt300_size, "gt300_size": gt300_size,
              "sell_size": sell_size, "buy_size": buy_size,
              "book_size": book_size, "electronics_size": electronics_size,
              "groceries_size": groceries_size,
            });
          }
        }
      });
    }
  }

};
