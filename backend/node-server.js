const MongoController = require('./mongo-controller').MongoController
const ApiManager = require('./api/api').ApiManager

const url = 'mongodb://localhost:27017/'
const databaseName = 'botto-db'

var mongoController = new MongoController(url, databaseName)

function startNode(){
    try{  
        var apiListener = new ApiManager(mongoController)
        apiListener.start()
    }
    catch(err){
        console.log(err)
        setTimeout(() => {
            console.log()
            console.log('Retring...')
            console.log()
            startNode();
        },2*1000)
    }
}

startNode();