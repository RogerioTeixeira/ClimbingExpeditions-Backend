import { Model , Document } from 'mongoose'
export class BaseResolver<T extends Document>{

    constructor(protected model: Model<T>) {}

    public async save(data: any): Promise<T> {
        return await this.model.create(data);
    }

    public async findById(id: string): Promise<T> {
        return await this.model.findById(id);
    }

    public async findOne(query:any): Promise<T> {
        return await this.model.findOne(query);
    }
    public async find(query?:any): Promise<T[]> {
        return await this.model.find(query);
    }

    public async delete(query: any): Promise<T> {
        return await this.model.deleteOne(query);
    }

    public async deleteById(id: string): Promise<T> {
        return await this.delete({id:id});
    }

}