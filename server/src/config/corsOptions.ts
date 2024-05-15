const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (
      ["http://localhost:3000", "http://localhost:3001"].indexOf(origin) !==
        -1 ||
      !origin
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
