
//next is used to call the next middleware in the pipeline
export const auth  = (req,res,next)=>{
    if(req.session.userEmail){
        next();
    }else{
        res.redirect('/login');
    }

}