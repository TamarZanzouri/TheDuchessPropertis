var validate = require('./validations.js');
var fs = require('fs');

var currentDirectory = process.cwd();
//load json file with exceptions rating
var exceptionsRating = JSON.parse(fs.readFileSync(currentDirectory + '/exceptionsRating.json', 'utf8'));

var calculateLoanRate = function(row){
    row.exceptionIDs.forEach(function(element, index) {
        if(index == 0){
            row.loadExceptionRepresentation += '' + element + '';
        }
        else{
            row.loadExceptionRepresentation += '|' + element;
        }

        var exceptionRates = findException(element);
        if(element != 4)
            row.loadGrad += getRate(exceptionRates, row.fitchProductCategory);
        else
        {
            var totalMonthlyIncome = (row.incomeBorrower1 + row.incomeBorrower2)/12;
            var difference = row.CMS - totalMonthlyIncome;
            var percent   =   difference / row.CMS  * 100;
            row.loadGrad += getRateByPercent(percent, exceptionRates,row.fitchProductCategory);
        }   
    }, this);
}


exports.calcLoanExceptions = function(row){
    if(validate.validateMaturityCompletionDate(row)){
        row.exceptionIDs.push(1);
    }
    if(validate.validateMargin(row)){
        row.exceptionIDs.push(2);
    }
    if(validate.validateLTV(row)){
        row.exceptionIDs.push(3);
    }
    if(validate.validateMothlyIncome(row)){
        row.exceptionIDs.push(4);
    }
    calculateLoanRate(row);
}

var getRateByPercent = function(percent, rates, category){
    var categoryRates = rates.find(value => value.category === category).rates;
    for(var j=0; j < categoryRates.length; j++){
        if(parseFloat(categoryRates[j].minPercent) <= percent && percent <= parseFloat(categoryRates[j].maxPercent)){
            return parseInt(categoryRates[j].rate); 
        }
    }
}

var getRate = function(rates, category){
    return parseInt(rates.find(value => value.productCategory === category).rate);
}

var findException = function(element){
    var exceptionRates = exceptionsRating.find(value => parseInt(value.exceptionID) === element);
    return element != 4 ? exceptionRates.rates : exceptionRates.productCategorys;
}