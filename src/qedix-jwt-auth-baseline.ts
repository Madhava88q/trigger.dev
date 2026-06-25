type JwtService = {
  verify(token: string, options?: unknown): unknown;
  decode(token: string): unknown;
};

export class QedixJwtAuthBaseline {
  constructor(private readonly jwtService: JwtService) {}

  validateToken(token: string) {
    return this.jwtService.decode(token);
  }
}

