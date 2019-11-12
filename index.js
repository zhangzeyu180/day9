const Koa = require('koa');
const app = new Koa();

const static = require('koa-static');
const path = require('path');

const bodyparser = require('koa-bodyparser');

const router = require('koa-router')();

const query = require('./db/query')

app.use(static(path.join(process.cwd(),'public')));

app.use(router.routes());

app.use(router.allowedMethods());

router.get('/api/list',async ctx => {
    let data = await query('select * from list');
    ctx.body = data;
})

router.post('/api/add',async ctx => {
    let {username,password,address,idcard,phone,sex} = ctx.request.body;

    if(username && password && idcard){
        
        let user = await query('select * from userlist where idcard=?',[idcard]);

        if(user.data.length){
            ctx.body = {
                code:0,
                msg:'此人已存在'
            }
        }else{
            let create_time = new Date();
            let data = await query('insert into list(username,password,address,idcard,phone,sex,create_time) values (?,?,?,?,?,?,?)',[username,password,address,idcard,phone,sex,create_time]);
            if(data.msg === 'error'){
                ctx.body = {
                    code:0,
                    msg:error
                }
            }else{
                ctx.body = {
                    code:1,
                    msg:"添加成功"
                }
            }
        }
    }else{
        ctx.body = {
            code:2,
            msg:"参数缺失"
        }
    }
})

router.post('/api/edit',async ctx => {
    let {username,password,address,idcard,phone,sex,id} = ctx.request.body;

    if(id && username && password && idcard){
        try{
            let create_time = new Date();
            await query('update userlist set username=?,password=?,address=?,idcard=?,phone=?,sex=?,create_time=? where id=?',[username,password,address,idcard,phone,sex,create_time,id])
            ctx.body = {
                code:1,
                msg:'修改成功'
            }
        }catch(e){
            ctx.body = {
                code:0,
                msg:e.error
            }
        }
    }else{
        ctx.body = {
            code:2,
            msg:'参数缺失'
        }
    }
})

app.listen(process.env.PORT || 3000,() => {
    console.log("服务启动成功")
})