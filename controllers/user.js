import UserModel from '../models/user'
const jwt = require('jsonwebtoken')
const config = require('../config/index')
const common = require('../common/index')
import {
    tags,
    query,
    path,
    body,
    formData,
    // middlewares,
    summary,
    description,

    request,
    prefix
} from 'koa-swagger-decorator'
const tag = tags(['User'])

@prefix('/user')
export default class UserController {
    /**
     * 根据token获取用户信息
     * @static
     * @param {*} ctx
     * @memberof UserController
     */
    @request('GET','/info')
    @summary('根据token获取用户信息')
    @tag
    static async getUserByToken(ctx) {
        const token = ctx.header.authorization
        if (token) {
            let info
            try {
                info = jwt.verify(token.split(' ')[1],config.JWT.secret)
                const user = await UserModel.getUserLoginInfo(info)
                ctx.body = {
                    STATUS: 1,
                    MESSAGE: '查询成功',
                    ITEMS: user
                }
                return
            } catch (error) {
                console.log('token verify fail:', error)
                ctx.body = {
                    STATUS: 0,
                    MESSAGE: 'token verify fail:'+ error,
                    ITEMS: null
                }
                return
            }
        }
        ctx.body = {
            STATUS: 0,
            MESSAGE: 'token is no exist',
            ITEMS: null
        }
    }

    /**
     * 获取用户信息
     * @static
     * @param {*} ctx
     * @memberof UserController
     */
    @request('GET', '/info/{id}')
    @summary('获取用户信息')
    @tag
    @path({
        id: {
            type: 'number',
            required: true,
            description: '用户ID'
        }
    })
    static async getUserInfo(ctx) {
        const id = ctx.params.id
        const list = await UserModel.getUserById(id)
        ctx.body = {
            STATUS: 1,
            MESSAGE: '查询成功',
            ITEMS: list
        }
    }

    /**
     * 获取用户列表
     * @static
     * @param {*} ctx
     * @memberof UserController
     */
    @request('GET', '/list')
    @summary('获取用户列表')
    @description('1')
    @tag
    @query({
        page: {
            type: 'number',
            required: true,
            default: 1,
            description: '页码'
        },
        limit: {
            type: 'number',
            required: true,
            default: 10,
            description: '数目'
        },
        user_name:{
            type: 'string',
            description: '用户姓名'
        },
        is_used: {
            type: 'string',
            description: '停用启用状态'
        }
    })
    static async getUserList(ctx) {
        const data = ctx.validatedQuery
        const list = await UserModel.getUserList(data)

        ctx.body = {
            STATUS: 1,
            MESSAGE: '查询成功',
            ITEMS: {
                records: list.rows,
                total: list.count
            }
        }
    }

    /**
     * 修改用户
     * @static
     * @param {*} ctx
     * @memberof UserController
     */
    @request('POST', '/modify')
    @summary('修改用户')
    @description('2')
    @tag
    @body({
        id: {
            type: 'number',
            default: 0,
            description: '新增时ID可为空或0'
        },
        user_name: {
            type: 'string',
            required: true
        },
        user_email: {
            type: 'string',
            required: true
        },
        role_id: {
            type: 'number',
            required: true
        }
    })
    static async modifyUser(ctx) {
        const data = ctx.validatedBody
        const user = await UserModel.modifyUser(data)
        if (!user) {
            ctx.body = {
                STATUS: 0,
                MESSAGE: '用户姓名或邮箱已存在'
            }
        } else {
            ctx.body = {
                STATUS: 1,
                MESSAGE: '修改成功',
                ITEMS: user
            }
        }
    }

    /**
     * 修改用户状态
     * @static
     * @param {*} ctx
     * @memberof UserController
     */
     @request('PUT', '/update/{id}')
     @summary('根据用户ID修改用户停用启用状态')
     @description('3')
     @tag
     @path({
         id: {
             type: 'string',
             required: true
         }
     })
    static async upUserStatus(ctx) {
        const id = ctx.params.id
        const user = await UserModel.upUserStatus(id)
        const message = user ? '修改成功' : '修改失败'
        ctx.body = {
            STATUS: 1,
            MESSAGE: message,
            ITEMS: user
        }
    }

    /**
     * 删除用户
     * @static
     * @param {*} ctx
     * @memberof UserController
     */
    @request('DELETE', '/delete/{id}')
    @summary('根据用户ID删除')
    @description('4')
    @tag
    @path({
        id: {
            type: 'string',
            required: true
        }
    })
    static async deleteUser(ctx) {
        const id = ctx.params.id
        await UserModel.deleteUser(id)
        ctx.body = {
            STATUS: 1,
            MESSAGE: '删除成功',
            ITEMS: null
        }
    }

    /**
     * 发送邮件
     * @static
     * @param {*} ctx
     * @memberof UserController
     */
    @request('POST', '/email')
    @summary('发送邮件')
    @description('5')
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
        email:{
            type: 'string',
            required: true
        }
    })
    static async sendEmail(ctx) {
        const data = ctx.validatedBody
        const info = await UserModel.sendEmail(data)
        ctx.body = {
            STATUS: 1,
            MESSAGE: '发送成功',
            ITEMS: info
        }
    }

    /**
     * 修改用户密码
     * @static
     * @param {*} ctx
     * @memberof UserController
     */
    @request('POST', '/password')
    @summary('修改用户密码')
    @tag
    @body({
        id: {
            type: 'number',
            required: true,
            description: '用户ID'
        },
        old_password:{
            type: 'string',
            required: true,
            description: '原密码'
        },
        new_password: {
            type: 'string',
            required: true,
            description: '新密码'
        },
        confirm_password: {
            type: 'string',
            required: true,
            description: '确认密码'
        }
    })
    static async updateUserPassword(ctx) {
        const data = ctx.validatedBody
        const flag = await UserModel.updateUserPassword(data)
        ctx.body = {
            STATUS: flag ? 1 : 0,
            MESSAGE: flag ? '修改成功' : '原密码不正确',
            ITEMS: null
        }
    }

    /**
     * 导出用户列表
     * @static
     * @param {*} ctx
     * @memberof UserController
     */
    @request('POST', '/list/export')
    @summary('导出用户列表')
    @tag
    @body({
        page: {
            type: 'number',
            required: true,
            default: 1,
            description: '页码'
        },
        limit: {
            type: 'number',
            required: true,
            default: 10,
            description: '数目'
        },
        user_name: {
            type: 'string',
            description: '用户姓名'
        },
        is_used: {
            type: 'string',
            description: '停用启用状态'
        }
    })
    static async userListExport(ctx) {
        const data = ctx.validatedBody
        const list = await UserModel.userListExport(data)

        const options = {
            '!cols': [
                {
                    wch: 6
                }, {
                    wch: 7
                }, {
                    wch: 10
                }, {
                    wch: 20
                }, {
                    wch: 20
                }
            ],
            '!rows':[
                {
                    hpx:20
                }
            ],
            '!margins':{left:.7,right:.7,top:.75,bottom:.75,header:.3,footer:.3}
        }
        ctx.body = await common.exportXLSX(ctx, list, options, encodeURI('用户列表.xlsx'))
    }

    /**
     * 导入用户列表
     * @static
     * @param {*} ctx
     * @memberof UserController
     */
    @request('POST', '/list/import')
    @summary('导入用户列表')
    @tag
    @formData({
        file: {
            type: 'file',
            required: true,
            description: '待导入列表'
        }
    })
    static async userListImport(ctx) {
        const file = ctx.request.files.file
        const list = await common.parseXLSX(file)
        await UserModel.userListImport(list)
        ctx.body = {
            STATUS: 1,
            MESSAGE: '导入成功',
            ITEMS: null
        }
    }
}
