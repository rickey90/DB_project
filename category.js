module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    /*This function adds a category to category table*/
     function addCat(req, res, mysql, complete, cat_name){
        var sql = "INSERT INTO Category(cat_name) VALUES(?);";
        var inserts = [cat_name];
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
    function deleteProdCat(res, mysql, complete, cat_id){
        var sql = "DELETE from Category WHERE cat_id=?;";
        var inserts = [cat_id];
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
        getCat(res, mysql, context, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 1){
    			res.render("category", context);
    		}
    	}
    });

    /*Route to add a product to a customer's shopping cart*/
    router.post("/", function(req, res){
        var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
    	addCat(req, res, mysql, complete, req.body.cat_name);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.redirect('/category');
            }
        }
    })

    /* Route to delete a product from Customer's shopping cart. */
    router.delete('/:cat_id', function(req, res){
        var callBackCnt = 0;
        var mysql = req.app.get('mysql');
        deleteProdCat(res, mysql, complete, req.params.cat_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.status(202).end();
            }
        }
    })


    return router;

}();