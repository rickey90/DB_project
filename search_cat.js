module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var context = {};



    /*This function gets all the categories*/
    function getCat(res, mysql, complete){
        mysql.pool.query("SELECT cat_id, cat_name FROM Category;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.category = results;
            complete();
        });
    }    

    /*This function gets all the products in a category*/
     function getProducts(req, res, mysql, complete, cat_id){
        var sql = "SELECT C.cat_id, C.cat_name, P.p_name, P.p_qty, P.p_mfg, P.price FROM Product P INNER JOIN  product_category PC ON P.p_id = PC.p_id INNER JOIN Category C ON PC.cat_id = C.cat_id WHERE C.cat_id=?;";
        var inserts = [cat_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }
            context.product = results;
            context.select = results[0];
            context.exists = 1;
            complete();
        });
    }


    /*Display products in a category*/
    router.get("/", function(req, res){
    	var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
        getCat(res, mysql, complete);
    	function complete(){
    		callBackCnt++;
    		if(callBackCnt >= 1){
    			res.render("search_cat", context);
    		}
    	}
    });

    /*Gets a category to display products*/
    router.post("/", function(req, res){
        context = {};
        var callBackCnt = 0;
    	var mysql = req.app.get("mysql");
    	getProducts(req, res, mysql, complete, req.body.cat_id);
        function complete(){
            callBackCnt++;
            if(callBackCnt >= 1){
                res.redirect('/search_cat');
            }
        }
    })

    return router;

}();