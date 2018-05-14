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

  // Respond a GET request for the /cart page.
  // Display the shopping cart.
  app.get('/cart', function(req, res) {
    if (!req.session.user) {
      req.session.error = "You must login first!";
      res.redirect('/login');
    } else {
      var Cart = global.dbHelper.getModel('cart');
      // Find the items in the user's shopping cart.
      Cart.find({"username":req.session.user.username}, function (error, doc) {
        if (error) {
          req.session.error = "Network Error!";
          res.redirect('/');
        } else if (!doc) {
          req.session.error = "Error occurred!";
          res.redirect('/logout');
        } else {
          Cart.find({"uId":req.session.user._id}, function (error, docs) {
            res.render('cart', { "carts": docs, "isLogin": true,
            "firstname": req.session.user.firstname });
          });
        }
      });
    }
  });

  // Respond a GET request for the /addToCart/:id page.
  // Add a commodity to a cart.
  app.get("/addToCart/:id", function(req, res) {
    if(!req.session.user){
      req.session.error = "You must login first!";
      res.redirect('/login');
    } else{
      var Item = global.dbHelper.getModel('item'),
      Cart = global.dbHelper.getModel('cart');
      // Get the ID of the commodity through req.params.id
      Cart.findOne({
        "uId": req.session.user._id,
        "cId": req.params.id
      }, function(error, doc){
        // If the commodity already exists in the cart, increment cQuantity by 1.
        if (doc) {
          Cart.update({
            "uId":req.session.user._id,
            "cId":req.params.id
          }, {$set : { cQuantity : doc.cQuantity + 1 }}, function(error, doc) {
            // Redirect to /cart if success.
            if (doc > 0) {
              res.redirect('/cart');
            }
          });
        }
        // Otherwise, add it to the cart.
        else {
          Item.findOne({"_id": req.params.id}, function (error, doc) {
            if (doc) {
              Cart.create({
                uId: req.session.user._id,
                cId: req.params.id,
                cName: doc.name,
                cPrice: doc.price,
                cImgSrc: doc.type + '/' + doc.imgSrc,
                cQuantity : 1
              }, function (error, doc) {
                if (doc) {
                  res.redirect('/cart');
                }
              });
            }
          });
        }
      });
    }
  });

  // Respond a GET request for the /delFromCart/:id page.
  // Remove a commodity in a cart.
  app.get("/delFromCart/:id", function (req, res) {
    var Cart = global.dbHelper.getModel('cart');
    // Get the ID of the commodity through req.params.id
    Cart.deleteOne({"_id": req.params.id}, function (error,result) {
      // Redirect to /cart if success.
      if (result.ok == 1) {
        res.redirect('/cart');
      }
    });
  });

  // Respond a POST request for the /cart/clearing page.
  // Check out.
  app.post("/cart/clearing", function (req, res) {
    var Cart = global.dbHelper.getModel('cart');
    Cart.deleteMany({_id: req.body.id}, function (err) {
      if (err) console.log(err);
    });
  });

};
