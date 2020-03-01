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
      index: true
    },
    role: {
      type: String,
      required: true,
      index: true
    },
    accessToken: {
      type: String,
      unique: true
    },
    googleAccessToken: {
      type: String,
      unique: true
    },
    googleRefreshToken: {
      type: String,
      unique: true
    },
    googleTokenType: {
      type: String,
      index: true
    },
    googleIdToken: {
      type: String,
      text: true,
      index: false
    },
    googleScope: {
      type: String
    },
    updatedAt: {
      type: Number,
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
  conn.db.admin().command({ setParameter: 1, failIndexKeyTooLong: false });
  return conn.model<IUserDocument, IUserModel>(DB_TABLE.USER, UserSchema);
}
