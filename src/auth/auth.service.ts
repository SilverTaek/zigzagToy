import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  jwtCreate(): { token: string } {
    const payload = { email: "rm@kakaostyle.com", sub: "zigzag" };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
