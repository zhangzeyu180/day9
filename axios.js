const axios = require('axios');

axios.get('/user?ID=123').then(function(res){
    console.log(res);
})

axios.get('/user', {
    params: {
        ID: 123
    }
})

axios.post('/user',{
    firstName:'Fred',
}).then(function (res){
    console.log(res)
})

