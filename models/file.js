const theDatabase = require('../config/db').theDb
const attachmentSchema = theDatabase.import('../schema/attachment.js')

const config = require('../config/index')
const fs = require('fs')
const path = require('path')

export default class fileModel {
    /**
     * 上传文件
     * @static
     * @param {*} file
     * @param {*} data
     * @returns
     * @memberof fileModel
     */
    static async fileUpload(file, data) {
        const reader = fs.createReadStream(file.path)
        const filePath = path.resolve(__dirname, `../public/${config.uploadPath}`)
        const fileName = `${new Date().getTime()}_${file.name}`
        const fileResource = filePath + '/' + fileName

        const attachmentList = [{
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_path: config.uploadPath + '/' + fileName,
            business_type: data.business_type
        }]
        if (!fs.existsSync(filePath)) {
            fs.mkdir(filePath, async(error) => {
                if (error) {
                    throw new Error(error)
                } else {
                    const stream = fs.createWriteStream(fileResource)
                    reader.pipe(stream)
                    return await attachmentSchema.bulkCreate(attachmentList)
                }
            })
        } else {
            const stream = fs.createWriteStream(fileResource)
            reader.pipe(stream)
            return await attachmentSchema.bulkCreate(attachmentList)
        }
    }
}
