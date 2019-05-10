const theDatabase = require('../config/db').theDb
const userSchema = theDatabase.import('../schema/user.js')
const userRoleSchema = theDatabase.import('../schema/user_to_role.js')
const roleMenuSchema = theDatabase.import('../schema/role_to_menu.js')
const menuSchema = theDatabase.import('../schema/menu.js')
const attachmentSchema = theDatabase.import('../schema/attachment.js')
const roleSchema = theDatabase.import('../schema/role.js')
const fs = require('fs')

userSchema.hasOne(attachmentSchema, {
    as: 'f',
    foreignKey: 'business_id'
})

userSchema.hasOne(userRoleSchema, {
    as: 'utr',
    foreignKey: 'user_id'
})

userRoleSchema.belongsTo(roleSchema, {
    as: 'r',
    foreignKey: 'role_id'
})

const Sequelize = require('sequelize')
const Op = Sequelize.Op

const CommonTool = require('../common/index')

const config = require('../config/index')

const bcrypt = require('bcryptjs')

export default class UserModel {
    /**
     * 用户登录后所需信息
     * @static
     * @param {*} data
     * @memberof UserModel
     */
    static async getUserLoginInfo(data) {
        const user = await userSchema.findOne({
            include:[
                {
                    model:attachmentSchema,
                    as:'f',
                    attributes:[],
                    require:false,
                    where:{
                        business_type: 1
                    }
                },
                {
                    model:userRoleSchema,
                    as: 'utr',
                    attributes:[],
                    include: [
                        {
                            model: roleSchema,
                            as: 'r',
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                id:data.id
            },
            attributes: {
                include: [Sequelize.col('f.file_path'), Sequelize.col('utr.role_id'), [Sequelize.col('utr->r.name'), 'role_name']],
                exclude: ['pass_word']
            },
            raw:true
        })
        const menuIdList = await roleMenuSchema.findAll({
            where: {
                role_id: user.role_id
            },
            attributes:['menu_id']
        })
        let list = []
        menuIdList.forEach(item => {
            list.push(item.menu_id)
        })
        const menuList = await menuSchema.findAll({
            where:{
                id:{
                    [Op.in]: list
                }
            }
        })
        user.menus = menuList
        return user
    }
    /**
     * 通过用户名查找数据
     * @static
     * @param {*} name
     * @returns
     * @memberof userModel
     */
    static async getUserByName(name) {
        if (!name) return null
        return await userSchema.findOne({
            where: {
                user_name: name
            }
        })
    }

    /**
     * 根据用户ID获取用户信息
     * @static
     * @param {*} id
     * @memberof UserModel
     */
    static async getUserById(id) {
        if (!id) return null
        return await userSchema.findOne({
            where:{
                id
            }
        })
    }

    /**
     * 获取用户列表
     * @static
     * @param {*} data
     * @returns
     * @memberof UserModel
     */
    static async getUserList(data) {
        let params = {
            is_delete: 1
        }
        if (data.user_name) {
            params.user_name = {
                [Op.like]: `%${data.user_name.trim()}%`
            }
        }
        if(data.is_used){
            params.is_used = data.is_used
        }
        const userList = await userSchema.findAndCountAll({
            include: [
                {
                    model: attachmentSchema,
                    as: 'f',
                    attributes: []
                },
                {
                    model: userRoleSchema,
                    as: 'utr',
                    attributes: []
                }
            ],
            raw: true,
            order: [
                ['create_time', 'desc']
            ],
            where: params,
            offset: data.limit * (data.page - 1),
            limit: Number(data.limit),
            attributes: ['id', ['user_name', 'name'],['pass_word','password'],
                ['login_ip', 'ip'],
                ['user_email', 'email'], 'is_used', 'create_time', Sequelize.col('f.file_path'), Sequelize.col('utr.role_id')
            ] // 控制查询字段
        })
        return userList
    }

    /**
     *  新增 | 修改用户
     * @static
     * @param {*} data
     * @returns
     * @memberof UserModel
     */
    static async modifyUser(data) {
        const count = await userSchema.count({
            raw: true,
            where: {
                [Op.or]: [{
                    user_name: data.user_name
                }, {
                    user_email: data.user_email
                }],
                id: {
                    [Op.ne]: data.id
                }
            }
        })
        if (count > 0) {
            return false
        }

        let user
        // 更新时间
        data.update_time = new Date()
        // ip
        const ip = await CommonTool.getIpBySohu()
        data.login_ip = ip ? JSON.parse(ip.split(' = ')[1].split(';')[0]).cip : ''
        if (data.id) {
            const selector = {
                where: {
                    id: data.id
                }
            }
            user = await userSchema.update(data, selector)
        } else {
            // 创建时间
            data.create_time = new Date()
            // 默认密码
            const password = await CommonTool.enBcryption(config.defaultPassword)
            data.pass_word = password
            data.role_id = data.role_id || 8
            user = await userSchema.create(data)
        }
        const user_id = data.id ? data.id : user.id
        const attachment = data.attachmentList
        if (attachment && attachment.length > 0) {
            await attachmentSchema.update({
                business_id: user_id
            }, {
                where: {
                    id: attachment[0].id
                }
            })
        }
        // 该用户是否已有角色
        const count1 = await userRoleSchema.count({
            raw: true,
            where: {
                user_id
            }
        })
        if (count1 > 0) {
            await userRoleSchema.update({
                role_id: data.role_id
            },{
                where:{
                    user_id
                }
            })
        } else {
            await userRoleSchema.create({
                user_id,
                role_id: data.role_id
            })
        }

        return user
    }

    /**
     *  停用|启用用户
     * @static
     * @param {*} data
     * @returns
     * @memberof UserModel
     */
    static async upUserStatus(id) {
        const selector = {
            where: {
                id
            }
        }
        const temp = await userSchema.findOne(selector)
        const param = {
            is_used: temp.is_used === 1 ? 2 : 1
        }
        await userSchema.update(param, selector)
        return true
    }

    /**
     * 删除用户
     * @static
     * @param {*} data
     * @memberof UserModel
     */
    static async deleteUser(id) {
        const selector = {
            where: {
                id
            }
        }
        await userSchema.destroy(selector)

        const selector2 = {
            raw:true,
            where:{
                business_id:id
            }
        }
        const file = await attachmentSchema.findOne(selector2)
        const file_path = file.file_path
        await attachmentSchema.destroy(selector2)

        if (file_path) {
            CommonTool.deleteFile(file.file_path)
        }
        const select3 = {
            raw: true,
            where: {
                user_id: id
            }
        }
        await userRoleSchema.destroy(select3)
    }

    /**
     * 发送邮件
     * @static
     * @param {*} data
     * @memberof UserModel
     */
    static async sendEmail(data) {
        const link = `http://127.0.0.1:9012/api/active/${data.name}/${data.password.replace(/\//g, '')}`
        console.log(link)

        const body = `您好：${data.name} <br/>欢迎注册【${config.webName}】网站，请点击<a href="${link}" target="_blank">${link}</a>链接进行激活您的帐号！<p><img src="http://www.scscms.com/images/whiteSCS.png" /></p>`
        return await CommonTool.sendEmail(data.email, config.webName, body)
    }

    /**
     * 修改用户密码
     * @static
     * @param {*} data
     * @memberof UserModel
     */
    static async updateUserPassword(data) {
        const user = await userSchema.findOne({
            raw: true,
            where: {
                id: data.id
            }
        })
        if (!bcrypt.compareSync(data.old_password, user.pass_word)) {
            return false
        }
        const pass_word = await CommonTool.enBcryption(data.new_password)
        await userSchema.update({
            pass_word
        }, {
            where: {
                id: data.id
            }
        })
        return true
    }

    /**
     * 导出用户列表
     * @static
     * @param {*} data
     * @memberof UserModel
     */
    static async userListExport(data) {
        const userList = await this.getUserList(data)
        const tempHeader = ['ID', '姓名', '登录IP', '邮箱', '创建时间']
        const header = []
        tempHeader.forEach(item => {
            header.push({
                v: item,
                s: {
                    alignment: {
                        vertical: 'center',
                        horizontal: 'center'
                    },
                    font: {
                        sz: 16,
                        bold: true,
                        color: {
                            rgb: 'E2003B'
                        }
                    }
                }
            })
        })
        const result = [header]
        if(userList.count > 0) {
            userList.rows.forEach(item => {
                result.push([
                    item.id,
                    item.name,
                    item.ip,
                    item.email,
                    item.create_time
                ])
            })
        }
        return result
    }

    /**
     * 导入用户列表
     * @static
     * @param {*} list
     * @memberof UserModel
     */
    static async userListImport(list) {
        const parseList = list[0].data
        parseList.forEach((item,index) => {
            if(index > 0){
                this.modifyUser({
                    id:item[0] || 0,
                    user_name:item[1],
                    login_ip:item[2],
                    user_email:item[3]
                })
            }
        })
    }
}
