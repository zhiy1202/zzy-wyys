const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb+srv://zzy:120200@cluster0.wmh2umy.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(url);
//建立数据库
var db = client.db('wyys')
//食谱操作
var foodConn = db.collection('food')
const foodOption ={
    //添加食谱
    addFood(food){
        let result = foodConn.insertOne(food)
        result.then(data=>{
            foodInfoOption.createFoodInfo(data.insertedId)
        })
        return result
    },
    //所有食谱
    async allFood(){
        let result = foodConn.find({}).toArray()
        return result;
    },
    //通过id删除食谱
    delFood(foodId){
        let result = foodConn.deleteOne({_id:ObjectId(foodId)})
        result.then(data=>{
            if (data.deletedCount === 1) {
                foodInfoOption.delFoodInfoById(foodId)
            }
        })
        return result
    },
    //通过bmi值 推送食谱
    queryFoodByBMI(bmi){
        let cursor = foodConn.find({bmi:bmi}).toArray()
        return cursor
    },
    //通过id获取食谱
    getFoodById(foodId){
        let result = foodConn.findOne({_id:ObjectId(foodId)})
        return result
    },
    //通过name 获取列表
    getFoodsByName(foodName){
        let str = '.*'+foodName+'.*'
        let reg = new RegExp(str)
        return foodConn.find({name:{$regex:reg}}).toArray()
    }
}
//用户操作
var userConn = db.collection('user')
const userOption = {
    //判断用户是否注册
    userIsExits(username){
        let result = userConn.findOne({username:username})
        return result
    },
    //添加用户
    addUser(user){
        let ok = true
        let isTrue = this.userIsExits(user.username)
        ok = isTrue.then(data=>{
            if (!data) {
                userConn.insertOne(user)
                return true
            }else{
                return false
            }
        })
        return ok;
    },
    //获得一个用户
    queryUser(user){
        let result = userConn.findOne({
            username:user.username,
            password:user.password
        })
        return result;
    },
    //获得所有用户
    getAllUser(){
        let allUser = userConn.find({}) // 返回cuisor
        let arr = allUser.toArray() // 返回是一个promise
        return arr;
    },
    //删除用户
    delUser(username){
        let isDel = userConn.deleteOne({username:username})
        return isDel;
    },
    //通过用户名查询用户
    getUserByName(username){
        return userConn.findOne({username:username})
    },
    //修改用户bmi
    changeBMI(message){
        return userConn.updateOne(
            {username:message.username},
            {$set:{bmi: Math.ceil(message.weight / (message.height * message.height))}}
        )
    },
    //通过id删除user
    delUserById(userId){
        return userConn.deleteOne({_id:ObjectId(userId)})
    }
}
//食谱评论操作
var commonConn = db.collection('common')
const commonOption={
    //新增评论{foodId,username,content,createTime}
    addCommon(common){
        let result = commonConn.insertOne(common)
        return result
    },
    //获取食谱所有评论
    queryCommByFoodId(foodId){
        let cursor = commonConn.find({foodId:foodId},{}).sort({createTime:-1}).toArray()
        return cursor
    }
}
//食谱信息操作
var foodInfoConn = db.collection('foodInfo')
const foodInfoOption ={
    //创建食谱信息food{id,likeCount,lookCount}
    createFoodInfo(foodInfoId){
        let foodInfo = {
            _id:foodInfoId,
            likeCount:0,
            lookCount:0
        }
        let result = foodInfoConn.insertOne(foodInfo)
        return result
    },
    //通过id删除食谱信息
    delFoodInfoById(foodInfoId){
        let result = foodInfoConn.deleteOne({_id:ObjectId(foodInfoId)})
        return result
    },
    // 通过foodInfoId查询信息
    queryFoodInfoById(foodInfoId){
        let result = foodInfoConn.findOne({_id:ObjectId(foodInfoId)})
        return result
    },
    //通过id修改信息
    updateFoodInfoById(foodInfoId){
        let result = foodInfoConn.findOne({_id:ObjectId(foodInfoId)}).then(data=>{
            let update =  foodInfoConn.updateOne(
                {_id:ObjectId(foodInfoId)}, 
                {$set:
                    {lookCount:data.lookCount+1}
                }
            )
            return update
        })
        return result
    },
    updateFoodInfoLikeById(foodInfoId){
        let result = foodInfoConn.findOne({_id:ObjectId(foodInfoId)}).then(data=>{
            let update =  foodInfoConn.updateOne(
                {_id:ObjectId(foodInfoId)}, 
                {$set:
                    {likeCount:data.likeCount+1}
                }
            )
            return update
        })
        return result
    }

}
//用户历史
var userHistoryConn = db.collection('userHistory')
const userHistoryOption = {
    //查询记录是否存在
    historyIsExist(foodId,username){
        return userHistoryConn.findOne(
            {
                foodId:foodId,
                username:username
            }
        )
    },
    //添加记录 history{username,foodId,createTime}
    addHistory(userHistory){
        return this.historyIsExist(userHistory.foodId,userHistory.username).then(data=>{
            if (data) {
                console.log('历史记录存在更新时间');
                return userHistoryConn.updateOne(
                    {_id:data._id},
                    {$set:{
                        createTime:new Date()
                    }}
                )
            }else{
                return userHistoryConn.insertOne(userHistory)
            }
        })
    },
    //删除记录
    delHistory(historyId){
        return userHistoryConn.deleteOne({_id:ObjectId(historyId)})
    },
    //查看所有记录
    queryAllHistoryByUsername(username){
        return userHistoryConn.find({username:username}).sort({createTime:-1}).toArray()
    }
}
//用户喜欢
var userLikeConn = db.collection('userLike')
const userLikeOption={
    //用户是否添加喜欢
    likeIsExist(foodId,username){
        return userLikeConn.findOne(
            {
                foodId:foodId,
                username:username
            }
        )
    },
    //添加用户喜欢 userLike{username,foodId,foodName,createTime}
    addLike(userLike){
        return this.likeIsExist(userLike.foodId,userLike.username).then(data=>{
            if (data) {
                console.log('喜欢记录存在更新时间');
                return userLikeConn.updateOne(
                    {_id:data._id},
                    {$set:{
                        createTime:new Date()
                    }}
                )
            }else{
                return userLikeConn.insertOne(userLike)
            }
        })
    },
    //删除用户喜欢
    delLike(likeId){
        return userLikeConn.deleteOne({_id:ObjectId(likeId)})
    },
    //得到所有喜欢
    queryAllLikeByUsername(username){
        return userLikeConn.find({username:username}).sort({createTime:-1}).toArray()
    }
}
module.exports = {
    foodOption,
    userOption,
    commonOption,
    foodInfoOption,
    userHistoryOption,
    userLikeOption
}
