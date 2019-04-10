module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var context = {};


    /*This function gets all the customers*/
    function getCustomers(res, mysql, complete){
        mysql.pool.query("SELECT C.cust_id, C.f_name, C.l_name FROM Shopping_cart SC INNER JOIN Customer C ON SC.cust_id = C.cust_id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results;
            complete();
        });
    }


    /*This function gets all the products in a customer's shopping cart*/
     function getProducts(req, res, mysql, complete, cust_id){
        var sql = "SELECT C.f_name, C.l_name, P.p_name, P.price FROM shoppingCart_product SCP INNER JOIN Product P ON SCP.p_id = P.p_id INNER JOIN Customer C ON SCP.cust_id = C.cust_id WHERE C.cust_id=?;";
        var inserts = [cust_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            context.product = results;
            context.select = results[0];
            context.hasCart = 1;
            complete();
        });
    }


    /*Display products in a customer's shopping cart*/
    router.get("/", function(req, res){
    	var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
        getCustomers(res, mysql, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 1){
    			res.render("cust_sc", context);
    		}
    	}
    });

    /*Route to get a customer to display their shopping cart*/
    router.post("/", function(req, res){
        context = {};
        var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
    	getProducts(req, res, mysql, complete, req.body.cust_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.redirect('/cust_sc');
            }
        }
    })

    return router;

}();