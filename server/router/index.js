const express = require('express');
const formidable = require('formidable');
const fs = require('fs')
const path = require('path')
const router = express.Router()
const {
    foodOption,
    userOption,
    foodInfoOption,
    commonOption,
    userHistoryOption,
    userLikeOption} = require('../db/mongodb');

//=====食谱操作=====//
//添加食谱
router.post('/addFood',(req,res)=>{
    var form = formidable({ multiples: true});
    var form = new formidable.IncomingForm()
    form.uploadDir = "./static/" // 上传目录
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        console.log(files);
        let arr = files.file.originalFilename.split('.')
        let fix = arr[arr.length-1]
        let fileName = files.file.newFilename +'.'+ fix
        console.log(fileName);
        let parent = path.dirname(__dirname)
        console.log(parent);
        fs.renameSync(parent+'/static/invalid-name',parent+'/static/'+fileName)
        let foodPath = 'http://localhost:8080/static/'+fileName
        fields['foodPath'] = foodPath
        console.log(fields);
        foodOption.addFood(fields).then(data => {
            res.json('保存食谱成功')
        })
    })

    
})
//获取所有食谱
router.get('/allFood',(req,res)=>{
    let result = foodOption.allFood()
    result.then(cursor =>{
        res.send(cursor)
    })
})
//修改食谱

//删除食谱
router.delete('/delFood',(req,res)=>{
    let foodId = req.query.foodId
    foodOption.delFood(foodId).then(data => {
        if (data.deletedCount === 1) {
            res.json(true)
        }else{
            res.json(false)
        }
    })
})

//获取bmi值推送的食谱
router.get('/getGoodFood',(req,res)=>{
    let bmi = req.query.bmi
    foodOption.queryFoodByBMI(bmi).then(cursor=>{
        res.json(cursor)
    })
})
//通过foodId 查询
router.get('/getFoodById',(req,res)=>{
    let foodId = req.query.foodId
    foodOption.getFoodById(foodId).then(data=>{
        console.log(data);
        if (data) {
            res.json(data)
        }
    })
})
//通过name 获取列表
router.get('/getFoodsByName',(req,res)=>{
    let foodName = req.query.foodName
    foodOption.getFoodsByName(foodName).then(data=>{
        res.json(data)
    })
})

//==============评论=================//
//添加评论common{foodId,username,content,createTime}
router.post('/addComm',(req,res)=>{
    let body = req.body
    console.log(body);
    commonOption.addCommon(body).then(
        res.json(true)
    )
})

//删除评论 commId

//获取食谱的所有评论 foodId
router.get('/getFoodComm',(req,res)=>{
    let foodId = req.query.foodId
    commonOption.queryCommByFoodId(foodId).then(arr=>{
        res.json(arr)
    })
})
//================食谱信息=============//
//创建食谱信息
//删除食谱信息
//修改食谱信息
router.put('/changeLook',(req,res)=>{
    let foodInfoId = req.query.foodInfoId
    let result = foodInfoOption.updateFoodInfoById(foodInfoId)
    result.then(data=>{
        if (data.acknowledged) {
            res.json('更新成功')
        }else{
            res.json('更新失败')
        }
    })
})
router.put('/changeLike',(req,res)=>{
    let foodInfoId = req.query.foodInfoId
    let result = foodInfoOption.updateFoodInfoLikeById(foodInfoId)
    result.then(data=>{
        if (data.acknowledged) {
            res.json(true)
        }else{
            res.json(false)
        }
    })
})
//查询食谱信息
router.get('/foodInfo',(req,res)=>{
    let foodInfoId= req.query.foodInfoId
    foodInfoOption.queryFoodInfoById(foodInfoId).then(data=>{
        res.json(data)
    })
})

//=============用户===============//

//获取所有用户
router.get('/allUser',(req,res)=>{
    let userArr = userOption.getAllUser()
    userArr.then(cursor=>{
        res.json(cursor)
    })
})

//用户注册
router.post('/register',(req,res)=>{
    let body = req.body
    let result = userOption.addUser(body)
    result.then(data=>{
        if (data) {
            res.json(true)
        }else{
            res.json(false)
        }

    })
})

//查询用户
router.post('/login',(req,res)=>{
    let body = req.body
    let isLogin = userOption.queryUser(body)
    isLogin.then(data=>{
        if (data) {
            res.cookie('user',body.username)
            res.json(true)
        }else{
            res.json(false)
        }
    })
})
//通过username 查询用户
router.get('/getUserByName',(req,res)=>{
    let username = req.query.username;
    userOption.getUserByName(username).then(data=>{
        console.log(data);
        res.json(data)
    })
})

//用户修改
router.put('/changeBMI',(req,res)=>{
    let body = req.body
    userOption.changeBMI(body).then(data=>{
        if (data.acknowledged) {
            res.json(true)
        }else{
            res.json(false)
        }
    })
})

//通过username删除用户
router.delete('/delUser',(req,res)=>{
    let username = req.query.username
    let result = userOption.delUser(username)
    result.then(data=>{
        if (data.deletedCount === 1) {
            res.json(true)
        }else{
            res.json(false)
        }
    })

})
//通过id删除用户
router.delete('/delUserById',(req,res)=>{
    let userId = req.query.userId
    userOption.delUserById(userId).then(data=>{
        if(data.deletedCount === 1){
            res.json(true)
        }else{
            res.json(false)
        }
    })
})
//======用户喜欢=======//
router.post('/addLike',(req,res)=>{
    let body = req.body
    console.log(body);
    userLikeOption.addLike(body).then(data=>{
        if (data.acknowledged) {
            res.json('添加喜欢成功')
        }else{
            res.json('更新成功')
        }
    })
})
//获取用户所有喜欢记录
router.get('/getAllLike',(req,res)=>{
    let username = req.query.username
    userLikeOption.queryAllLikeByUsername(username).then(data=>{
        res.json(data)
    })
})
//删除喜欢记录
router.delete('/delLike',(req,res)=>{
    let likeId = req.query.likeId
    userLikeOption.delLike(likeId).then(data=>{
        if (data.deletedCount === 1){
            res.json('删除成功')
        }else{
            res.json('删除失败')
        }
    })
})

//======用户历史======//
//添加历史记录
router.post('/addHistory',(req,res)=>{
    let body = req.body
    userHistoryOption.addHistory(body).then(data=>{
        if (data.acknowledged) {
            res.json('添加历史记录成功')
        }else{
            res.json('更新成功')
        }
    })
})
//获取用户所有历史记录
router.get('/getAllHistory',(req,res)=>{
    let username = req.query.username
    userHistoryOption.queryAllHistoryByUsername(username).then(data=>{
        res.json(data)
    })
})
//删除历史记录
router.delete('/delHistory',(req,res)=>{
    let historyId = req.query.historyId
    userHistoryOption.delHistory(historyId).then(data=>{
        if (data.deletedCount === 1){
            res.json('删除成功')
        }else{
            res.json('删除失败')
        }
    })
})

//========管理员========//
//登录
router.post('/admin/login',(req,res)=>{
    let body = req.body
    if ('admin' === body.username && 'admin' === body.password) {
        res.redirect('/user')
    }else{
        res.send('密码错误')
    }
})
//welcome页面
router.get('/admin',(req,res)=>{
    res.render('welcome')
})
//index页面
router.get('/user',(req,res)=>{
    res.render('index')
})
//food 页面
router.get('/food',(req,res)=>{
    res.render('food')
})
//addFood页面
router.get('/addFood',(req,res)=>{
    res.render('addFood')
})
module.exports = router;