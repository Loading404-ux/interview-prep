import { Global, Module } from "@nestjs/common";
import { ClerkAuthGuard } from "src/common/guard/clerk-auth.guard";
import { ClerkProvider } from "src/common/providers/clerk.provider";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";

@Global()
@Global()
@Module({
  imports: [UserModule],
  providers: [
    AuthService,
    ClerkProvider, // This provides 'CLERK_CLIENT'
    ClerkAuthGuard,
  ],
  exports: [
    AuthService,    // Export this
    ClerkProvider,  // Export this so 'CLERK_CLIENT' is visible
    ClerkAuthGuard,
  ],
})
export class AuthModule { }
