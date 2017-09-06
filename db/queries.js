const db = require('./database');
const status = require('../service/glo/status');

module.exports = {
	'get_service_by_name' : `SELECT * FROM ${db.tables.service} WHERE keyword = `+
									`'%s' AND smsc = '%s' AND service_status = 'active'`,
	'glo_get_existing_sub' : (msisdn,serviceId)=>{
		return `SELECT * FROM ${db.tables.glo.subscription} WHERE msisdn = '${msisdn}' 
				 AND service_id = ${serviceId} 
			    AND user_status IN (${status.ACTIVE},${status.UN_BILLED})`
	},
	'glo_insert_subscription' : (params)=>{
		return `INSERT into ${db.tables.glo.subscription} 
				  (msisdn,service_id,user_status, service_duration, service_trial_duration) 
				  values (${params.msisdn},${params.service_id}, ${status.UN_BILLED}, 5, 2)`;
	},
	'glo_set_status_to_unbilled' : (id)=>{
		return `UPDATE ${db.tables.glo.subscription} SET user_status = ${status.UN_BILLED} 
							WHERE id = ${id}`
	}
}