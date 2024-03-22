import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { courses, userProgress } from "./schema";

// if we write cache infront of query then every time it does not goes to server for resource, if it has then return from here.

// Get User Progress Query
export const getUserProgress = cache(async () => {
  const { userId } = await auth(); // get the userId from clerk

  if (!userId) return null; // if user is not logged in then return null

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  }); // get the user progress from the database with the userId and also get the active course of the user if any
  return data;
});

// Get All Courses Query
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});

// Get Course by Id Query
export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    // TODO: Populate Units and Lessons
  });
  return data;
});
