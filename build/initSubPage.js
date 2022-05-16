const fs = require('fs'); // 引入fs模块
const path = require('path'); // 引入path模块
const { jsText, jsonText } = require('./assets/constants')

// 检查文件是否存在 不存在则创建
const createBaseFile = (pathArr, start, cPath) => {
    let oPath = path.resolve(__dirname, cPath)
    // 对路径数组循环创建文件夹、文件
    for(let i = start; i < pathArr.length; i++) {
        let router = path.resolve(oPath, './' + pathArr[i])
        // 当前文件夹已存在 累加路径
        if (fs.existsSync(router)) {
            oPath += '/' + pathArr[i]
        } else {
            // 路径最后一位是文件名 创建对应的文件夹以及文件
            if (i === pathArr.length - 1) {
                writeFile(router,'.js')
                writeFile(router,'.json')
                writeFile(router,'.wxml')
                writeFile(router,'.wxss')
                createFile(path.resolve(__dirname, `../subPackages/${pathArr[0]}/assets`))
                createFile(path.resolve(__dirname, `../subPackages/${pathArr[0]}/components`))
                console.log('创建成功！')
            } else {
                // 不是最后一位 创建路径对应的文件夹 并继续循环
                let res = createFile(router)
                if(res) {
                    createBaseFile(pathArr, i + 1, path.resolve(oPath, './' + pathArr[i]))
                }
            }
            // 终止循环 重新开始循环
            break;
        }
    }
}

// 创建文件夹
const createFile = (path, type) => {
    let fileName = type ? path + type : path
    if(fs.existsSync(fileName)) {
        return true
    }else {
        fs.mkdirSync(fileName)
        return true
    }
}


// 写入文件
const writeFile = (router, type) => {
    let fileName = router + type;
        console.log(filePath)
        let content = ''
    switch (type) {
        case '.js':
            content = `// ${filePath}${type}\n${jsText}`
            break;
        case '.json':
            content = jsonText
            break;
        case '.wxml':
            content = `<!-- ${filePath}${type} -->\n<text>${filePath}${type}</text>`
            break;
        case '.wxss':
            content = `/* ${filePath}${type} */`
    }
    fs.writeFile(fileName, content, { 'flag': 'a' }, function(err) {
        if (err) {
            throw err;
        }
    })
}

// 配置文件 添加路由
const createRouter = (createPath, pathArr) => {
    let filePath = path.resolve(__dirname, '../app.json')
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        let appJSON = JSON.parse(data), key = false
        console.log(appJSON)
        // 如果存在分包定义
        if(appJSON.subPackages) {
            appJSON.subPackages.forEach((item, index) => {
                if(item.root === `subPackages/${pathArr[0]}`) {
                    appJSON.subPackages[index].pages.push(createPath.replace(pathArr[0] + '/', ''))
                    fs.writeFileSync(filePath, JSON.stringify(appJSON, null, 2))
                    key = true
                }
            });
            // 新包加入
            if(!key) {
                appJSON.subPackages.push({
                    root: `subPackages/${pathArr[0]}`,
                    name: pathArr[0],
                    pages: [
                        createPath.replace(pathArr[0] + '/', '')
                    ],
                    independent: false
                })
                fs.writeFileSync(filePath, JSON.stringify(appJSON, null, 2))
            }
        }else {
            appJSON.subPackages = [{
                root: `subPackages/${pathArr[0]}`,
                name: pathArr[0],
                pages: [
                    createPath.replace(pathArr[0] + '/', '')
                ],
                independent: false
            }]
            fs.writeFileSync(filePath, JSON.stringify(appJSON, null, 2))
        }
        
    });
}
// 分包页面路由
let filePath = ''
const init = async (createPath) => {
    
    if(!createPath.includes('/')) {
        console.log('参数错误，示例：test-cli initSubPage subName/pages/index/index')
        return
    }
    if(fs.existsSync(`./subPackages/${createPath}.js`)){
        console.log('文件已存在')
        return
    }

    let pathArr = createPath.split('/')
    if(pathArr.length > 5) {
        console.error('路径格式不规范,不可超过3层')
        return
    }
    let oPath = path.resolve(__dirname, '../subPackages')
    filePath = createPath
    createFile(oPath)
    createBaseFile(pathArr, 0, '../subPackages')
    createRouter(createPath, pathArr)
    
}

module.exports = init