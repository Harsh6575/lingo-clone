import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { courses, units, userProgress } from "./schema";

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

export const getUnits = cache(async () => {
  const userProgress = await getUserProgress();
  if (!userProgress?.activeCourseId) return [];

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: true,
            },
          },
        },
      },
    },
  });
  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        );
      });
      return {
        ...lesson,
        completed: allCompletedChallenges,
      };
    });
    return {
      ...unit,
      lessons: lessonsWithCompletedStatus,
    };
  });
  return normalizedData;
});
