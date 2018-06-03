import * as mongoose from 'mongoose';
export interface User {
    uid: String;
    email: string
    name: string
    lastSignin: Date; 
}

export interface UserDocument extends mongoose.Document , User {
    
}

export const UserSchema = new mongoose.Schema({
    uid: { type: String, require: true, index: true, unique: true },
    email: { type: String, require: true, index: true, unique: true },
    name: { type: String },
    lastSignin: {
        type: Date,
        default: Date.now
    }
},{timestamps: true, minimize: false})

UserSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   
        delete ret._id  
    }
  });

export const userModel = mongoose.model<UserDocument>('User', UserSchema)
