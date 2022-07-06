import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_KEY, JWT_SECRET_KEY} from "../config/constants"

export const signRefreshToken = (id: string): string => {
    const payload_data = {
        id: id,
    }
    return jwt.sign(payload_data, JWT_REFRESH_TOKEN_KEY, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
        algorithm: 'HS256'
    });
}

export const verifyRefreshJwtToken = async (token: string) => {
    try {
        let tkn = jwt.verify(token, JWT_REFRESH_TOKEN_KEY, {
            algorithms: ['HS256'],
        });
        return tkn
    } catch (e: any) {
        // log_func("jwt Verification Failed", {"errMsg":e.message, "token":token}, "red")
        return ""
    }
}
export const signJwtToken = (response: any): string => {

    const payload_data = {
        name: `${response.firstName} ${response.lastName}`,
        phone: response.phone,
        blockChainAddress: response.blockchainAddress,
        id: response.id,
        shopId: response.shopId,
        role: response.role,
        roles: response.roles
    }

    // const payload_data = {
    //     ...response,
    //     name: response.name
    // }
    return jwt.sign(payload_data, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: 'HS256'
    });
}

export const verifyJwtToken = async (token: string) => {
    try {
        let tkn = jwt.verify(token, JWT_SECRET_KEY, {
            algorithms: ['HS256'],
        });
        return tkn
    } catch (e: any) {
        // logTrace("jwt Verification Failed", {"errMsg":e.message, "token":token}, "red")
        return ""
    }
}