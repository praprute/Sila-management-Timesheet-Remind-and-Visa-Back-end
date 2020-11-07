const controller = require('./controller/controllers');
const passport = require('passport')
const passportService = require('./service/passport')
const {requireSignin} = require('./controller/controllers') 

module.exports = function(app){
    app.post('/api/signin', controller.signin)
    app.post('/api/register', controller.register)
    app.get('/api/signout', controller.signout)
    app.post('/api/checkStatus', controller.isAuthorAdmin)
    app.post('/api/insertWork', requireSignin, controller.insertWork)
    app.post('/api/fetchworkAuth', requireSignin, controller.fetchworkAuth)
    app.post('/api/fetchworkAdmin', requireSignin, controller.fetchworkAdmin)
    app.post('/api/fetchpartner',requireSignin, controller.fetchpartner)
    app.post('/api/DeleteIndex', requireSignin, controller.DeleteIndex)


    app.post('/api/uploadReminder', requireSignin, controller.uploadReminder)
    app.post('/api/fetchImage', requireSignin, controller.fetchImage)
    app.post('/api/fetchRemindAdmin', requireSignin, controller.fetchRemindAdmin)
    app.post('/api/fetchRemindUser', requireSignin, controller.fetchRemindUser)
    app.post('/api/deleteRemind', requireSignin, controller.deleteRemind)
    app.post('/api/fetchRemindUserByIdforUpdate', requireSignin, controller.fetchRemindUserByIdforUpdate)
    app.post('/api/updateRemind', requireSignin, controller.updateRemind)

}