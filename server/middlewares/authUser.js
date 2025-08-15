import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.user = { id: tokenDecode.id }; // ✅ Store in req.user
            next();
        } else {
            return res.status(401).json({ success: false, message: "Not Authorized" });
        }
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

export default authUser;
