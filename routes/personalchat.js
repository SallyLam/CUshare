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

var firstname;
module.exports = function ( app ) {

	// Respond a GET request for the /personalchat page.
	app.get('/personalchat', function (req, res) {
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
					firstname = doc.firstname;
					res.render('personalchat', { "isLogin": true, "firstname": firstname });
				}
			});
		}
	});

};

// Personal chat system component.
var mongo = require('mongodb').MongoClient,
		client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1:27017/test1', function(err,dbClient){
	var db = dbClient.db('test1')
	if(err) throw err;
	client.on('connection',function(socket){
		var col = db.collection('messages'),
		sendStatus = function(s){
			socket.emit('status',s);
		};
		col.find().limit(100).sort({_id:1}).toArray(function(err,res){
			if(err) throw err;
			socket.emit('output',res);
		});

		// Wait for input
		socket.on('input', function(data){
			var name = firstname;
			var message = data.message;
			whitespace = /^\s*$/;
			if(whitespace.test(name) || whitespace.test(message)) {
				sendStatus('Name and Message Required');
			} else {
				col.insert({name: name,message:message}, function(){
					// Emit latest messages to all clients
					client.emit('output',[data]);
					sendStatus({
						message:"Message sent",
						clear:true
					});
				});
			}
		});
	});

});
