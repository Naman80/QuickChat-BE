import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";

const connectionString = `${process.env.DATABASE_URL}`;
const enableLogs = false;

const adapter = new PrismaPg({ connectionString });
let prisma = enableLogs
  ? new PrismaClient({ adapter, log: ["query"] })
  : new PrismaClient({ adapter });

export { prisma };
