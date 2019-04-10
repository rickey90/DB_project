module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /*This function gets all the customers*/
    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT cust_id, f_name, l_name, email, street_address, city, state, zip, ph_num FROM Customer", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results;
            complete();
        });
    }

    /*This function gets all the instances in the purchase_record entity*/
    function getPurRec(res, mysql, context, complete){
        mysql.pool.query("SELECT C.f_name, C.l_name, purchase_id, PR.cust_id, date, time FROM Purchase_record PR INNER JOIN Customer C ON PR.cust_id = C.cust_id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.purchase_record = results;
            complete();
        });
    }    

    /*This function adds an instance to purchase_record table*/
     function addPurRec(req, res, mysql, complete, cust_id, date, time){
        var sql = "INSERT INTO Purchase_record(cust_id, date, time) VALUES (?, ?, ?);";
        var inserts = [cust_id, date, time];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            complete();
        });
    }


    /*Function deletes a customer purchase record*/
    function deletePurRec(res, mysql, complete, purchase_id, cust_id){
        var sql = "DELETE from Purchase_record WHERE purchase_id=? AND cust_id=?;";
        var inserts = [purchase_id, cust_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }
            complete();
        });
    }


    /*Display all customer purchase records*/
    router.get("/", function(req, res){
    	var callBackCnt = 0;
    	var context = {};
    	context.jsscripts = ["deleteCart.js"];
    	var mysql = req.app.get("mysql");
        getCustomers(res, mysql, context, complete);
        getPurRec(res, mysql, context, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 2){
    			res.render("purchase_record", context);
    		}
    	}
    });

    /*Route to add a product to a customer's shopping cart*/
    router.post("/", function(req, res){
        var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
    	addPurRec(req, res, mysql, complete, req.body.cust_id, req.body.date, req.body.time);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.redirect('purchase_record');
            }
        }
    })

    /* Route to delete a product from Customer's shopping cart. */

    router.delete('/pid/:purchase_id/cid/:cust_id', function(req, res){
        var callBackCnt = 0;
        var mysql = req.app.get('mysql');
        deletePurRec(res, mysql, complete, req.params.purchase_id, req.params.cust_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.status(202).end();
            }
        }
    })


    return router;

}();