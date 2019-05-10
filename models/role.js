const theDataBase = require('../config/db').theDb
const roleSchema = theDataBase.import('../schema/role.js')
const roleMenuSchema = theDataBase.import('../schema/role_to_menu.js')
const userRoleSchema = theDataBase.import('../schema/user_to_role.js')

const Sequelize = require('sequelize')
const Op = Sequelize.Op

export default class RoleModel {
    /**
     * 获取角色列表
     * @static
     * @param {*} data
     * @returns
     * @memberof RoleModel
     */
    static async getRoleList(data) {
        let params = {
            is_deleted: 1
        }
        if(data.name) {
            params.name = {
                [Op.like]: `%${data.name.trim()}%`
            }
        }
        const count = await roleSchema.count({
            where: params
        })
        let rows = []
        if (count > 0) {
            rows = await theDataBase.query(`
                SELECT
                    role.*, IFNULL(utr.count, 0) AS user_count
                FROM
                    role
                        LEFT OUTER JOIN
                    (SELECT
                        role_id, COUNT(*) AS count
                    FROM
                        user_to_role
                    GROUP BY role_id) utr ON id = utr.role_id
                WHERE
                    is_deleted = 1
                    AND name LIKE '%${data.name ? data.name.trim() : ''}%'
                LIMIT ${data.limit * (data.page - 1)}, ${data.limit};
            `, {
                type: theDataBase.QueryTypes.SELECT
            })
        }

        return {
            count,
            rows
        }
    }

    /**
     * 获取角色所有菜单
     * @static
     * @param {*} id
     * @returns
     * @memberof RoleModel
     */
    static async getMenuByRoleId(id) {
        if(!id) {return []}
        const list = await roleMenuSchema.findAll({
            where: {
                role_id:id
            },
            raw: true,
            attributes: [['menu_id','id']]
        })
        const arr = []
        if (list.length > 0) {
            list.forEach(item => {
                arr.push(item.id)
            })
        }
        return arr
    }

    /**
     * 修改角色
     * @static
     * @param {*} data
     * @returns
     * @memberof RoleModel
     */
    static async modifyRole(data) {
        const count = await roleSchema.count({
            raw: true,
            where: {
                name:data.name,
                id: {
                    [Op.ne]: data.id
                }
            }
        })
        if (count > 0) {
            return false
        }
        let role
        // 更新时间
        data.update_time = new Date()
        if (data.id) {
            const selector = {
                where: {
                    id: data.id
                }
            }
            role = await roleSchema.update(data, selector)
        } else {
            // 创建时间
            data.create_time = new Date()
            role = await roleSchema.create(data)
        }
        if (data.treeList.length > 0) {
            const role_id = data.id ? data.id : role.id
            await roleMenuSchema.destroy({
                where:{
                    role_id
                }
            })
            let list = []
            data.treeList.forEach(item => {
                list.push({
                    role_id,
                    menu_id:item
                })
            })
            await roleMenuSchema.bulkCreate(list)
        }
        return role
    }

     /**
      * 删除角色
      * @static
      * @param {*} data
      * @memberof RoleModel
      */
     static async deleteRole(id) {
         await roleMenuSchema.destroy({
             where:{
                 role_id:id
             }
         })
         await roleSchema.destroy({
            where: {
                id
            }
         })
     }
}