module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*This function gets the customers who have a Shopping Cart*/
    function getCustomers(res, mysql, context, complete){
    	mysql.pool.query("SELECT C.cust_id, f_name, l_name, total FROM Shopping_cart SC INNER JOIN Customer C ON SC.cust_id = C.cust_id", function(error, results, fields){
    		if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results;
            complete();
    	});
    }

    /*This function gets all the products*/
    function getProducts(res, mysql, context, complete){
    	mysql.pool.query("SELECT p_id, p_name, p_qty, p_mfg, price FROM Product", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.product = results;
            complete();
        });
    }

    /*Function gets products in cart info*/
    function getCart(res, mysql, context, complete){
        mysql.pool.query("SELECT SCP.cust_id, SCP.p_id, C.cust_id, C.f_name, C.l_name, P.p_name, P.price  FROM shoppingCart_product SCP INNER JOIN Shopping_cart SC on SCP.cust_id = SC.cust_id INNER JOIN Customer C ON SC.cust_id = C.cust_id INNER JOIN Product P ON SCP.p_id = P.p_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.cart = results;
            complete();
        });
    }

     function addProduct(req, res, mysql, complete, p_id, cust_id){
        //var mysql = req.app.get("mysql");
        var sql = "INSERT INTO shoppingCart_product(cust_id, p_id) VALUES (?, ?)";
        var inserts = [cust_id, p_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    /*Function updates the total in customer cart when a product is added*/
    function addTotal(res, mysql, complete, p_id, cust_id){
        var sql = "UPDATE Shopping_cart SET total = total + (SELECT price FROM Product WHERE p_id=?) WHERE cust_id=?;";
        var inserts = [p_id, cust_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    /*Function decrements the quantity in stock when a product is added to the cart*/
    function decQty(res, mysql, complete, p_id){
        var sql = "UPDATE Product SET p_qty = p_qty - 1 WHERE p_id =?;";
        var inserts = [p_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    /*Function deletes product from customer cart*/
    function deleteProduct(res, mysql, complete, p_id, cust_id){
        var sql = "DELETE from shoppingCart_product WHERE cust_id=? AND p_id=?";
        var inserts = [cust_id, p_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            complete();
        });
    }

    /*Function updates the total in customer cart when a product is deleted*/
    function decTotal(res, mysql, complete, p_id, cust_id){
        var sql = "UPDATE Shopping_cart SET total = total - (SELECT price FROM Product WHERE p_id=?) WHERE cust_id=?;";
        var inserts = [p_id, cust_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    /*Function increments the quantity in stock when a product is deleted from a cart*/
    function incQty(res, mysql, complete, p_id){
        var sql = "UPDATE Product SET p_qty = p_qty + 1 WHERE p_id =?;";
        var inserts = [p_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }

    /*Display contents of customer shopping cart*/
    router.get("/", function(req, res){
    	var callBackCnt = 0;
    	var context = {};
    	context.jsscripts = ["deleteCart.js"];
    	var mysql = req.app.get("mysql");
    	getCustomers(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
        getCart(res, mysql, context, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 3){
    			res.render("shoppingCart_product", context);
    		}
    	}
    });

    /*Route to add a product to a customer's shopping cart*/
    router.post("/", function(req, res){
        var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
    	addProduct(req, res, mysql, complete, req.body.p_id, req.body.cust_id);
        addTotal(res, mysql, complete, req.body.p_id, req.body.cust_id);
        decQty(res, mysql, complete, req.body.p_id)
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 3){
                res.redirect('/shoppingCart_product');
            }
        }
    })

    /* Route to delete a product from Customer's shopping cart. */

    router.delete('/pid/:p_id/cid/:cust_id', function(req, res){
        var callBackCnt = 0;
        var mysql = req.app.get('mysql');
        deleteProduct(res, mysql, complete, req.params.p_id, req.params.cust_id);
        decTotal(res, mysql, complete, req.params.p_id, req.params.cust_id);
        incQty(res, mysql, complete, req.params.p_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 3){
                res.status(202).end();
            }
        }
    })


    return router;

}();