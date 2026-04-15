import { AuthRateLimitService } from "@/modules/users/auth-rate-limit.service";
import { AuthTokenService } from "@/modules/users/auth-token.service";
import { PrismaUserRepository } from "@/modules/users/user.repository";
import { UserService } from "@/modules/users/user.service";

const userRepository = new PrismaUserRepository();

export const userService = new UserService(userRepository);
export const authTokenService = new AuthTokenService();
export const authRateLimitService = new AuthRateLimitService();
