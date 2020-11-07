const jwt = require('jsonwebtoken')
const config = require('./../confix')
const expressJwt = require('express-jwt')
const AWS = require('aws-sdk')
const formidable = require("formidable");

AWS.config.update({
    accessKeyId: config.ACCESS_KEY, // <<=== เก็บ config ไว้ใน .env
    secretAccessKey: config.SECRET_KEY // <<=== เก็บ config ไว้ใน .env
});

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com'); // <<=== เก็บ config ไว้ใน .env
const s3 = new AWS.S3({
    endpoint: spacesEndpoint
  });

exports.signin = (req, res, next) => {
    var {
        body
    } = req;

    var email = body.email;
    var password = body.password;

    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT*FROM `sila-management`.`users` WHERE email=? ;"
        connection.query(sql, [email], (err, results) => {
            if (err) {
                return next(err)
            }

            if (!results.length) {
                res.json({
                    success: "error",
                    message: null,
                    message_th: "ไม่พบบัญชีผู้ใช้"
                })
            }
            if (results[0].password !== password) {
                res.json({
                    success: "error",
                    message: null,
                    message_th: "รหัสผ่านไม่ถูกต้อง"
                })
            } else {
                const token = jwt.sign({
                    id: results.id
                }, config.secret)
                res.cookie('t', token, {
                    expire: new Date() + 9999
                })
                res.json({
                    success: "success",
                    user: {
                        idusers: results[0].idusers,
                        email: results[0].email,
                        name: results[0].name,
                        role: results[0].role,
                    },
                    token: token,
                    message_th: "login success",
                })
            }
        })
    })
}

exports.requireSignin = expressJwt({
    secret: config.secret,
    userProperty: "auth",
    algorithms: ['sha1', 'RS256', 'HS256'],
});

exports.isAuthorAdmin = (req, res, next) => {

    var {
        body
    } = req
    var email = body.email

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "SELECT `users`.role FROM `sila-management`.`users` \
        WHERE `users`.email = ? "

        connection.query(sql, [email], (err, results) => {
            if (err) {
                return next(err)
            }

            if (results[0].status == 1) {
                res.json({
                    success: "success",
                    message: "Admin",
                    message_th: "Admin"
                })
            } else if (results[0].status == 0) {
                res.json({
                    success: "success",
                    message: "Auth",
                    message_th: "Auth"
                })
            } else {
                res.json({
                    success: "error",
                    message: "error",
                    message_th: "error"
                })
            }
        })
    })
}

exports.insertWork = (req, res, next) => {
    var {
        body
    } = req;

    var idUser = body.idUser
    var status = body.status
    var TravelTime = body.TravelTime
    var EndTravelTime = body.EndTravelTime
    var StartTime = body.StartTime
    var FinishTime = body.FinishTime
    var partner = body.partner
    var description = body.description
    var expenses = body.expenses
    var cost = body.cost
    var location = body.location
    var lat = body.x
    var long = body.y
    var client = body.client
    var clientcode = body.clientcode

    // {
//   "idUser": "2",
//   "status": "ss",
//   "TravelTime": "2020-10-10 12:19:19",
//   "EndTravelTime": "2020-10-10 13:19:19",
//   "StartTime": "2020-10-10 13:30:19",
//   "FinishTime": "2020-10-10 22:19:19",
//   "partner": "eed",
//   "description": "eedmm",
//   "expenses": "111222",
//   "cost": "10000000",
//   "location": "แขวง รามอินทรา เขตคันนายาว กรุงเทพมหานคร 10230 ประเทศไทย",
//   "x": "13.8084352",
//   "y": "100.6764032",
//   "client": "Praprute Pummala",
//   "clientcode": "1312312"
// }

    req.getConnection((err, connection) => {
        if (err) return next(err)

        var sql = "INSERT INTO `sila-management`.`works`(idUser, status, TravelTime, EndTravelTime, StartTime, FinishTime, partner, description, expenses, cost, location, x, y, client, clientCode) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
        connection.query(sql, [idUser, status, TravelTime, EndTravelTime, StartTime, FinishTime, partner, description, expenses, cost, location, lat, long, client, clientcode], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results,
                    // message_th: "สร้างบัญชีผู้ใช้งานเสร็จเรียบร้อย"
                })
            }
        })
    })

    // console.log(body)
}

exports.fetchworkAuth = (req, res) => {
    var {
        body
    } = req
    var idUser = body.idUser
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM `sila-management`.works where idUser = ? ;"
        connection.query(sql, [idUser], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results
                })
            }
        })
    })
}

exports.fetchpartner = (req, res, next) => {
var {
        body
    } = req

    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT name FROM `sila-management`.users WHERE role = 1;"
        connection.query(sql, (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results
                })
            }
        })
    })
}

exports.DeleteIndex = (req, res, next) => {
    var {body} = req
    var id = body.idworks
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "DELETE FROM `sila-management`.`works` WHERE (`idworks` = ?)"
        connection.query(sql, [id],(err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results
                })
            }
        })
    })
}

exports.fetchworkAdmin = (req, res) => {
    var {
        body
    } = req
var namereq = body.nameadmin
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM `sila-management`.works where partner=?"
        connection.query(sql,[namereq], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({
                    success: "success",
                    message: results
                })
            }
        })
    })
} 

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({
        success: "success",
        message: "Signout Success"
    });
}

exports.register = (req, res, next) => {
    var {
        body
    } = req;

    var email = body.email;
    var password = body.password;
    var name = body.name;

    req.getConnection((err, connection) => {
        if (err) return next(err)

        if (name.length > 0) {
            // console.log(name.length)
            if (email.length > 0) {
                if (password.length > 0) {
                    var sql = "SELECT*FROM `sila-management`.`users` WHERE email=?;"
                    connection.query(sql, [email], (err, results) => {
                        if (err) {
                            return next(err)
                        }
                        if (results.length > 0) {
                            res.json({
                                success: "error",
                                message: null,
                                message_th: "อีเมล์นี้มีผู้ใช้งานแล้ว"
                            });
                        } else {
                            var sql = "INSERT INTO `sila-management`.`users` ( email, password, name) \
                            VALUES (?, ?, ?);"
                            connection.query(sql, [email, password, name], (err, results) => {
                                if (err) {
                                    return next(err)
                                } else {
                                    res.json({
                                        success: "success",
                                        message: results,
                                        message_th: "สร้างบัญชีผู้ใช้งานเสร็จเรียบร้อย"
                                    })
                                }
                            })
                        }
                    })

                } else {
                    res.json({
                        success: "error",
                        message: null,
                        message_th: "password ไม่ถูกต้อง"
                    })
                }
            } else {
                res.json({
                    success: "error",
                    message: null,
                    message_th: "email ไม่ถูกต้อง"
                })
            }

        } else {
            res.json({
                success: "error",
                message: null,
                message_th: "กรุณากรอกชื่อผู้ใช้"
            })
        }
    })
}

exports.fetchImage = async (req, res, next) => {
    var { body } = req
    var idReminder = body.idReminder

    var Fetchresult 

    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = " SELECT * FROM `sila-management`.Reminder WHERE idReminder = ? ;"
        connection.query(sql, [idReminder], (err, results) => {
            if (err) {
                return next(err)
            } else {
                Fetchresult = results[0]

                let params = {
                    Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                    Key: Fetchresult.img
                }

                s3.getSignedUrl('getObject', params, (err, data) => {
                    if(err) {
                        res.status(400).json({
                            message:'upload error '+ err.message,
                            status: false
                        })
                    }else{
                        res.json({
                            results: results[0],
                            imgUrl: data
                        })
                    }
                })

            }
        })
        
    })

    // s3.getObject(params, (err, data) => {
    //     if(err) {
    //         res.status(400).json({
    //             message:'upload error '+ err.message,
    //             status: false
    //         })
    //     } else {
    //         res.writeHead(200, {'Content-Type': 'image/jpeg'});
    //         res.write(data.Body, 'binary');
    //         res.end(null, 'binary');
    //     }
    // })

}




exports.uploadReminder = async (req, res, next) => {

    var {body} = req
    var idUserRemind = body.idUserRemind
    var img = body.img
    var date = body.notidate 
    var description = body.description
    var notidate3 = body.notidate3
    var notidate2 = body.notidate2
    var notidate1 = body.notidate1

    if(!req.files && req.files.file) {
        res.status(400).json({
            message:'no file upload',
            status: false
        })
    } else {
        
        let params = { 
            Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
            Key: config.secret + new Date().toString() + 'Reminder' + config.secret +'.jpg',  // <<=== ชื่อที่เราจะตั้งให้ไฟล์นั้น
            Body: req.files.file.data,
            ACL: 'public-read', // <<=== ให้ไฟล์นี้เป็น public
        }

        s3.putObject(params, (err, data) => {
            if(err) {
                res.status(400).json({
                    message:'upload error '+ err.message,
                    status: false
                })
            } else {
                req.getConnection((err, connection) => {
                    if (err) return next(err)
                    var sql = "INSERT INTO `sila-management`.`Reminder`(idUserRemind, img, date, description, noti3, noti2, noti1) \
                VALUES (?, ?, ?, ?, ?, ?, ?);"
                connection.query(sql, [idUserRemind, params.Key, date,description, notidate3 , notidate2, notidate1], (err, results) => {
                    if (err) {
                        return next(err)
                    } else {
                        res.json({
                            success: "success",
                            message: results,
                        })
                    }
                })
        
                })  
            }
        })  

        
    }
}

exports.fetchRemindAdmin = async (req, res, next) => {
    var { body } = req
    var idReminder = body.idReminder
    // var Fetchresult = []
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM `sila-management`.Reminder, `sila-management`.users  WHERE `Reminder`.idUserRemind = `users`.idusers"
        var Allresult = []
        var image
        connection.query(sql, [], (err, results) => {
            if (err) {
                return next(err)
            } else {
                for(var i = 0; i < results.length ; i++ ){
                    let params = {
                    Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                    Key: results[i].img
                    }

                const url = s3.getSignedUrl('getObject', params)
                
                Allresult.push({
                    user: results[i],
                    imageUrl: url
                })

                }
                // console.log(Allresult)
                res.json({Allresult})

            }
        })
        
    })
}

exports.deleteRemind = async (req, res, next) => {

    var { body } = req
    var idUserRemind = body.idUserRemind
    var idReminder = body.idReminder

    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = " SELECT img FROM `sila-management`.Reminder  WHERE idUserRemind = ? and idReminder = ?"
        connection.query(sql, [idUserRemind,idReminder] , (err, results) => {
            if (err) {
                return next(err)
            } else{
                // console.log(results[0].img)
                let params = {
                    Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                    Key: results[0].img
                    }
                s3.deleteObject(params,  (err, data) => {
                    if(err) {
                        res.status(400).json({
                            message:'upload error '+ err.message,
                            status: false
                        })
                    }else {
                    req.getConnection((err, connection) => {
                            if (err) return next(err)
                            var sql = "DELETE FROM `sila-management`.Reminder WHERE idReminder = ?"
                            connection.query(sql, [idReminder],(err, results) => {
                                if (err) {
                                    return next(err)
                                } else {
                                    res.json({
                                        success: "success",
                                        message: results
                                    })
                                }
                            })
                        })
                    }
                })
            }
        } )

    })
    
}

exports.fetchRemindUser = async (req, res, next) => {
    var { body } = req
    var idUserRemind = body.idUserRemind
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = " SELECT * FROM `sila-management`.Reminder WHERE idUserRemind = ? "
        var Allresult = []
        connection.query(sql, [idUserRemind], (err, results) => {
            if (err) {
                return next(err)
            } else {
                for(var i = 0; i < results.length ; i++ ){
                    let params = {
                    Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                    Key: results[i].img
                    }

                const url = s3.getSignedUrl('getObject', params)
                Allresult.push({
                    user: results[i],
                    imageUrl: url
                })

                }
                res.json({Allresult})

            }
        })
        
    })
}

exports.fetchRemindUserByIdforUpdate = async (req, res, next) => {
    var { body } = req
    var idReminder = body.idReminder
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = " SELECT * FROM `sila-management`.Reminder WHERE idReminder = ? "
        connection.query(sql, [idReminder], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({results})
            }
        })
        
    })
}

exports.updateRemind = async (req, res, next) => {

    var {body} = req
    var idReminder = body.idReminder
    var idUserRemind = body.idUserRemind
    var img = body.img
    var notidate = body.notidate 
    var description = body.description
    var notidate3 = body.notidate3
    var notidate2 = body.notidate2
    var notidate1 = body.notidate1
    // console.log(req.body)
    if(!req.files || req.files == null || req.files.file == '') {
        req.getConnection((err, connection) => {
            if (err) return next(err)
            var sql = "UPDATE `sila-management`.`Reminder` SET  date = ? , description = ? , noti3 =? , noti2 =? , noti1 =?  \
                    WHERE idReminder = ? "
        connection.query(sql, [notidate, description , notidate3 , notidate2, notidate1, idReminder], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({results})
            }
        })
        })  
    } else {
        
        let params = { 
            Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
            Key: new Date().toString() + config.secret +'.jpg',  // <<=== ชื่อที่เราจะตั้งให้ไฟล์นั้น
            Body: req.files.file.data,
            ACL: 'public-read', // <<=== ให้ไฟล์นี้เป็น public
        }

        s3.putObject(params, (err, data) => {
            if(err) {
                res.status(400).json({
                    message:'upload error '+ err.message,
                    status: false
                })
            } else {
                req.getConnection((err, connection) => {
                    if (err) return next(err)
                    var sql = "SELECT img FROM `sila-management`.Reminder  WHERE idReminder = ?"
                    connection.query(sql, [idReminder] , (err, results) => {
                        if (err) {
                            return next(err)
                        }else{
                            let params2 = {
                                Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                                Key: results[0].img
                                }
                            s3.deleteObject(params2,  (err, data) => {
                                if(err) {
                                    res.status(400).json({
                                        message:'upload error '+ err.message,
                                        status: false
                                    })
                                }else {
                                    req.getConnection((err, connection) => {
                                        if (err) return next(err)
                                        var sql = "UPDATE `sila-management`.`Reminder` SET  img = ? , date = ? , description = ? , noti3 =? , noti2 =? , noti1 =?  \
                                        WHERE idReminder = ? "
                                    connection.query(sql, [params.Key, notidate, description , notidate3 , notidate2, notidate1, idReminder], (err, results) => {
                                        if (err) {
                                            return next(err)
                                        } else {
                                            res.json({
                                                success: "success",
                                                message: results,
                                            })
                                        }
                                    })
                            
                                    })  
                                }
                })

                        }
                    })
                })  
            }
        })  

        
    }
}



exports.uploadVisa = async (req, res, next) => {

    var {body} = req
    var idUserVisa = body.idUserVisa
    var img = body.img
    var img = body.imgStamp
    var costVisa   = body.costVisa
    var costPermit = body.costPermit
    var date = body.notidate 
    var notidate3 = body.notidate3
    var notidate2 = body.notidate2
    var notidate1 = body.notidate1
    var description = body.description

    console.log(req.body)

    if(!req.files && req.files.file1 && req.files.file2 || !req.files && req.files.file1 || !req.files && req.files.file2) {
        res.status(400).json({
            message:'no file upload',
            status: false
        })
    } else {
        
        let params1 = { 
            Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
            Key:  new Date().getMilliseconds() + new Date()+  new Date().getSeconds() + 'Visa' + config.secret +'.jpg',  // <<=== ชื่อที่เราจะตั้งให้ไฟล์นั้น
            Body: req.files.file1.data,
            ACL: 'public-read', // <<=== ให้ไฟล์นี้เป็น public
        }

        await s3.putObject(params1, (err, data) => {
            if(err) {
                res.status(400).json({
                    message:'upload error '+ err.message,
                    status: false
                })
            }
        })

        await setTimeout(function(){
        }, 200); 

        let params2 = { 
            Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
            Key:  new Date().getMilliseconds() + new Date()+  new Date().getSeconds() + 'VisaStamp' + config.secret +'.jpg',  // <<=== ชื่อที่เราจะตั้งให้ไฟล์นั้น
            Body: req.files.file2.data,
            ACL: 'public-read', // <<=== ให้ไฟล์นี้เป็น public
        }

        await s3.putObject(params2, (err, data) => {
            if(err) {
                res.status(400).json({
                    message:'upload error '+ err.message,
                    status: false
                })
            } else {
                req.getConnection((err, connection) => {
                    if (err) return next(err)
                    var sql = "INSERT INTO `sila-management`.`RemindVisa`(idUserVisa, img, imgStamp,costVisa, costPermit,date, description, noti3, noti2, noti1) \
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
                connection.query(sql, [idUserVisa, params1.Key, params2.Key, costVisa, costPermit, date,description, notidate3 , notidate2, notidate1], (err, results) => {
                    if (err) {
                        return next(err)
                    } else {
                        res.json({
                            success: "success",
                            message: results,
                        })
                    }
                })
        
                })  
            }
        })  
        
    }
}

exports.fetchVisaAdmin = async (req, res, next) => {
    var { body } = req
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "SELECT * FROM `sila-management`.RemindVisa, `sila-management`.users  WHERE `RemindVisa`.idUserVisa = `users`.idusers"
        var Allresult = []
        connection.query(sql, [], (err, results) => {
            if (err) {
                return next(err)
            } else {
                for(var i = 0; i < results.length ; i++ ){
                    let params1 = {
                    Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                    Key: results[i].img
                    }

                    let params2 = {
                    Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                    Key: results[i].imgStamp
                    }

                const url1 = s3.getSignedUrl('getObject', params1)
                const url2 = s3.getSignedUrl('getObject', params2)

                Allresult.push({
                    user: results[i],
                    imageUrl1: url1,
                    imageUrl2: url2
                })
                }
                res.json({Allresult})
            }
        })
        
    })
}

exports.deleteVisa = async (req, res, next) => {

    var { body } = req
    var idRemindVisa = body.idRemindVisa
    var idUserVisa = body.idUserVisa   

    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = " SELECT img, imgStamp FROM `sila-management`.RemindVisa  WHERE idUserVisa = ? and idRemindVisa = ?"
        connection.query(sql, [idUserVisa,idRemindVisa] , (err, results) => {
            if (err) {
                return next(err)
            } else{

                let params1 = {
                    Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                    Key: results[0].img
                    }

                let params2 = {
                        Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                        Key: results[0].imgStamp
                        }

                s3.deleteObject(params1,  (err, data) => {
                    if(err) {
                        res.status(400).json({
                            message:'upload error '+ err.message,
                            status: false
                        })
                    }
                })
                s3.deleteObject(params2, (err, data) => {
                    if(err) {
                        res.status(400).json({
                            message:'upload error '+ err.message,
                            status: false
                        })
                    }else {
                        req.getConnection((err, connection) => {
                                if (err) return next(err)
                                var sql = "DELETE FROM `sila-management`.RemindVisa WHERE idRemindVisa = ?"
                                connection.query(sql, [idRemindVisa],(err, results) => {
                                    if (err) {
                                        return next(err)
                                    } else {
                                        res.json({
                                            success: "success",
                                            message: results
                                        })
                                    }
                                })
                            })
                        }
                })
            }
        } )

    })
}

exports.fetchRemindVisaUser = async (req, res, next) => {
    var { body } = req
    var idUserVisa = body.idUserVisa
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = " SELECT * FROM `sila-management`.RemindVisa WHERE idUserVisa = ? "
        var Allresult = []
        connection.query(sql, [idUserVisa], (err, results) => {
            if (err) {
                return next(err)
            } else {
                for(var i = 0; i < results.length ; i++ ){
                    let params1 = {
                    Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                    Key: results[i].img
                    }

                    let params2 = {
                    Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                    Key: results[i].imgStamp
                    }

                const url1 = s3.getSignedUrl('getObject', params1)
                const url2 = s3.getSignedUrl('getObject', params2)

                Allresult.push({
                    user: results[i],
                    imageUrl: url1,
                    imageUrl2: url2
                })
                }
                res.json({Allresult})
            }
        })
        
    })

}

exports.fetchVisaUserByIdforUpdate = async (req, res, next) => {
    var { body } = req
    var idRemindVisa = body.idRemindVisa
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = " SELECT * FROM `sila-management`.RemindVisa WHERE idRemindVisa = ? "
        connection.query(sql, [idRemindVisa], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({results})
            }
        })
        
    })
}

exports.updateVisa = async (req, res, next) => {

    var {body} = req
    var idRemindVisa = body.idRemindVisa
    var idUserVisa = body.idUserVisa
    var img = body.img
    var imgStamp = body.imgStamp
    var costVisa = body.costVisa
    var costPermit = body.costPermit
    var date = body.notidate 
    var notidate3 = body.notidate3
    var notidate2 = body.notidate2
    var notidate1 = body.notidate1
    var description = body.description
    // console.log(req.body)

    if(!req.files || req.files == null || req.files.file1 == '' || req.files.file2 == '') {
        req.getConnection((err, connection) => {
            if (err) return next(err)
            var sql = "UPDATE `sila-management`.`RemindVisa` SET costVisa = ?, costPermit = ? , date = ? , description = ? , noti3 =? , noti2 =? , noti1 =?  \
                    WHERE idRemindVisa = ? "
        connection.query(sql, [costVisa, costPermit, date, description , notidate3 , notidate2, notidate1, idRemindVisa], (err, results) => {
            if (err) {
                return next(err)
            } else {
                res.json({results})
            }
        })
        })  
    } else {
        
        let params1 = { 
            Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
            Key:  new Date().getMilliseconds() + new Date()+  new Date().getSeconds() + 'Visa' + config.secret +'.jpg',  // <<=== ชื่อที่เราจะตั้งให้ไฟล์นั้น
            Body: req.files.file1.data,
            ACL: 'public-read', // <<=== ให้ไฟล์นี้เป็น public
        }

        let params2 = { 
            Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
            Key:  new Date().getMilliseconds() + new Date()+  new Date().getSeconds() + 'VisaStamp' + config.secret +'.jpg',  // <<=== ชื่อที่เราจะตั้งให้ไฟล์นั้น
            Body: req.files.file2.data,
            ACL: 'public-read', // <<=== ให้ไฟล์นี้เป็น public
        }

        s3.putObject(params1, (err, data) => {
            if(err) {
                res.status(400).json({
                    message:'upload error '+ err.message,
                    status: false
                })
            }else{
                s3.putObject(params2, (err, data) => {
                    if(err) {
                        res.status(400).json({
                            message:'upload error '+ err.message,
                            status: false
                        })
                    } else {
                        req.getConnection((err, connection) => {
                            if (err) return next(err)
                            var sql = "SELECT img, imgStamp  FROM `sila-management`.RemindVisa  WHERE idRemindVisa = ?"
                            connection.query(sql, [idRemindVisa] , (err, results) => {
                                if (err) {
                                    return next(err)
                                }else{

                                    let paramsD1 = {
                                        Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                                        Key: results[0].img
                                        }

                                    let paramsD2 = {
                                        Bucket: process.env.BUCKET_NAME,  // <<=== เก็บ config ไว้ใน .env
                                        Key: results[0].imgStamp
                                        }

                                    s3.deleteObject(paramsD1,  (err, data) => {
                                        if(err) {
                                            res.status(400).json({
                                                message:'upload error '+ err.message,
                                                status: false
                                            })
                                        }else{
                                            s3.deleteObject(paramsD2, (err, data) => {
                                                if(err) {
                                                    res.status(400).json({
                                                        message:'upload error '+ err.message,
                                                        status: false
                                                    })
                                                } else {
                                            req.getConnection((err, connection) => {
                                                if (err) return next(err)
                                                var sql = "UPDATE `sila-management`.`RemindVisa` SET  costVisa = ?, costPermit = ?, img = ?, imgStamp = ?, date = ? , description = ? , noti3 =? , noti2 =? , noti1 =?  \
                                                WHERE idRemindVisa = ? "
                                            connection.query(sql, [costVisa, costPermit, params1.Key, params2.Key, date, description , notidate3 , notidate2, notidate1, idRemindVisa], (err, results) => {
                                                if (err) {
                                                    return next(err)
                                                } else {
                                                    res.json({
                                                        success: "success",
                                                        message: results,
                                                    })
                                                }
                                            })
                                            })  
                                        }
                                            })
                                        }
                        })
                                }
                            })
                        })  
                    }
                })  
            }
        })  
    }
}






// exports.uploadRemind = async (req, res) => {
//     var {body} = req
//     var idUserRemind = body.idUserRemind
//     var img = body.img
//     var date = body.date 
//     var notiDate3 = body.notiDate3
//     var notiDate2 = body.notiDate2
//     var notiDate1 = body.notiDate1
//     var description = body.description

//     if (!req.files){
//         return res.status(400).send('No files were uploaded.');
//     }

//     var file = req.files.uploaded_image;


//     req.getConnection((err, connection) => {
//         if (err) return next(err)
//     })
// }


// exports.isAuthorAdmin = (req, res, next) => {

//     var {
//         body
//     } = req
//     var email = body.email

//     req.getConnection((err, connection) => {
//         if (err) return next(err)

//         var sql = "SELECT `user-sila`.status FROM `sila`.`user-sila` \
//         WHERE `user-sila`.email = ? ;"

//         connection.query(sql, [email], (err, results) => {
//             if (err) {
//                 return next(err)
//             }

//             if (results[0].status == 1) {
//                 res.json({
//                     success: "success",
//                     message: "Admin",
//                     message_th: "Admin"
//                 })
//             } else if (results[0].status == 0) {
//                 res.json({
//                     success: "success",
//                     message: "Auth",
//                     message_th: "Auth"
//                 })
//             } else {
//                 res.json({
//                     success: "error",
//                     message: "error",
//                     message_th: "error"
//                 })
//             }
//         })
//     })
// }