const jwt = require('jsonwebtoken');
const { userTypeEnum } = require('../features/enums')

module.exports ={
    async jwtHandler (req, res, next) {
        try {
            if (!req.headers.authorization) {
                return res.status(401).json({
                    success: false, 
                    message: "Token not found in request"
                });
            }
            const accessToken = req.headers.authorization.split(' ').pop();

            if (accessToken == process.env.APP_SECRET) {
                req['uuid'] = 0;
                req['level_account'] = userTypeEnum.SUPERADMIN;
                next();
            }

            const accessTokenPayload = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_KEY
            )
            const blackListedAccessToken = await redis.get(accessToken);

            if (blackListedAccessToken == 'true') {
                return res.status(403).json({
                    success: false, 
                    message: "Access token not valid"
                });
            }

            req['uuid'] = accessTokenPayload['uuid'];
            req['level_account'] = accessTokenPayload['level_account'];
            next();
        } catch (error) {
            return res.status(400).json({
                success: false, 
                message: error.message
            });
        }
    }
}