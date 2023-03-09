const bcrypt = require('bcrypt')

exports.hashFunc = (pw, salt) => {
    console.log('ran hashFunc')
    return new Promise((resolve, reject) => {
        bcrypt.hash(pw, salt, function(err, hash) {
            if(err){
                console.log('err is ', err)
                reject(err)
            } else 
            {
                console.log('hash ran here',hash)
                resolve(hash)
            }
        })
    })
    
}