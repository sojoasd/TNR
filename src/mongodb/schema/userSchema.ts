import logger from "../../utility/logger";
import mongoose from "mongoose";
import IUserDocument, { IUserModel, IUserFilter, IUser } from "../document/userDocument";
import DB_TABLE from "../../model/table";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    name: {
      type: String,
      index: true,
      unique: true
    },
    account: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      index: true
    },
    token: {
      type: String,
      unique: true
    },
    updatedAt: {
      type: Date,
      required: true
    }
  },
  {
    toObject: {
      transform(doc, ret): any {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    strict: false
  }
).static({
  async findUser(wheres: IUserFilter): Promise<IUser> {
    const fn = "UserSchema.findUser";

    logger.debug(fn, { wheres });
    const Users: Promise<IUserDocument[]> = await this.find(wheres, null);
    const user = Users[0];
    logger.debug(fn, { user });

    return user;
  }
});

export default function(conn: mongoose.Connection) {
  return conn.model<IUserDocument, IUserModel>(DB_TABLE.USER, UserSchema);
}
