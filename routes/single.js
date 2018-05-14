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

  // Respond a GET request for the /single/:id page.
  // Display the information of a single commodity.
  app.get('/single/:id', function (req, res) {
    var Items = global.dbHelper.getModel('item');
    // Get all types' sizes
    var all_size, book_size, electronics_size, groceries_size, lt100_size, gt100lt300_size, gt300_size;
    Items.count({}, function( err, count){
        all_size = count;
    });
    Items.count({ "type": "book" }, function( err, count){
        book_size = count;
    });
    Items.count({ "type": "electronics" }, function( err, count){
        electronics_size = count;
    });
    Items.count({ "type": "groceries" }, function( err, count){
        groceries_size = count;
    });
    Items.count({ "price": { "$lt": 100 }}, function( err, count){
        lt100_size = count;
    });
    Items.count({ "price": { "$gte": 100, "$lt": 300 }}, function( err, count){
        gt100lt300_size = count;
    });
    Items.count({ "price": { "$gte": 300 }}, function( err, count){
        gt300_size = count;
    });

    // Get the ID of the commodity through req.params.id
    Items.findOne({"_id": req.params.id}, function (error, doc) {
      if (error) {
        res.redirect('/');
      } else if (!doc) {
        req.session.error = "No information yet!";
        res.redirect('/');
      } else {
        setTimeout(function () {
          Items.find({}, function (error, docs) {
            if (req.session.user) {
              res.render('single', { "Items": docs, "itemid": req.params.id, "itemname": doc.name,
                "itemtype": doc.type, "firstname": req.session.user.firstname, "userid": req.session.user._id, "isLogin": true,
                "itemprice": doc.price, "item_description": doc.description, "imgSrc": doc.imgSrc,
                "all_size": all_size, "lt100_size": lt100_size, "gt100lt300_size": gt100lt300_size, "gt300_size": gt300_size,
                "book_size": book_size, "electronics_size": electronics_size, "groceries_size": groceries_size});
            } else {
              res.render('single', {  "Items": docs, "itemid": req.params.id, "itemname": doc.name,
                "itemtype": doc.type, "firstname": "Anonymous", "userid": null, "isLogin": false,
                "itemprice": doc.price, "item_description": doc.description, "imgSrc": doc.imgSrc,
                "all_size": all_size, "lt100_size": lt100_size, "gt100lt300_size": gt100lt300_size, "gt300_size": gt300_size,
                "book_size": book_size, "electronics_size": electronics_size, "groceries_size": groceries_size });
            }
          });
        }, 200);
      }
    });
  });

};

var Comment = global.dbHelper.getModel('comment');
var client = require('socket.io').listen(8000).sockets;
client.on('connection', function (socket) {
  sendStatus = function (status) {
    socket.emit('status', status);
  };

  // Wait for getRecent request from the client
  socket.on('getRecent', function (data) {
    Comment.find({"cId": data.cId}, null, {sort: {_id: -1}, limit: 100}, function (err, docs) {
      if (err) throw err;
      socket.emit('output', docs);
    });
  });

  // Wait for input
  socket.on('input', function (data) {
    var whitespace = /^\s*$/;
    if (whitespace.test(data.uFName) || whitespace.test(data.content)) {
      sendStatus('User Firstname or Comment Content Required');
    }
    else {
      Comment.create({
        isAnonymous: data.isAnonymous,
        uId: data.uId,
        uFName: data.uFName,
        cId: data.cId,
        content: data.content
      }, function (err, doc) {
        if (err) {
          throw err;
        }
        else {
          // Emit latest messages to all clients
          client.emit('output', [data]);
          sendStatus({
            message: "Message sent",
            clear: true
          });
        }
      });
    }
  });
});
