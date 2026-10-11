const User=require("../model/user");

module.exports.renderSingup = async (req, res) => {
  res.render("users/signup");
}

module.exports.singup = async (req,res,next) => {
    try{
        let {username,email,password}=req.body;
        let newUser=new User({
            email:email,
            username:username
         })
        let regUser=await User.register(newUser, password);
        //automatic login after signup
        req.login(regUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success', 'Welcome to Airbnb');
            return res.redirect("/listing");
        })
    }
    catch(e){
        req.flash('error', e.message);
        return res.redirect("/signup");
    }
}

module.exports.renderLogin = async (req, res) => {
  res.render("users/login");
}

module.exports.login = async (req, res) => {
        req.flash('success', 'Welcome to Airbnb');
        let redirectUrl=res.locals.redirectUrl||"/listing";
        delete req.session.redirectUrl;
        return res.redirect(redirectUrl);
    }

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Successfully loggedOut!');
        res.redirect("/listing");
    })
}