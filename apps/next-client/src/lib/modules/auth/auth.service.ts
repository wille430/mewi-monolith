import {compare, hash} from "bcryptjs";
import {BadRequestException, ConflictException} from "next-api-decorators";
import {autoInjectable, inject} from "tsyringe";
import type SignUpDto from "./dto/sign-up.dto";
import type {LoginDto} from "./dto/login.dto";
import {UsersRepository} from "../users/users.repository";
import {User} from "@mewi/entities";
import {google} from "googleapis";
import {googleConfig} from "@/lib/google/config";
import {LoginStrategy} from "@mewi/models";

type OAuth2Client = typeof google.auth.OAuth2.prototype

@autoInjectable()
export class AuthService {
    private _googleOauth2Client: OAuth2Client | null = null;

    constructor(
        @inject(UsersRepository) private readonly usersRepository: UsersRepository
    ) {
    }

    async signUp(signUpDto: SignUpDto) {
        const {password, email} = signUpDto;

        if (await this.usersRepository.findOne({email})) {
            throw new ConflictException("User Already Exists");
        }

        const hashedPassword = await hash(password, 10);
        return this.usersRepository.create({email, password: hashedPassword});
    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;

        const user = await this.usersRepository.findOne({email});
        if (!user) {
            throw new BadRequestException("Invalid email or password");
        }

        const validPassword =
            user.password && (await compare(password, user.password));
        if (!validPassword) {
            throw new BadRequestException("Invalid email or password");
        }

        return user;
    }

    public getGoogleAuthUrl(): string {
        return this.getGoogleOauthClient().generateAuthUrl({
            scope: googleConfig.scopes,
        });
    }

    /**
     * Fetches user profile from code and creates a new local user if the
     * user does not exist already. Otherwise, the existing user will be returned.
     * @param code - The code from the Google oauth2 redirection
     */
    public async googleLogin(code: string): Promise<User> {
        // get access token
        const oauth2Client = this.getGoogleOauthClient();
        const res = await oauth2Client.getToken(code);
        const {tokens} = res;
        oauth2Client.setCredentials(tokens);

        // fetch profile information
        const {data: profile} = await google.oauth2("v2").userinfo.v2.me.get({
            auth: oauth2Client,
        });

        const existingUser = await this.usersRepository.findOne({
            email: profile.email
        });
        if (existingUser == null) {
            return this.usersRepository.create({
                email: profile.email,
                loginStrategy: LoginStrategy.GOOGLE
            });
        }

        return existingUser;
    }

    private getGoogleOauthClient() {
        if (this._googleOauth2Client == null) {
            const redirectUri = new URL(googleConfig.redirectUriPaths[0], process.env.NEXT_PUBLIC_URL).toString();
            this._googleOauth2Client = new google.auth.OAuth2(
                googleConfig.clientId,
                googleConfig.clientSecret,
                redirectUri
            );
        }

        return this._googleOauth2Client;
    }
}
