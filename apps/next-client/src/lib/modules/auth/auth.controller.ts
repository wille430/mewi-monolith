import type {NextApiRequest, NextApiResponse} from "next";
import {Body, Get, Post, Query, Req, Res} from "next-api-decorators";
import { inject } from "tsyringe";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import SignUpDto from "./dto/sign-up.dto";
import { WithSession } from "@/lib/middlewares/SessionGuard";
import { MyValidationPipe } from "@/lib/pipes/validation.pipe";
import { Controller } from "@/lib/decorators/controller.decorator";
import {User} from "@mewi/entities";
import {ON_AUTH_SUCCESS_GOTO} from "@/lib/constants/paths";

@Controller()
export class AuthController {
    constructor(@inject(AuthService) private authService: AuthService) {}

    @Post("/signup")
    @WithSession()
    async signUp(@Body(MyValidationPipe) signUpDto: SignUpDto, @Req() req: NextApiRequest) {
        const user = await this.authService.signUp(signUpDto);
        await this.createSessionForUser(req, user);
        return true;
    }

    @Post("/login")
    @WithSession()
    async login(@Body(MyValidationPipe) loginDto: LoginDto, @Req() req: NextApiRequest) {
        const user = await this.authService.login(loginDto);
        await this.createSessionForUser(req, user);
        return true;
    }

    @Post("/logout")
    @WithSession()
    async logout(@Req() req: NextApiRequest) {
        req.session.destroy();
        return true;
    }

    @Get("/google-signin")
    googleSignIn(@Res() res: NextApiResponse) {
        return res.redirect(this.authService.getGoogleAuthUrl());
    }

    @Get("/google-callback")
    @WithSession()
    async googleCallback(@Query("code") code: string, @Req() req: NextApiRequest, @Res() res: NextApiResponse) {
        const user = await this.authService.googleLogin(code);

        // create session for user
        await this.createSessionForUser(req, user);

        return res.redirect(ON_AUTH_SUCCESS_GOTO);
    }

    private async createSessionForUser(req: NextApiRequest, user: User): Promise<void> {
        req.session.user = {
            userId: user.id,
            email: user.email,
            roles: user.roles,
        };
        await req.session.save();
    }
}
