const fileModel = require('../models/file')
import {
    request,
    summary,
    description,
    formData,
    tags,
    prefix
} from 'koa-swagger-decorator'
const tag = tags(['File'])
@prefix('/file')
class fileController {
    /**
     * 上传文件
     * @static
     * @param {*} ctx
     * @memberof fileController
     */
    @request('POST', '/upload')
    @summary('上传附件')
    @description('1')
    @tag
    @formData({
        file: {
            type: 'file',
            required: true,
            description: '支持多文件上传'
        },
        business_type: {
            type: 'number',
            required: true,
            description: '附件业务类型 1:用户头像'
        }
    })
    static async fileUpload(ctx) {
        const file = ctx.request.files.file
        const data = ctx.request.body
        const attachmentList = await fileModel.fileUpload(file, data)
        ctx.body = {
            STATUS: 1,
            MESSAGE: '上传成功',
            ITEMS: attachmentList
        }
    }
}

module.exports = fileController
