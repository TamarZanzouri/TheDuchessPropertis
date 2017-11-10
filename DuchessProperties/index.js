var csv = require('csv'); 
var fs = require('fs');
var utils = require('./utils.js');
var DAL = require('./DAL.js')
//csv reader
var obj = csv(); 
//csv row constructor
function CSVRow(loadID, maturityDate, completionDate, currentIndex, currentMargin, currentInterestRate, currentLTV, originalLTV, CMS, incomeBorrower1, incomeBorrower2, fitchProductCategory) {
    this.loadID = loadID;
    this.maturityDate = utils.parseDate(maturityDate);
    this.completionDate = utils.parseDate(completionDate);
    this.currentIndex = currentIndex;
    this.currentMargin = parseFloat(currentMargin);
    this.currentInterestRate = parseFloat(currentInterestRate);
    this.currentLTV = parseFloat(currentLTV);
    this.originalLTV = parseFloat(originalLTV);
    this.CMS = parseFloat(CMS);
    this.incomeBorrower1 = parseFloat(incomeBorrower1);
    this.incomeBorrower2 = parseFloat(incomeBorrower2);
    this.fitchProductCategory = fitchProductCategory;
    this.loadExceptionRepresentation = '';
    this.loadGrad = 0;
    this.exceptionIDs = [];
}; 

var currentDirectory = process.cwd();
//array of CSVRow objects
var csvRows = []
//array of loan ratings
var gradeArray = [];
var csvHeader = ['Load ID', 'Loan Grad', 'Exception IDs']; 
gradeArray.push(csvHeader);

obj.from.path(currentDirectory + '/loan_data.csv').to.array(function (data) {
    for (var index = 1; index < data.length; index++) {
        var row = new CSVRow(data[index][2], data[index][18], data[index][16], data[index][20], data[index][23], data[index][22], data[index][9], data[index][10], data[index][8], data[index][38], data[index][39], data[index][13]);
        DAL.calcLoanExceptions(row);
        csvRows.push(row);
        gradeArray.push([row.loadID, row.loadGrad, row.loadExceptionRepresentation])
    }
    console.log(gradeArray);
    writeDataToFile();
});

var writeDataToFile = function(){
    var file = fs.createWriteStream('loan_rating.csv');
    file.on('error', function(err) { /* error handling */ });
    gradeArray.forEach(function(v) { file.write(v.join(', ') + '\n'); });
    file.end();
}

