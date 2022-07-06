import {UserCreateInput} from "../models/user.model";
import {ApolloError} from 'apollo-server-core';

export const UserMutation = {
    createUser: async (_: any, args: { input: UserCreateInput; }, {dataSources}: any) => {
        try {
            return await dataSources.UserServices.createUser(args.input)
        } catch (e: any) {
            throw new ApolloError(e, "400")
        }
    },
}

