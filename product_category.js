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

    /*This function gets all the categories*/
    function getCat(res, mysql, context, complete){
        mysql.pool.query("SELECT cat_id, cat_name FROM Category;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.category = results;
            complete();
        });
    }    

    /*This function gets all the products and their categories (M-to-M relationship)*/
    function getProdCat(res, mysql, context, complete){
        mysql.pool.query("SELECT P.p_id, C.cat_id, P.p_name, C.cat_name FROM Product P INNER JOIN product_category PC ON P.p_id = PC.p_id INNER JOIN Category C ON PC.cat_id = C.cat_id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.product_category = results;
            complete();
        });
    }    

    /*This function adds an instance to product_category table*/
     function addProdCat(req, res, mysql, complete, p_id, cat_id){
        var sql = "INSERT INTO product_category(p_id, cat_id) VALUES(?, ?);";
        var inserts = [p_id, cat_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }



    /*Function deletes product from customer cart*/
    function deleteProdCat(res, mysql, complete, p_id, cat_id){
        var sql = "DELETE from product_category WHERE p_id=? AND cat_id=?;";
        var inserts = [p_id, cat_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            complete();
        });
    }


    /*Display products and their categories*/
    router.get("/", function(req, res){
    	var callBackCnt = 0;
    	var context = {};
    	context.jsscripts = ["deleteCart.js"];
    	var mysql = req.app.get("mysql");
        getProducts(res, mysql, context, complete);
        getCat(res, mysql, context, complete);
        getProdCat(res, mysql, context, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 3){
    			res.render("product_category", context);
    		}
    	}
    });

    /*Route to add a product to a customer's shopping cart*/
    router.post("/", function(req, res){
        var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
    	addProdCat(req, res, mysql, complete, req.body.p_id, req.body.cat_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.redirect('/product_category');
            }
        }
    })

    /* Route to delete a product from Customer's shopping cart. */

    router.delete('/pid/:p_id/cid/:cat_id', function(req, res){
        var callBackCnt = 0;
        var mysql = req.app.get('mysql');
        deleteProdCat(res, mysql, complete, req.params.p_id, req.params.cat_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.status(202).end();
            }
        }
    })


    return router;

}();