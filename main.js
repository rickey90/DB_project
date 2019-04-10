var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use('/customer', require('./customer.js'));
app.use('/shopping_cart', require('./shopping_cart.js'));
app.use('/shoppingCart_product', require('./shoppingCart_product.js'));
app.use('/product_category', require('./product_category.js'));
app.use('/purchase_record', require('./purchase_record.js'));
app.use('/precord_product', require('./precord_product.js'));
app.use('/category', require('./category.js'));
app.use('/product', require('./product.js'));
app.use('/search_cat', require('./search_cat.js'));
app.use('/cust_sc', require('./cust_sc.js'));
app.use('/cust_total', require('./cust_total.js'));
app.use('/search_pr', require('./search_pr.js'));
app.use('/', express.static('public'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});