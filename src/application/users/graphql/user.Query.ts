import {BUserEntity} from "../models/user.model";
import {ApolloError} from "apollo-server-core";

export const UserQuery = {
    getAllUsers: async (_: any, __: any, {dataSources}: any) => {
        try {
            const users: BUserEntity[] = await dataSources.UserServices.getAllUser()
            return users
        } catch (e: any) {
            throw new ApolloError(e.message)
        }
    },
    getUserById: async (_: any, args: { id: string; }, {dataSources}: any) => {
        return await dataSources.UserServices.getUserByAddress(args.id)
    }
}
