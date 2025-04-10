export const auth = jest.fn().mockImplementation((config) => {
  return (req: any, res: any, next: any) => {
    req.oidc = {
      isAuthenticated: () => true,
      user: {
        sub: 'test|123',
        email: 'test@example.com'
      }
    };
    next();
  };
});

export const requiresAuth = jest.fn().mockImplementation(() => {
  return (req: any, res: any, next: any) => next();
});