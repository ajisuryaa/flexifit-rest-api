const jwt = require('jsonwebtoken');
const { accountModel } = require('../models');
const { hashPassword, comparePassword } = require('../../tools/hash');
const redis = require('../../tools/redis');

class AuthenticationController {
    constructor() {
        this.prefix = 'auth';
    }

    async login(req, res) {
        console.log(req.body);
        try {
            const user = await accountModel.findOne({
                where: {
                    email: req.body.email,
                }
            });

            if (!user) {
                return res.status(200).json({
                    success: false,
                    message: 'Wrong Email',
                });
            }

            let matchingPassword = await comparePassword(req.body.password, user.password);
            if (!matchingPassword) {
                return res.status(200).json({
                    success: false,
                    message: 'Password is not match',
                });
            }

            const accessToken = jwt.sign(
                {
                    'name': user.name,
                    'email': user.email,
                    'user_id': user.id,
                    'user_type': user.type
                },
                process.env.ACCESS_TOKEN_KEY,
                { expiresIn: '15m', }
            );
            const refreshToken = jwt.sign(
                {
                    'name': user.name,
                    'email': user.email,
                    'user_id': user.id,
                    'user_type': user.type
                },
                process.env.REFRESH_TOKEN_KEY,
                { expiresIn: '1d', }
            );
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });

            const dataUser = await accountModel.findOne({
                where: {
                    email: req.body.email,
                },
                attributes: ['uuid', 'email', 'image', 'name', 'phone', 'level_account']
            });

            return res.status(200).json({
                success: true,
                message: 'Login success',
                access_token: accessToken,
                refresh_token: refreshToken,
                data: dataUser
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async logout(req, res) {
        try {
            const accessToken = req.headers.authorization.split(' ').pop();
            const refreshToken = req.cookies.refresh_token;

            const accessTokenPayload = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_KEY
            );
            const refreshTokenPayload = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_KEY
            );
            // Get the current time as a Unix timestamp
            const currentTime = Math.floor(Date.now() / 1000);
            const accessTokenLife = accessTokenPayload.exp - currentTime;
            const refreshTokenLife = refreshTokenPayload.exp - currentTime;
            // Blacklist the tokens
            await redis.setEx(accessToken, accessTokenLife, 'true');
            await redis.setEx(refreshToken, refreshTokenLife, 'true');

            res.clearCookie('refresh_token', { httpOnly: true, path: '/' });

            return res.status(200).json({
                success: true,
                message: 'Logout Success',
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    async refresh(req, res) {
        try {
            const refreshToken = req.cookies.refresh_token;

            if (refreshToken == undefined) {
                return res.status(200).json({
                    success: false,
                    message: "Access Denied, No refresh token found"
                });
            }

            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
            const blackListedRefreshToken = await redis.get(refreshToken);

            if (blackListedRefreshToken == 'true') {
                return res.status(200).json({
                    success: false,
                    message: "Access Denied"
                });
            }

            const newAccessToken = jwt.sign(
                {
                    'name': payload.name,
                    'email': payload.email,
                    'user_id': payload.user_id,
                    'user_type': payload.user_type
                },
                process.env.ACCESS_TOKEN_KEY,
                {
                    expiresIn: '15m',
                }
            );
            // Get the current time as a Unix timestamp (seconds since the epoch)
            const currentTime = Math.floor(Date.now() / 1000);
            const refreshTokenExpiration = payload.exp;

            // refresh token life left less than access token life
            if (refreshTokenExpiration - currentTime < 900) {
                const newRefreshToken = jwt.sign(
                    {
                        'name': payload.name,
                        'email': payload.email,
                        'user_id': payload.user_id,
                        'user_type': payload.user_type
                    },
                    process.env.REFRESH_TOKEN_KEY,
                    {
                        expiresIn: '1d',
                    }
                );
                res.cookie('refresh_token', newRefreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Refresh success',
                access_token: newAccessToken,
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

const authenticationController = new AuthenticationController();
module.exports = authenticationController;