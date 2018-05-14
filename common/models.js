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

	@copyright  2018 CSCI4140 Group 1
	@license    https://opensource.org/licenses/MIT
	@version    1.2.0	5-5-2018
	@link       https://github.com/SallyLam/CUshare

*/


module.exports = {
  user: {
    username: { type: String, required: true, unique: true },
    pwd: { type: String, required: true },
    email: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String },
    phone: { type: String },
    address: { type: String }
  },
  item: {
    name: { type: String },
    type: { type: String },
    price: { type: Number },
    description: { type: String },
    imgSrc: { type: String },
    uUName: { type: String },  // user's username
    uFName: { type: String },  // user's firstname
    sellBuy: { type: Boolean, default: true }  // true if selling, otherwise buying
  },
  /*
  cart: {
    uId: { type: String },
    cId: { type: String },
    cName: { type: String },
    cPrice: { type: String },
    cImgSrc: { type: String },
    cQuantity: { type: Number }
  },*/
  comment: {
    isAnonymous: { type: Boolean },
    uId: { type: String },  // user's _id (can be replaced by username)
    uFName: { type: String },  // user's firstname
    cId: { type: String },
    content: { type: String }
  }
};
