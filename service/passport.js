const passport = require('passport');
const LocalStrategy = require('passport-local');

const localOptions = {
    passReqToCallback: true
}

const localLogin = new LocalStrategy(localOptions, function (req, username, password, done) {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT*FROM `sila-management`.`users` WHERE email=?;"
        connection.query(sql, [username], (err, results) => {
            if (err) return done(err, false)
            if (!results.length) return done(null, false)
            if (results[0].password !== password) {
                return done(null, false)
            } else {
                return done(null, results[0])
            }
        })
    })
})

passport.use(localLogin)