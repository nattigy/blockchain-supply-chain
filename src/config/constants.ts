//local mongo uri
import dotenv from "dotenv"

dotenv.config({path: __dirname + '../../app.env'});


export const PORT = process.env.PORT || 9000
//Jwt
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "my_secret_key"
export const JWT_REFRESH_TOKEN_KEY = process.env.JWT_REFRESH_TOKEN_KEY || "my_secret_REFRESH_key"
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 400000
export const JWT_REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 4000000
export const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || 4000

//Development Env
export const NODE_ENV = process.env.NODE_ENV || "development"
export const isDevelopment = () => process.env.NODE_ENV === "development";
export const isProduction = () => process.env.NODE_ENV === "production";
export const isTest = (test: boolean) => process.env.NODE_ENV === "testing" || test;
export const isServerLocal = () => process.env.IsLocal === "true" || true


export const Roles = {
    USER: "User",
    ROOT: "Root",
    ADMIN: "Admin",
}

