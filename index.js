var fs = require('fs');
var cheerio = require('cheerio');
var requestPromise = require('request-promise');
var moment = require('moment');

setInterval(checkCurrentProduct, 1000);

var previousProduct;
function checkCurrentProduct(){
	getCurrentProduct()
		.then(function(currentProduct){
			if(!previousProduct || currentProduct.title !== previousProduct.title){
				previousProduct = currentProduct;

				logProduct(currentProduct);
			}
		});
}

function getCurrentProduct(){
	return requestPromise('http://www.ibood.com/nl/nl/')
		.then(function(html){
			var $ = cheerio.load(html);
			return {
				title: $('#link_product').text(),
				price: $('#content .prices .price > span').text()
			};
		});
}

function logProduct(product){
	var message = moment().format('HH:mm:ss - ') + product.price + ' - ' + product.title;

	console.log(message);
	fs.appendFile('log.txt', message + '\r\n');
}
