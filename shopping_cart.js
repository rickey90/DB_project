module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCarts(res, mysql, context, complete){
    	mysql.pool.query("SELECT C.cust_id, f_name, l_name, total FROM Shopping_cart SC INNER JOIN Customer C ON SC.cust_id = C.cust_id;", function(error, results, fields){
    		if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results;
            complete();
    	});
    }

    function noCarts(res, mysql, context, complete){
        mysql.pool.query("SELECT C.cust_id, f_name, l_name FROM Customer C LEFT JOIN Shopping_cart SC ON C.cust_id=SC.cust_id WHERE SC.cust_id IS NULL", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.noCart = results;
            complete();
        });
    }    

    /*Display the shopping carts of customers*/
    router.get("/", function(req, res){
    	var callBackCnt = 0;
    	var context = {};
    	context.jsscripts = ["deleteCart.js"];
    	var mysql = req.app.get("mysql");
    	getCarts(res, mysql, context, complete);
        noCarts(res, mysql, context, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 2){
    			res.render("shopping_cart", context);
    		}
    	}
    });

    /*Adds a shopping cart to a customer, and returns to the shopping cart page after adding*/
    router.post("/", function(req, res){
    	var mysql = req.app.get("mysql");
    	var sql = "INSERT INTO Shopping_cart(cust_id, total) VALUES (?, ?);";
    	var inserts = [req.body.cust_id, 0];
    	sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/shopping_cart');
            }
        });
    })

    /* Route to delete a Customer's shopping cart. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE from Shopping_cart WHERE cust_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;

}();