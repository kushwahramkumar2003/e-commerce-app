import dotenv from "dotenv";
dotenv.config();
const config = {
    PORT : process.env.PORT || 5000,
    MONGODB_URL:process.env.MONGODB_URL || "mongodb://localhost:27127/e-comm",
}
export default config;
