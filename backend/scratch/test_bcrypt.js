import bcrypt from "bcrypt";
import bcryptjs from "bcryptjs";

const test = async () => {
    const password = "admin123";
    const hash = await bcrypt.hash(password, 10);
    console.log("Native Hash:", hash);
    
    const matchNative = await bcrypt.compare(password, hash);
    console.log("Native match:", matchNative);

    const matchJS = await bcryptjs.compare(password, hash);
    console.log("JS match:", matchJS);
};

test();
