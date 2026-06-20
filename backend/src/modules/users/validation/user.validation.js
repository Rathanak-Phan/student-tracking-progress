export default validateUpdateProfile = (req, res, next) => {
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name){
        return res.status(400).json({
            message: "First name and last name are required",
        });
    }

    next();
}