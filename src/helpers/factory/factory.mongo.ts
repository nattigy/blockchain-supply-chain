import * as Mongoose from "mongoose";
import {FilterQuery, QueryOptions, UpdateQuery} from "mongoose";
// import APIFeatures from "./apiFeatures";
import {logTrace} from "../../utils/logger"
import APIFeatures from "../apiFeatures";


export async function findManyByQuery<Type>(Model: Mongoose.Model<Type>, query: Object = {}, prefix: string, value: string) {
    // let options: QueryOptions = { lean: false }
    let filter = {};
    // if (prefix !==""){
    //     filter = {prefix: value};
    // }
    logTrace("query==", query, "BgCyan")

    // @ts-ignore
    const features = new APIFeatures(Model.find(filter), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    //
    return await features.query;

    // return Model.find(query)
}

export async function findMany<Type>(Model: Mongoose.Model<Type>) {
    return Model.find({})
}

export async function findOneByQuery<Type>(Model: Mongoose.Model<Type>, query: FilterQuery<Type>, options: QueryOptions = {lean: false}) {
    return Model.findOne(query, null, options);
}

export async function findOneById<Type>(Model: Mongoose.Model<Type>, id: string) {
    return Model.findById({_id: id}).select("-__v")
}


export async function CreateOne<Type>(Model: Mongoose.Model<Type>, input: Object) {
    logTrace('creating-->', input)
    try {
        const usr = await Model.create(input)
        usr.id = usr._id
        logTrace("se", usr)
        return usr
    } catch (e: any) {
        logTrace("MongoCreationError", e.message, "BgRed")
        return Promise.reject(e)
    }


}

export async function CreateMany<Type>(Model: Mongoose.Model<Type>, items: Array<Mongoose.Model<Type>>) {
    return Model.insertMany(items)
}


export async function updateOneById<Type>(Model: Mongoose.Model<Type>, id: string, query: UpdateQuery<Type>) {
    logTrace(`updatingONeById--${id}`, query, "yellow")
    try {
        const user = await Model.findByIdAndUpdate(id, query, {
            new: true,
            runValidators: true,
        })
        logTrace("updatedUser==", user, "BgGreen")
        return user
    } catch (e: any) {
        logTrace("update one error==", e.message, "BgRed")
        throw new Error(e.message)
    }


}

export async function updateOneByQuery<Type>(Model: Mongoose.Model<Type>, filter: FilterQuery<Type>, query: UpdateQuery<Type>) {
    return Model.findOneAndUpdate(filter, query)
}

export async function upsertOneByQuery<Type>(Model: Mongoose.Model<Type>, filter: FilterQuery<Type>, query: UpdateQuery<Type>) {
    return Model.findOneAndUpdate(filter, query, {
        upsert: true,
        runValidators: true,
    })
}

export async function deleteOneById<Type>(Model: Mongoose.Model<Type>, id: string) {

    logTrace("deleting ", id)
    const res = await Model.findByIdAndDelete(id)
    if (res) {
        console.log("res=", res)

        return 1
    }
    return 0
}

export async function deleteAll<Type>(Model: Mongoose.Model<Type>) {
    let res = await Model.deleteMany({});
    return res.deletedCount ? res.deletedCount : 0

}

