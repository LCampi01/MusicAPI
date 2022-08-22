const Error = include('helpers/error');

module.exports = (req, res, next) => {
    const header = req.get('Authorization');
    if (!header) {
        return res.sendStatus(Error.UNAUTHORIZED);
    }
    try {
        req.user = JSON.parse(req.get('user') || '{}');
        return next();
    } catch (err) {
        return res.sendStatus(Error.UNAUTHORIZED);
    }

};
