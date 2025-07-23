const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const adminSchema=new mongoose.Schema({
    email:
    {
        type:String,
        require:true,
        unique:true    
    },
    password:
    {
        type:String,
        require:true
    },
})

adminSchema.pre('save',async function(next) {
    if(!this.isModified('password'))
    {
        return next();
    }
    try{
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next();
    }
    catch(error) {
        throw new Error('Error hashing password: ' + error.message);
    }
});

adminSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);