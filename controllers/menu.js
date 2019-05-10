import MenuModel from '../models/menu'
import {
    query,
    path,
    body,
    prefix,
    summary,
    description,
    request,
    tags
} from 'koa-swagger-decorator'

const tag = tags(['Menu'])
@prefix('/menu')
export default class MenuController {
    /**
     * 获取菜单列表
     * @static
     * @param {*} ctx
     * @memberof MenuController
     */
    @request('GET','/list')
    @summary('获取菜单列表（不分页）')
    @description('1')
    @tag
    @query({
        name:{
            type: 'string',
            description: '菜单名称'
        }
    })
    static async getMenuList(ctx) {
        const data = ctx.query
        const list = await MenuModel.getMenuList(data)
        ctx.body = {
            STATUS:1,
            MESSAGE:'菜单查询成功',
            ITEMS: list
        }
    }

    /**
     * 修改菜单
     * @static
     * @param {*} ctx
     * @memberof MenuController
     */
    @request('POST', '/modify')
    @summary('修改菜单')
    @description('2')
    @tag
    @body({
        parent_id: {
            type: 'number',
            required: true,
            description: '父节点ID'
        },
        id: {
            type: 'number',
            description: '节点ID'
        },
        name: {
            type: 'string',
            description: '菜单名称'
        },
        router_name: {
            type: 'string',
            description: '路由名称'
        },
        sort: {
            type: 'number',
            description: '排序'
        },
        icon: {
            type: 'string',
            description: '图标'
        },
        path: {
            type: 'string',
            description: '地址路径'
        },
        url: {
            type: 'string',
            description: '前端路径'
        },
        type: {
            type: 'number',
            default: 1,
            description: '菜单类型'
        },
        btn_type: {
            type: 'number',
            description: '按钮类型'
        }
    })
    static async modifyMenu(ctx) {
        const data = ctx.validatedBody
        const menu = await MenuModel.modifyMenu(data)
        ctx.body = {
            STATUS: 1,
            MESSAGE: '修改成功',
            ITEMS: menu
        }
    }

    /**
     * 删除菜单
     * @static
     * @param {*} ctx
     * @memberof MenuController
     */
    @request('DELETE', '/delete/{id}')
    @summary('删除菜单')
    @description('3')
    @tag
    @path({
        id:{
            type:'number',
            required:true,
            description:'菜单ID'
        }
    })
    static async deleteMenu(ctx) {
        const { id } = ctx.params
        await MenuModel.deleteMenu(id)
        ctx.body = {
            STATUS: 1,
            MESSAGE: '删除成功',
            ITEMS: null
        }
    }
}