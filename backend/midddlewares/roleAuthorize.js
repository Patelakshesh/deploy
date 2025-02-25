const roleAuthorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.id || !req.id.role) {  // ✅ Ensure user exists
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            });
        }

        if (typeof roles === "string") {
            roles = [roles];
        }

        if (!roles.includes(req.id.role)) {
            return res.status(403).json({
                message: "Forbidden",
                success: false
            });
        }

        next();
    };
};

export default roleAuthorize;
