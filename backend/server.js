const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');
const fs = require('fs');
const { filterByField, isEmpty, filterAll } = require('./helper');

// load middleware
app.use(cors());


// router here
app.get('/', (req, res) => {
    res.send('server OK');
})

// **** STYL - test route

app.get('/api/Users/GetUsers', (req, res) => {
    // get all users from json file
    const data = fs.readFileSync('./db/user-data.json');
    const allUsers = JSON.parse(data);

    // query
    const globalFilter = req.query.GlobalFilter;
    const firstName = req.query.first_name;
    const lastName = req.query.last_name;
    const email = req.query.email;
    const gender = req.query.gender;
    const ipAddress = req.query.ip_address;
    const start = parseInt(req.query.SkipCount);
    const end = start + parseInt(req.query.MaxResultCount);

    let result = [];

    const isNotFiltering = isEmpty(globalFilter) && isEmpty(firstName) && isEmpty(lastName) && isEmpty(email) && isEmpty(gender) && isEmpty(ipAddress);
    if (isNotFiltering) {
        for (let i = start; i < end; i++) {
            if (allUsers[i]) {
                result.push(allUsers[i]);
            }
        }
    } else {
        let tmp = [...allUsers];
        // filter
        if (!isEmpty(firstName))
            tmp = filterByField(tmp, 'first_name', firstName);
        if (!isEmpty(lastName))
            tmp = filterByField(tmp, 'last_name', lastName);
        if (!isEmpty(email))
            tmp = filterByField(tmp, 'email', email);
        if (!isEmpty(gender))
            tmp = filterByField(tmp, 'gender', gender);
        if (!isEmpty(ipAddress))
            tmp = filterByField(tmp, 'ip_address', ipAddress);
        if (!isEmpty(globalFilter)) {
            tmp = filterByGlobalString(tmp, globalFilter);
        }

        for (let i = start; i < end; i++) {
            if (tmp[i]) {
                result.push(tmp[i]);
            }
        }
    }
    res.send(result);
})

const filterByGlobalString = (tmp, globalFilter) => {
    let newTmp = [];
    tmp.forEach(element => {
        if (filterOneUser(element, globalFilter)) {
            newTmp.push(element);
        }
    })
    return newTmp;
}

const filterOneUser = (user, globalFilter) => {
        if (user.first_name.toLowerCase().indexOf(globalFilter.toLowerCase()) !== -1 ||
            user.last_name.toLowerCase().indexOf(globalFilter.toLowerCase()) !== -1 ||
            user.email.toLowerCase().indexOf(globalFilter.toLowerCase()) !== -1 ||
            user.gender.toLowerCase().indexOf(globalFilter.toLowerCase()) !== -1 ||
            user.ip_address.toLowerCase().indexOf(globalFilter.toLowerCase()) !== -1) {
            return true;
        }
        return false;
    }
    // **** End STYL - test route

// connection
app.listen(port, () => {
    console.log(`Port ${port} is running ...`)
})