exports.validateMaturityCompletionDate = function(row){
    return row.maturityDate < row.completionDate;
}

exports.validateMargin = function(row){
    return row.currentIndex === 'FIX' && row.currentMargin != row.currentInterestRate;
}

exports.validateLTV = function(row){
    return row.currentLTV > row.originalLTV;
}

exports.validateMothlyIncome = function(row){
    return row.CMS > ((row.incomeBorrower1 + row.incomeBorrower2)/12);
}