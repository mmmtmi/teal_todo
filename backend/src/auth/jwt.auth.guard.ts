import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        if (err) {
          console.log('Error in AuthGuard:', err);
        }
        if (!user) {
          console.log('No user found in AuthGuard');
        }
        return user;
      }
}
