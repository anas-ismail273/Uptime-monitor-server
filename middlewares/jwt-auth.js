import jwt from "jsonwebtoken";

const verify = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied!");

  try {
    const decodedData = jwt.verify(token, process.env.TOKEN_SECRET);
    req.decodedData = decodedData;
  } catch (error) {
    res.status(400).send("Invalid token");
  }
  next();
};

export default verify;
