import {FilterQuery} from "mongoose";

export default interface Repository<T> {

    getAll(): Promise<Array<T>>;

    getOneById(id: string): Promise<T | null>;

    createOne(user: Object): Promise<T | null>;

    updateOneById(id: string, query: Object): Promise<T | null>

    deleteOneById(id: string): Promise<number>;

    findManyByQuery(query: FilterQuery<T>): Promise<Array<T>>;

    updateOneByQuery(filter: Object, data: Object): Promise<T | null>;

    findOneByQuery(query: FilterQuery<T>): Promise<T | null>;

    // this method is only for testing
    deleteAll(): Promise<number>
}

// export interface UserService  extends UserRepository{}

