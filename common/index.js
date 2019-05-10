const config = require('../config/index')
const nodemailer = require('nodemailer')

const http = require('http')

const bcrypt = require('bcryptjs')

const fs = require('fs')
const path = require('path')

const XLSX = require('node-xlsx').default;

class CommonTool {
    /**
     * 发送邮件
     * @param {*} email
     * @param {*} title
     * @param {*} html
     */
    static async sendEmail(email, title, html) {
        return new Promise((resolve) => {
            // 发送激活邮件
            const transporter = nodemailer.createTransport(config.emailServer)
            const mailOptions = {
                from: `"测试发送" <${config.emailServer.auth.user}>`,
                to: email,
                subject: title,
                html
            }
            transporter.sendMail(mailOptions, (error, info) => {
                resolve(error || info)
            })
        })
    }

    /**
     * 搜狐获取ip接口
     * @static
     * @returns
     * @memberof CommonTool
     */
    static async getIpBySohu() {
        return new Promise((resolve) => {
            const options = {
                hostname: 'pv.sohu.com',
                port: 80,
                path: '/cityjson?ie=utf-8'
            }
            const req = http.request(options, (res) => {
                res.setEncoding('utf8')
                res
                    .on('data', (d) => {
                        resolve(d)
                    })
                    .on('end', () => {
                        // console.log('响应中已无数据。')
                    })
            })
            req.on('error', (e) => {
                console.error('http error:', e.message)
            })
            req.end()
        })
    }

    /**
     * bcrypt编码
     * @static
     * @param {*} data
     * @param {number} [salt=10]
     * @returns
     * @memberof CommonTool
     */
    static async enBcryption(data, salt = 10) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(data, salt, (err, encrypted) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(encrypted)
                }
            })
        })
    }

    /**
     * 删除文件
     * @static
     * @param {*} file_path
     * @memberof CommonTool
     */
    static async deleteFile(file_path) {
        return new Promise((resolve,reject) => {
            const filePath = path.resolve(__dirname, `../public${file_path}`)

            if (!fs.existsSync(filePath)) {
                reject('文件不存在')
            } else {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        reject(err)
                    }
                    resolve()
                })
            }
        })

    }

    /**
     * 导出文件
     * @static
     * @param {*} ctx
     * @param {*} filename
     * @memberof CommonTool
     */
    static async exportXLSX(ctx, data, options,filename) {
        ctx.set('Content-Type', 'application/octet-stream')
        ctx.set('Content-Disposition', 'attachment; filename="' + filename + '";')
        var buffer = XLSX.build([{
            name: 'mySheetName',
            data
        }], options)

        return buffer
    }

    /**
     * 读取excel文件
     * @static
     * @param {*} ctx
     * @param {*} file
     * @memberof CommonTool
     */
    static async parseXLSX(file) {
        return XLSX.parse(file.path)
    }
}
module.exports = CommonTool
