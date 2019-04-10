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


    /*This function gets the total from a customer's shopping cart*/
     function getTotal(req, res, mysql, complete, cust_id){
        var sql = "SELECT SC.total, C.f_name, C.l_name FROM Shopping_cart SC INNER JOIN Customer C ON SC.cust_id = C.cust_id WHERE C.cust_id=?;";
        var inserts = [cust_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            context.total = results[0];
            context.select = 1;
            complete();
        });
    }


    /*Display total in a customer's shopping cart*/
    router.get("/", function(req, res){
    	var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
        getCustomers(res, mysql, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 1){
    			res.render("cust_total", context);
    		}
    	}
    });

    /*Route to get a customer to display total in their shopping cart*/
    router.post("/", function(req, res){
        context = {};
        var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
    	getTotal(req, res, mysql, complete, req.body.cust_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.redirect('/cust_total');
            }
        }
    })

    return router;

}();