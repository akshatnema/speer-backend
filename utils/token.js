// Desc: Token utility functions

// Extract token from request header and return it
const extractToken = async (req) => {
    const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return { status: 401, message: 'No Authorization header provided'}
  }

  const [bearer, token] = authorizationHeader.split(' ');

  if (bearer.toLowerCase() !== 'bearer' || !token) {
    return { status: 401, message: 'Invalid Authorization header format'}
  }
  return { status: 200, message: token };
}

export { extractToken };