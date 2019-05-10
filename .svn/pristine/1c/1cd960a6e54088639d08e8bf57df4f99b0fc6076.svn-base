const theDataBase = require('../config/db').theDb
const menuSchema = theDataBase.import('../schema/menu.js')

const Sequelize = require('sequelize')
const Op = Sequelize.Op

export default class MenuModel {
    /**
     * 菜单列表
     * @static
     * @param {*} data
     * @returns
     * @memberof MenuModel
     */
    static async getMenuList(data) {
        let params = {
            is_used:1,
            is_deleted:1
        }
        if(data.name){
            params.name = {
                [Op.like]:`%${data.name.trim()}%`
            }
        }
        const list = await menuSchema.findAll({
            order:[
                'sort'
            ],
            where:params,
            raw: true
        })
        return list
    }

    /**
     * 修改菜单
     * @static
     * @param {*} data
     * @returns
     * @memberof MenuModel
     */
    static async modifyMenu(data) {
        let menu
        // 更新时间
        data.update_time = new Date()
        if (data.id) {
            menu = await menuSchema.update(data, {
                where: {
                    id: data.id
                }
            })
        } else {
            // 创建时间
            data.create_time = new Date()
            menu = await menuSchema.create(data)
        }
        return menu
    }

    /**
     * 删除菜单
     * @static
     * @param {*} data
     * @returns
     * @memberof MenuModel
     */
    static async deleteMenu(id) {
        return await menuSchema.destroy({
            where:{
                id
            }
        })
    }
}