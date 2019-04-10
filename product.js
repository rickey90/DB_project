module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    /*This function gets the product details of one product from the Product table*/
    function getOneProd(res, mysql, context, p_id, complete){
        var sql = "SELECT p_id, p_name, p_qty, p_mfg, price FROM Product WHERE p_id=?";
        var inserts = [p_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.oneProd = results[0];
            complete();
        });
    }    

    /*This function adds a product to product table*/
     function addProduct(req, res, mysql, complete, p_name, p_qty, p_mfg, price){
        var sql = "INSERT INTO Product(p_name, p_qty, p_mfg, price) VALUES(?, ?, ?, ?);";
        var inserts = [p_name, p_qty, p_mfg, price];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }



    /*Function deletes a category*/
    function deleteProduct(res, mysql, complete, p_id){
        var sql = "DELETE from Product WHERE p_id=?;";
        var inserts = [p_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            complete();
        });
    }

    /*Displays one product for updating*/
    router.get("/:p_id", function(req, res){
        callBackCnt = 0;
        var context = {};
        context.jsscripts = ["updateCustomer.js"];
        var mysql = req.app.get("mysql");
        getOneProd(res, mysql, context, req.params.p_id, complete);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.render("update_product", context);
            }
        }

    })

    /*Display products and their categories*/
    router.get("/", function(req, res){
    	var callBackCnt = 0;
    	var context = {};
    	context.jsscripts = ["deleteCart.js"];
    	var mysql = req.app.get("mysql");
        getProducts(res, mysql, context, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 1){
    			res.render("product", context);
    		}
    	}
    });

    /*Route to add a product to a customer's shopping cart*/
    router.post("/", function(req, res){
        var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
    	addProduct(req, res, mysql, complete, req.body.p_name, req.body.p_qty, req.body.p_mfg, req.body.price);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.redirect('/product');
            }
        }
    })

    /* Route that update data is sent to in order to update a product */
    router.put('/:p_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Product SET p_name=?, p_qty=?, p_mfg=?, price=? WHERE p_id=?";
        var inserts = [req.body.p_name, req.body.p_qty, req.body.p_mfg, req.body.price, req.params.p_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a product from Customer's shopping cart. */
    router.delete('/:p_id', function(req, res){
        var callBackCnt = 0;
        var mysql = req.app.get('mysql');
        deleteProduct(res, mysql, complete, req.params.p_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.status(202).end();
            }
        }
    })


    return router;

}();