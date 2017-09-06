var connection = require('./connection');
module.exports = {
	connection: connection,
	tables : {
		stock : 'stocks',
		log : 'logs' 
	},
	columns : {
		stock_id : 'stock_id',
		company_id : 'company_id',
		countries : 'countries',
		budget : 'budget',
		bid : 'bid',
		categories : 'categories',
		log_id : 'log_id',
		log_content : 'log_content'
	}
};

