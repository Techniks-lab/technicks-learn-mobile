import { AuthApi } from "@/sdk/auth";
import { serverPath } from "@/sdk/setup";
import { http } from "./axios-instance";
import { BlogApi } from "@/sdk/blog";
import { BlogCategoriesApi } from "@/sdk/blog-categories";
import { GamificationApi } from "@/sdk/gamification";
import {LearnApi} from "@/sdk/learn"
import { CoursesApi } from "@/sdk/courses";

export const authController = new AuthApi(undefined, serverPath, http);
export const blogController = new BlogApi(undefined, serverPath, http);
export const blogCategoryController = new BlogCategoriesApi(
  undefined,
  serverPath,
  http,
);
export const learnController = new LearnApi(undefined, serverPath, http);
export const gamificationController = new GamificationApi(
  undefined,
  serverPath,
  http,
);
export const coursesController = new CoursesApi(
  undefined,
  serverPath,
  http,
);