import { cache } from "react";
import db from "./drizzle";

// Get All Courses Query
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});

// if we write cache infront of query then every time it does not goes to server for resource, if it has then return from here.
