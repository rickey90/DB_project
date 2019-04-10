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

    /*This function gets all the purchse records*/
    function getRecords(res, mysql, context, complete){
        mysql.pool.query("SELECT C.f_name, C.l_name, purchase_id, PR.cust_id, date, time FROM Purchase_record PR INNER JOIN Customer C ON PR.cust_id = C.cust_id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.record = results;
            complete();
        });
    }    

    /*This function gets all the products in every purchase record (M-to-M relationship)*/
    function getRecProd(res, mysql, context, complete){
        mysql.pool.query("SELECT PR.purchase_id, C.cust_id, C.f_name, C.l_name, P.p_id, P.p_name, P.price FROM precord_product PP INNER JOIN Purchase_record PR ON PP.purchase_id = PR.purchase_id INNER JOIN Customer C ON PR.cust_id = C.cust_id INNER JOIN Product P ON PP.p_id = P.p_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.precord_product = results;
            complete();
        });
    }    

    /*This function adds an instance to precord_product table*/
     function addRecProd(req, res, mysql, complete, purchase_id, p_id){
        var sql = "INSERT INTO precord_product(purchase_id, p_id) VALUES(?, ?);";
        var inserts = [purchase_id, p_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }



    /*Function deletes a product from a customer's purchase record*/
    function deleteRecProd(res, mysql, complete, purchase_id, p_id){
        var sql = "DELETE from precord_product WHERE purchase_id=? and p_id=?;";
        var inserts = [purchase_id, p_id];
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
        getRecords(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
        getRecProd(res, mysql, context, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 3){
    			res.render("precord_product", context);
    		}
    	}
    });

    /*Route to add a product to a customer's purchase record*/
    router.post("/", function(req, res){
        var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
    	addRecProd(req, res, mysql, complete, req.body.purchase_id, req.body.p_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.redirect('/precord_product');
            }
        }
    })

    /* Route to delete a product from Customer's purchase record. */
    router.delete('/purid/:purchase_id/pid/:p_id', function(req, res){
        var callBackCnt = 0;
        var mysql = req.app.get('mysql');
        deleteRecProd(res, mysql, complete, req.params.purchase_id, req.params.p_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.status(202).end();
            }
        }
    })


    return router;

}();