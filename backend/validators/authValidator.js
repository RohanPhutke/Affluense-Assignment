const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const validateSignUp = (data) => {
    const {name, email, password, confirmPassword} = data;

    if(!name || !email || !password || !confirmPassword){
        return "All fields are required";
    }

    if(name.trim().length < 2 || name.trim().length > 100){
        return "Name must be between 2 and 100 characters";
    }

    if(!isValidEmail(email)){
        return "Invalid email format";
    }

    if(email.length >254){
        return "Email is too long";
    }

    if(password.length < 8 || password.length > 128){
        return "Password must be between 8 and 128 characters";
    }

    if(password != confirmPassword){
        return "Passwords do not match";
    }

    return null;
}

module.exports = validateSignUp;