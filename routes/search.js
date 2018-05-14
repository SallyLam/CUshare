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

var Fuse = require('fuse.js')
var options = {
  shouldSort: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.5,
  location: 0,
  distance: 100,
  maxPatternLength: 100,
  minMatchCharLength: 1,
  keys: [
    "name",
    "type"
  ]
};
var u = require('underscore');

module.exports = function ( app ) {

  // Respond a GET request for the /search page.
  // Search items with user-input keywords.
  app.get('/search', function (req, res) {
    // Strip leading and trailing spaces.
    var searchableString = req.query.searchableString.replace(/^\s+/, '').replace(/\s+$/, '');
    if (searchableString == "") {
      res.redirect('/store');
    } else {
      var finished = u.after(9, doRender);

      // fuzzy search using fuse.js library
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
        Item.find({}, function (err, docs) {
          var fuse = new Fuse(docs, options);
          var fuseResult = fuse.search(searchableString);
          if (fuseResult.length == 0) {
            req.session.notification = "No search results.";
            res.redirect('/store');
          }
          else {
            resultList = fuseResult.map(x => x.item)
            if (req.session.user) {
              res.render('search', {
                "resultList": resultList,
                "isLogin": true,
                "searchword": searchableString,
                "all_size": all_size, "lt100_size": lt100_size,
                "gt100lt300_size": gt100lt300_size, "gt300_size": gt300_size,
                "book_size": book_size, "electronics_size": electronics_size,
                "groceries_size": groceries_size,
                "sell_size": sell_size,
                "buy_size": buy_size,
                "firstname": req.session.user.firstname
              });
            } else {
              res.render('search', {
                "resultList": resultList,
                "searchword": searchableString,
                "all_size": all_size, "lt100_size": lt100_size,
                "gt100lt300_size": gt100lt300_size, "gt300_size": gt300_size,
                "book_size": book_size, "electronics_size": electronics_size,
                "groceries_size": groceries_size,
                "sell_size": sell_size,
                "buy_size": buy_size,
                "isLogin": false
              });
            }
          }
        });
      }

    }
  });

};
