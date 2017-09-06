const Promise = require('es6-promise').Promise;
const common = require('../common');
const db = require('../db/database');
const _ = require('underscore');
const logger = require('../logger');
let allCompanies = common.default_companies;

module.exports = (request, response, next)=>{
    verifyParameters(request).then((missingParameters)=>{
        if(missingParameters.length > 0){
            response.send({code : 400, "response":"Missing parameters "+missingParameters.join()});
        }else{
            filterClientResponse(request, response);
        }
        next();
    }).catch((error)=>{
        console.error(error);
        response.send({code : 500, "response":error});
    });
};

function filterClientResponse(request, response){

    let baseTargeting = `SELECT * FROM ${db.tables.stock} 
    where ${db.columns.countries} like '%${request[common.param.country]}%' 
    AND ${db.columns.categories} like '%${request[common.param.category]}%'`;
    
    return db.connection.query(baseTargeting, (err, filtered) => {
        if (filtered) {
            createLog("BaseTargeting", filtered);
            if(filtered.length > 0){
                runBudgetCheck(request, filtered, response);
            }else{
                response.send({code : 200, "response":common.responses.no_target_match});
            }
        }
        if (err) {
            console.error(err);
            response.send({code : 400, "response":err});
        }
    });
}

function runBudgetCheck(request, filteredResult, response){
    let filtered = [];
    for(i in filteredResult){
        if(filteredResult[i][db.columns.budget] > 0){
            filtered.push(filteredResult[i]);
        }
    }
    
    createLog("BudgetCheck", filtered);

    if(filtered < 1)
        response.send({code : 200, "response":common.responses.no_budget_match});
    else
        runBaseBidCheck(request, filtered, response);
}

function runBaseBidCheck(request, filteredResult, response){
    let filtered = [];
    for(i in filteredResult){
        companyBid = parseInt(filteredResult[i][db.columns.bid]);
        baseBid = parseInt(request[common.param.bid]);
        if(companyBid >= baseBid){
            filtered.push(filteredResult[i]);
        }
    }
    createLog("BaseBid", filtered);

    if(filtered < 1)
        response.send({code : 200, "response":common.responses.no_bid_match});
    else
        shortList(request, filtered, response);
}

function shortList(request, filteredResult, response){
    filteredResult.sort(function (a, b) {
        return parseInt(b[db.columns.bid]) - parseInt(a[db.columns.bid]);
    });
    companyId = filteredResult[0][db.columns.company_id];
    logger(`Winner = ${companyId}`);
    let budget = parseInt(filteredResult[0][db.columns.budget]);
    let bid = parseInt(filteredResult[0][db.columns.bid]);
    newBudget = budget - bid;
    updateCompanyBudget(filteredResult[0][db.columns.stock_id], newBudget);
    response.send({code : 200, "response":companyId});
}

function updateCompanyBudget(recordId, newBudget){
    let updateQuery = `UPDATE ${db.tables.stock} SET ${db.columns.budget} = ${newBudget}
        WHERE ${db.columns.stock_id} = ${recordId}`;

        db.connection.query(updateQuery);
}

function createLog(filterType,filtered){
    
    newLogString = `${filterType}:`;
    for(companyIndex in allCompanies){
        companyId = allCompanies[companyIndex];
        if(inArray(companyId, filtered))
            newLogString += ` {${companyId}, Passed}`;
        else
            newLogString += ` {${companyId}, Failed}`;
    }
    logger(newLogString);
    
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i][db.columns.company_id] == needle)
            return true;
    }
    return false;
}

function verifyParameters(request){
    let missingParameters = [];
    let expectedParameters = [common.param.bid, common.param.category, common.param.country];
    return new Promise((resolve,reject)=>{

        for(i in expectedParameters){
            param = expectedParameters[i];
            if(request[param] == undefined){
                missingParameters.push(param);
            }
        }
    
        resolve(missingParameters);
    });
    
}