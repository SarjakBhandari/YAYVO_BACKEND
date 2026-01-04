import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserRepository } from "../repository/user.repository";
import { ConsumerRepository } from "../repository/consumer.repository";
import { RetailerRepository } from "../repository/retailer.repository";
import { JWT_SECRETS, JWT_EXPIRES_IN, BCRYPT_SALT_ROUNDS } from "../config";
import { IUser } from "../models/user.model";
import { LoginInput, RegisterConsumerInput, RegisterRetailerInput } from "../dtos/auth.dtos";
import { HttpError } from "../errors/http.error";

const users = new UserRepository();
const consumers = new ConsumerRepository();
const retailers = new RetailerRepository();

export class AuthService {
  async registerConsumer(input: RegisterConsumerInput) {
    const existing = await users.getUserByEmail(input.email);
    if (existing) throw new HttpError(409, "Email already in use");

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);
    const user = await users.createUser(input.email, passwordHash, "consumer");

    await consumers.createConsumer({
      authId: user._id.toString(),
      fullName: input.fullName,
      username: input.username,
      phoneNumber: input.phoneNumber,
      dob: input.dob,
      gender: input.gender,
      country: input.country,
      profilePicture: input.profilePicture
    });

    return this.issueToken(user);
  }

  async registerRetailer(input: RegisterRetailerInput) {
    const existing = await users.getUserByEmail(input.email);
    if (existing) throw new HttpError(409, "Email already in use");

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);
    const user = await users.createUser(input.email, passwordHash, "retailer");

    await retailers.createRetailer({
      authId: user._id.toString(),
      ownerName: input.ownerName,
      organizationName: input.organizationName,
      username: input.username,
      phoneNumber: input.phoneNumber,
      dateOfEstablishment: input.dateOfEstablishment,
      country: input.country,
      profilePicture: input.profilePicture
    });

    return this.issueToken(user);
  }

  async login(input: LoginInput) {
    const user = await users.getUserByEmail(input.email);
    if (!user) throw new HttpError(401, "Invalid credentials");

    const match = await bcrypt.compare(input.password, user.passwordHash);
    if (!match) throw new HttpError(401, "Invalid credentials");

    return this.issueToken(user);
  }

  private issueToken(user: IUser) {
    const payload = { id: user._id, role: user.role };
    const secret: Secret = JWT_SECRETS;
    const options: SignOptions = { expiresIn: "30d" };

    const token = jwt.sign(payload, secret, options);
    return { token, user: { id: user._id, email: user.email, role: user.role } };
  }
}
