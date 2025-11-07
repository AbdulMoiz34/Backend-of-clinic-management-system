export const getMe = async (req, res) => {
    try {
        const user = req.user;
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};