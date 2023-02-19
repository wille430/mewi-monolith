import {autoInjectable, inject} from "tsyringe";
import bcrypt, {compare} from "bcrypt";
import {BadRequestException, NotFoundException} from "next-api-decorators";
import crypto from "crypto";
import type {CreateUserDto} from "./dto/create-user.dto";
import type {UpdateUserDto} from "./dto/update-user.dto";
import type {RequestEmailUpdateDto, AuthorizedUpdateEmailDto} from "./dto/update-email.dto";
import type {FindAllUserDto} from "./dto/find-all-user.dto";
import type {
    ChangePasswordAuth,
    ChangePasswordNoAuth,
    ChangePasswordWithToken,
} from "./dto/change-password.dto";
import type {User} from "@mewi/entities";
import {EmailService} from "../email/email.service";
import {EmailTemplate, LoginStrategy} from "@mewi/models";
import {stringify} from "query-string";
import {ValidationException} from "@/lib/exceptions/validation.exception";
import {Listing, UserModel} from "@mewi/entities";

@autoInjectable()
export class UsersService {
    constructor(
        @inject(EmailService) private readonly emailService: EmailService
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.email = createUserDto.email.toLowerCase();

        return UserModel.create(createUserDto);
    }

    async findAll(findAllUserDto: FindAllUserDto = {}): Promise<User[] | null> {
        return UserModel.find(findAllUserDto);
    }

    async findOne(id: string): Promise<User | null> {
        return UserModel.findById(id);
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        await UserModel.findByIdAndUpdate(id, updateUserDto);

        return this.findOne(id);
    }

    async remove(id: string): Promise<User | null> {
        return UserModel.findByIdAndDelete(id);
    }

    async changePassword(
        {password, passwordConfirm}: ChangePasswordAuth,
        userId?: string
    ): Promise<void> {
        if (!userId) {
            throw new Error("userId was not provided");
        }

        if (password === passwordConfirm) {
            const newPasswordHash = await bcrypt.hash(password, 10);

            await UserModel.findByIdAndUpdate(userId, {
                password: newPasswordHash,
            });
        } else {
            throw new Error("Passwords must match");
        }
    }

    async changePasswordWithToken({
                                      password,
                                      passwordConfirm,
                                      token,
                                      email,
                                  }: ChangePasswordWithToken) {
        if (password !== passwordConfirm) {
            throw new BadRequestException("Password and password confirmation must match");
        }
        const user = await UserModel.findOne({email});
        if (!user) throw new NotFoundException();
        if (!user.passwordReset) throw new BadRequestException("User has no pending password reset");

        const isValidToken = await bcrypt.compare(token, user.passwordReset.tokenHash);
        // class-validator validates password validity
        const isValidPassword = !(await bcrypt.compare(password, user?.password ?? ""));
        if (!isValidPassword) {
            throw new ValidationException([
                {
                    property: "password",
                    constraints: {
                        isNew: "The provided password is already in use. Please provide an unique password.",
                    },
                },
            ]);
        }

        if (user.passwordReset && user.passwordReset.expiration > Date.now() && isValidToken) {
            await UserModel.findByIdAndUpdate(user.id, {
                password: await bcrypt.hash(password, 10),
                passwordReset: null,
            });
        } else {
            throw new ValidationException([
                {
                    property: "token",
                    constraints: {
                        isValid: "Token is not valid",
                    },
                },
            ]);
        }
    }

    async sendPasswordResetEmail({email}: ChangePasswordNoAuth) {
        const user = await UserModel.findOne({email});
        if (!user) return;

        if (user.loginStrategy !== LoginStrategy.LOCAL) {
            return;
        }

        const token = crypto.randomBytes(32).toString("hex");

        await UserModel.findByIdAndUpdate(user.id, {
            passwordReset: {
                tokenHash: await bcrypt.hash(token, 10),
                // expire in 15 minutes
                expiration: Date.now() + 15 * 60 * 60 * 1000,
            },
        });

        const locals = {
            link: new URL(
                `/nyttlosenord?email=${email}&token=${token}`,
                process.env.VERCEL_URL
            ).toString(),
        };

        await this.emailService.sendEmail(
            user,
            "Lösenordsåterställning",
            locals,
            EmailTemplate.FORGOTTEN_PASSWORD
        );
    }

    async updateEmail({token, oldEmail}: AuthorizedUpdateEmailDto) {
        const user = await UserModel.findOne({email: oldEmail});
        if (!user) throw new NotFoundException(`No users with email ${oldEmail} was found`);

        const isValidToken =
            user.emailUpdate && token && await compare(token, user.emailUpdate?.tokenHash);

        if (
            user.emailUpdate &&
            user.emailUpdate.expiration.getTime() > Date.now() &&
            token &&
            isValidToken
        ) {
            await UserModel.findByIdAndUpdate(user.id, {
                email: user.emailUpdate.newEmail,
                emailUpdate: null,
            });
        } else {
            throw new BadRequestException("Invalid token");
        }
    }

    async requestEmailUpdate({newEmail}: RequestEmailUpdateDto, userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) throw new NotFoundException(`No user with id ${userId} was found`);

        if (user.loginStrategy !== LoginStrategy.LOCAL) {
            throw new BadRequestException(
                "Requesting an email update is only possible for users that have signed up using email and password"
            );
        }

        const token = crypto.randomBytes(32).toString("hex");

        await UserModel.findByIdAndUpdate(user.id, {
            $set: {
                emailUpdate: {
                    tokenHash: await bcrypt.hash(token, 10),
                    newEmail,
                    // expire in 15 minutes
                    expiration: new Date(Date.now() + 15 * 60 * 60 * 1000),
                },
            },
        });

        if (process.env.NODE_ENV === "test") {
            return;
        }

        const locals = {
            link: new URL(
                `/api/users/email/verify?${stringify({
                    token,
                    oldEmail: user.email,
                })}`,
                process.env.VERCEL_URL
            ).toString(),
        };

        await this.emailService.sendEmail(
            {
                ...user,
                email: newEmail,
            },
            "Verifiera e-postadress",
            locals,
            EmailTemplate.VERIFY_EMAIL
        );
    }

    async getLikedListings(userId: string) {
        const user = await UserModel.findById(userId);
        if (!user) throw new NotFoundException(`No user with id ${userId} was found`);
        await user.populate("likedListings");

        return user.likedListings as Listing[];
    }
}
