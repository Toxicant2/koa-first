import UserModel from '../models/user'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const svgCaptcha = require('svg-captcha')
const config = require('../config/index')
import {
    request,
    summary,
    description,
    body,
    tags,
    prefix
} from 'koa-swagger-decorator'
const tag = tags(['Auth'])

@prefix('/auth')
export default class LoginController {
    /**
     * 用户登录
     * @static
     * @param {*} ctx
     * @memberof LoginController
     */
    @request('POST', '/oauth/login')
    @summary('用户登录')
    @description('1')
    @tag
    @body({
        name: {
            type: 'string',
            required: true
        },
        password: {
            type: 'string',
            required: true
        },
        captcha:{
            type: 'string',
            required: true,
            description:'验证码'
        }
    })
    static async userLoginAuth(ctx) {
        // 用 post 传过来的数据存放于 request.body
        const data = ctx.validatedBody
        if (ctx.session.captcha.toLocaleLowerCase() !== data.captcha.toLocaleLowerCase()) {
            ctx.body = {
                STATUS: 0,
                MESSAGE: '验证码不正确',
                ITEMS:null
            }
            return
        }
        const userInfo = await UserModel.getUserByName(data.name)
        if (userInfo) {
            if (!bcrypt.compareSync(data.password, userInfo.pass_word)) {
                ctx.body = {
                    STATUS: 0,
                    MESSAGE: '账户名或者密码错误'
                }
            } else {
                if (userInfo.is_used === 2) {
                    ctx.body = {
                        STATUS: 0,
                        MESSAGE: '用户状态异常'
                    }
                } else {
                    const usreToken = {
                        id: userInfo.id,
                        name: userInfo.user_name,
                        originExp: Date.now() + config.TIMEOUT // 超时时长
                    }
                    const token = jwt.sign(usreToken, config.JWT.secret, {
                        expiresIn: config.JWT.expiresIn
                    })
                    ctx.body = {
                        STATUS: 1,
                        MESSAGE: '登录成功',
                        ITEMS: token
                    }
                }
            }
        } else {
            ctx.body = {
                STATUS: 0,
                MESSAGE: '用户不存在'
            }
        }
    }

    /**
     * 登录验证码
     * @static
     * @param {*} ctx
     * @memberof LoginController
     */
    @request('GET', '/captcha')
    @summary('登录验证码')
    @description('2')
    @tag
    static async authCaptcha(ctx) {
        let cap
        if (Math.floor(Math.random() * 2)){
            cap = svgCaptcha.create({
                size: 4,
                ignoreChars: '0o1i',
                noise: 2,
                color: true,
                background: '#cc9966'
            })
        } else {
            cap = svgCaptcha.createMathExpr({
                noise: 2,
                color: true,
                background: '#cc9966'
            })
        }

        ctx.type = 'svg'
        ctx.session.captcha = cap.text
        ctx.body = cap.data
    }
}
