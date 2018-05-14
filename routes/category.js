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

var u = require('underscore')

module.exports = function ( app ) {

  // Respond a GET request for the /book page.
  // Display books.
  app.get('/book', function (req, res) {
    res.redirect('/book/1');
  });

  // Respond a GET request for the /book/:page page.
  // Display books at the particular page.
  app.get('/book/:page', function (req, res) {
    renderStore({"type": "book"}, 'Book', req, res);
  });

  // Respond a GET request for the /electronics page.
  // Display electronics products.
  app.get('/electronics', function (req, res) {
    res.redirect('/electronics/1');
  });

  // Respond a GET request for the /electronics/:page page.
  // Display electronics artworks at the particular page.
  app.get('/electronics/:page', function (req, res) {
    renderStore({"type": "electronics"}, 'Electronics', req, res);
  });

  // Respond a GET request for the /groceries page.
  // Display groceries.
  app.get('/groceries', function (req, res) {
    res.redirect('/groceries/1');
  });

  // Respond a GET request for the /groceries page.
  // Display groceries at the particular page.
  app.get('/groceries/:page', function (req, res) {
    renderStore({"type": "groceries"}, 'Groceries', req, res);
  });

  // Respond a GET request for the /100 page.
  // Display artworks under 100 HKD.
  app.get('/100', function (req, res) {
    res.redirect('/100/1');
  });

  // Respond a GET request for the /100/:page page.
  // Display artworks under 100 HKD at the particular page.
  app.get('/100/:page', function (req, res) {
    renderStore({"price": {"$lt": 100}}, '≤ $100', req, res);
  });

  // Respond a GET request for the /100-300 page.
  // Display artworks between 100 HKD and 300 HKD.
  app.get('/100-300', function (req, res) {
    res.redirect('/100-300/1');
  });

  // Respond a GET request for the /100-300/:page page.
  // Display artworks between 100 HKD and 300 HKD at the particular page.
  app.get('/100-300/:page', function (req, res) {
    renderStore({"price": {"$gte": 100, "$lt": 300}}, '$150 - $300', req, res);
  });

  // Respond a GET request for the /300 page.
  // Display artworks over 300 HKD.
  app.get('/300', function (req, res) {
    res.redirect('/300/1');
  });

  // Respond a GET request for the /300/:page page.
  // Display artworks over 300 HKD at the particular page.
  app.get('/300/:page', function (req, res) {
    renderStore({"price": { "$gte": 300}}, '≥ $300', req, res);
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
