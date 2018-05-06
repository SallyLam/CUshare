/*
	ARTs E-commerce Transactions Platform

  	ARTs E-commerce Transactions Platform is an internet-based sales services for small
	businesses and individual entrepreneurs to run online stores for artwork. It applies
	the technologies of database, website design and mobile application development.
	ARTs aims to provide a convenient platform to carry out transactions on the specific area of artworks and to improve users' quality of life.


  	@category   View
  	@author     Xinyu (Cynric) Fu 		<xyfu6@cse.cuhk.edu.hk>
  	@author     Zhanhao (Jasper) Liu 	<zhliu6@cse.cuhk.edu.hk>
  	@author     Shinmin (Sally) lin 	<smlin6@cse.cuhk.edu.hk>
  	@author     Jiamin (Vito) Chen 		<jmchen6@cse.cuhk.edu.hk>
  	@author     PengCheng (Ben) Xu 		<pcxu6@cse.cuhk.edu.hk>
 	  @copyright  2017 ClubAce(group6)
 	  @license    https://opensource.org/licenses/MIT
  	@version    1.2.0	14-4-2017
  	@link       https://bitbucket.org/group06_csci3100_2017/arts

*/


module.exports = {
    user: {
        username: { type: String, required: true },
        pwd: { type: String, required: true },
        email: { type: String, required: true },
        firstname: String,
        lastname: String,
        phone: String,
        address: String
    },
    item: {
        name: String,
        type: String,
        price: Number,
        imgSrc: String
    },
    cart:{
        uId: { type: String },
        cId: { type: String },
        cName: { type: String },
        cPrice: { type: String },
        cImgSrc: { type:String } ,
        cQuantity: { type: Number }
    }
};
