const express = require('express')
require('./utils/db')
const User = require('./utils/db')
const auth = require('./middleware/auth')
const app  = express();
app.use(express.json())
app.post('/users', async (req,res) => {
    const user = new User(req.body)
    try{
       const token =  await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e.message)
    }
})

app.post('/users/login',async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})
app.get('/users/me',auth ,async (req,res) => {
    try{
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

app.get('/users/logout',auth,async (req,res) =>{
    try{
        // req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        req.user.tokens = []
        await req.user.save();
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

app.get('/users/:id',async (req,res) => {
    console.log(req.params)
    try{
        const user = await User.findById(req.params.id)
        if(!user)
        return res.status(404).send()
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e.message)
    }
})

app.patch('/users/:id',async (req,res) =>{
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if(!user)
        return res.status(404).send()
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e.message)
    }
})

app.delete('/users/:id',async (req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user)
            return res.status(404).send()
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e.message)
    }
})
app.listen(3000)