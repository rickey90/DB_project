module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var context = {};



    /*This function gets all customers with purchase records*/
    function getCustomers(res, mysql, complete){
        mysql.pool.query("SELECT DISTINCT C.f_name, C.l_name, PR.cust_id FROM Purchase_record PR INNER JOIN Customer C ON PR.cust_id = C.cust_id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results;
            complete();
        });
    }    

    /*This function gets all the purchase records of a customer*/
     function getRecords(req, res, mysql, complete, cust_id){
        var sql = "SELECT C.f_name, C.l_name, purchase_id, PR.cust_id, date, time FROM Purchase_record PR INNER JOIN Customer C ON PR.cust_id = C.cust_id WHERE C.cust_id=?;";
        var inserts = [cust_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            context.record = results;
            context.select = results[0];
            complete();
        });
    }


    /*Display all purchase records of a customer*/
    router.get("/", function(req, res){
    	var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
        getCustomers(res, mysql, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 1){
    			res.render("search_pr", context);
    		}
    	}
    });

    /*Gets a customer to display their purchase records*/
    router.post("/", function(req, res){
        context = {};
        var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
    	getRecords(req, res, mysql, complete, req.body.cust_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.redirect('/search_pr');
            }
        }
    })

    return router;

}();