import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User { //! apuntes 2

    _id?: string;

    @Prop({ unique: true, required: true }) //! apuntes 3 prop, poner mas decoradores en los apuntes
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ minlength: 6, required: true })
    password?: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

}


export const UserSchema = SchemaFactory.createForClass( User );
