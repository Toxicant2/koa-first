import roleModel from "../models/role"
import {
    query,
    path,
    body,
    prefix,
    summary,
    description,
    request,
    tags
} from "koa-swagger-decorator"
const tag = tags(["Role"])
@prefix("/role")
export default class RoleController {
    /**
     * 获取角色列表
     * @static
     * @param {*} ctx
     * @memberof RoleController
     */
    @request("GET", "/list")
    @summary("获取角色列表")
    @description("1")
    @tag
    @query({
        page: {
            type: "number",
            required: true,
            default: 1,
            description: "页码"
        },
        limit: {
            type: "number",
            required: true,
            default: 10,
            description: "数量"
        },
        name: {
            type: "string",
            description: "角色名称"
        }
    })
    static async getRoleList(ctx) {
        const data = ctx.query
        const list = await roleModel.getRoleList(data)
        ctx.body = {
            STATUS: 1,
            MESSAGE: "角色查询成功",
            ITEMS: {
                total: list.count,
                records: list.rows
            }
        }
    }

    /**
     * 获取角色所有菜单
     * @static
     * @param {*} ctx
     * @memberof RoleController
     */
    @request("GET", "/{id}/menu")
    @summary("获取角色所有菜单")
    @description("2")
    @tag
    @path({
        id:{
            type:'number',
            required: true,
            description: "角色ID"
        }
    })
    static async getMenuByRoleId(ctx) {
        const id = ctx.params.id
        const list = await roleModel.getMenuByRoleId(id)
        ctx.body = {
            STATUS: 1,
            MESSAGE: "角色菜单查询成功",
            ITEMS: list
        }
    }

    /**
     * 修改角色信息
     * @static
     * @param {*} ctx
     * @memberof RoleController
     */
    @request("POST", "/modify")
    @summary("修改角色信息")
    @description("3")
    @tag
    @body({
        id: {
            type: "number",
            default: 0,
            description: "角色唯一ID"
        },
        name: {
            type: "string",
            required: true,
            description: "角色名称"
        },
        description: {
            type: "string",
            description: "角色描述"
        },
        treeList:{
            type: "array",
            description: "角色菜单ID列表"
        }
    })
    static async modifyRole(ctx) {
        const data = ctx.request.body
        const role = await roleModel.modifyRole(data)
        if (!role) {
            ctx.body = {
                STATUS: 0,
                MESSAGE: '角色名称已存在'
            }
        } else {
            ctx.body = {
                STATUS: 1,
                MESSAGE: data.id ? '编辑成功' : '新增成功',
                ITEMS: role
            }
        }
    }

    /**
     * 删除角色
     * @static
     * @param {*} ctx
     * @memberof RoleController
     */
    @request('DELETE', '/delete/{id}')
    @summary('根据角色ID删除')
    @description('4')
    @tag
    @path({
        id: {
            type: 'string',
            required: true
        }
    })
    static async deleteRole(ctx) {
        const id = ctx.params.id
        await roleModel.deleteRole(id)
        ctx.body = {
            STATUS: 1,
            MESSAGE: '删除成功',
            ITEMS: null
        }
    }
}
