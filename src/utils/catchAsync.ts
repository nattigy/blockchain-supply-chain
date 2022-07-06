export default (func: (arg0: any, arg1: any, arg2: any) => Promise<any>) => {
    return (req: any, res: any, next: ((reason: any) => PromiseLike<never>) | null | undefined) => {
        func(req, res, next).catch(next);
    };
};
