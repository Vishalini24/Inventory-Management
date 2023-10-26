import { body,validationResult } from "express-validator";

const validateRequest = async (req,res,next)=>{
   
    //use express validator
    //1.Set up rules for validation
    const rules = [
        body('name').notEmpty().withMessage("Name is required"),
        body('price').isFloat({gt:0}).withMessage("Price should be a positive value"),
        body('imageUrl').custom((value , {req})=>{
            if(!req.file){
                throw new Error("Image is required");
            }
            return true;
        }),
    ];

    //2.run those rules
    await Promise.all(rules.map((rule) => rule.run(req)));


    //3.check if there are any errors after running the rules
    var validationErrors = validationResult(req);


    //4. if there are errors return them
    if(!validationErrors.isEmpty()){
        return res.render('new-product',{errorMessage:validationErrors.array()[0].msg});
    }

    next();
};

export default validateRequest;