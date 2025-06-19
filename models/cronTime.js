const mongoose=require("mongoose")

const cronSchema=new mongoose.Schema({
    crontime:{
        type:String,
        default:"* 0 2 * * *",
    }
})

const Cron = mongoose.model("Cron", cronSchema);
module.exports = Cron;
