const credentials = (req: any, res: any, next: any) => {
  const origin = req.headers.origin;
  if (['http://localhost:3000', 'http://localhost:3001'].includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};

export default credentials;
