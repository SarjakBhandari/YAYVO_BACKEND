import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserRepository } from "../repository/user.repository";
import { ConsumerRepository } from "../repository/consumer.repository";
import { RetailerRepository } from "../repository/retailer.repository";
import { JWT_SECRETS, JWT_EXPIRES_IN, BCRYPT_SALT_ROUNDS, CLIENT_URL } from "../config";
import { IUser } from "../models/user.model";
import { LoginInput, RegisterConsumerInput, RegisterRetailerInput } from "../dtos/auth.dtos";
import { HttpError } from "../errors/http.error";
import { sendEmail } from "../config/email";

const users = new UserRepository();
const consumers = new ConsumerRepository();
const retailers = new RetailerRepository();

export class AuthService {
  async registerConsumer(input: RegisterConsumerInput) {
    const existing = await users.getUserByEmail(input.email);
    if (existing) throw new HttpError(409, "Email already in use");

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);
    const user = await users.createUser(input.email, passwordHash, "consumer");

    try {
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
    } catch (err) {
      // rollback user if consumer creation fails
      await users.deleteUserByID(user._id.toString());
      throw err;
    }
  }

  async registerRetailer(input: RegisterRetailerInput) {
    const existing = await users.getUserByEmail(input.email);
    if (existing) throw new HttpError(409, "Email already in use");

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);
    const user = await users.createUser(input.email, passwordHash, "retailer");

    try {
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
    } catch (err) {
      // rollback user if retailer creation fails
      await users.deleteUserByID(user._id.toString());
      throw err;
    }
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
    return {
      success: true,
      token,
      user: { id: user._id, email: user.email, role: user.role }
    };
  }


async sendResetPasswordEmail(email?: string) {
        if (!email) {
            throw new HttpError(400, "Email is required");
        }
        const user = await users.getUserByEmail(email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRETS, { expiresIn: '1h' }); // 1 hour expiry
        const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
        const html = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`;
        await sendEmail(user.email, "Password Reset", html);
        return user;

    }

    async resetPassword(token?: string, newPassword?: string) {
        try {
            if (!token || !newPassword) {
                throw new HttpError(400, "Token and new password are required");
            }
            const decoded: any = jwt.verify(token, JWT_SECRETS);
            const userId = decoded.id;
            const user = await users.getUserByID(userId);
            if (!user) {
                throw new HttpError(404, "User not found");
            }
            const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
            await users.updateUser(userId, { passwordHash: hashedPassword });
            return user;
        } catch (error) {
            throw new HttpError(400, "Invalid or expired token");
        }
    }

}
