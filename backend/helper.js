const filterByField = (arr, field, value) => {
    return arr.filter(x => x[field].toLowerCase().indexOf(value.toLowerCase()) !== -1);
}

const isEmpty = (x) => {
    return x === undefined || x === '' || x === null;
}


module.exports = {
    filterByField,
    isEmpty
}