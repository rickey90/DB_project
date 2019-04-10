module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    function getOneCust(res, mysql, context, id, complete){
    	var sql = "SELECT cust_id, f_name, l_name, email, street_address, city, state, zip, ph_num FROM Customer WHERE cust_id = ?";
    	var inserts = [id];
    	mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.oneCust = results[0];
            complete();
        });
    }

    /*Displays one customer for updating*/
    router.get("/:id", function(req, res){
    	callBackCnt = 0;
    	var context = {};
    	context.jsscripts = ["updateCustomer.js"];
    	var mysql = req.app.get("mysql");
    	getOneCust(res, mysql, context, req.params.id, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 1){
    			res.render("update-customer", context);
    		}
    	}

    })

    /*Display customers*/
    router.get("/", function(req, res){
    	var callBackCnt = 0;
    	var context = {};
    	context.jsscripts = ["deleteCustomer.js"];
    	var mysql = req.app.get("mysql");
    	getCustomers(res, mysql, context, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 1){
    			res.render("customer", context);
    		}
    	}
    });

    /*Adds a customer, and returns to the customer page after adding*/
    router.post("/", function(req, res){
    	var mysql = req.app.get("mysql");
    	var sql = "INSERT INTO Customer(f_name, l_name, email, street_address, city, state, zip, ph_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    	var inserts = [req.body.f_name, req.body.l_name, req.body.email, req.body.street_address, req.body.city, req.body.state, req.body.zip, req.body.ph_num];
    	sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customer');
            }
        });
    })

    /* Route that update data is sent to in order to update a customer */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Customer SET f_name=?, l_name=?, email=?, street_address=?, city =?, state=?, zip=?, ph_num=? WHERE cust_id=?";
        var inserts = [req.body.f_name, req.body.l_name, req.body.email, req.body.street_address, req.body.city, req.body.state, req.body.zip, req.body.ph_num, req.params.id];
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

    /* Route to delete a Customer. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE from Customer WHERE cust_id = ?";
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