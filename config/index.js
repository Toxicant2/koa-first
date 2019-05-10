module.exports = {
    defaultPassword: '123456',
    webName: 'koa-demo',
    uploadPath: '/upload',
    excelPath: '/excel',
    emailServer: {
        // host: 'smtp.qq.com',
        service: 'qq', // 使用内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
        port: 465,
        secure: true,
        auth: {
            user: '1192874863@qq.com',
            pass: 'yzkyytyrtreyijge'
        }
    },
    sessionConfig:{
        key:'koa:sess',// cookie key
        maxAge: 86400000, // cookie 过期时间ms
        overwrite: true, // 是否可以overwrite
        httpOnly: true, // 是否只有服务器端可以访问 httpOnly or not
        signed: true, // 签名默认true
        rolling: true, // 在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
        renew: false // renew session when session is nearly expired
    },
    JWT:{
        secret: 'koa-token', // 指定密钥
        expiresIn: '12h' // 超时设置 m分钟 h小时 d天数
    },
    TIMEOUT: 12 * 60 * 60 * 1000 // 超时设置mm（12h）
}
