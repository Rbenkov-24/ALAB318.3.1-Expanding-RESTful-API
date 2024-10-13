import { Router } from "express";
import { users } from "../data/users.js";
import { posts } from "../data/posts.js";
import { error } from "../utils/error.js";

const usersRouter = Router();

/**
 * GET all users
 */
usersRouter.get("/", (req, res, next) => {
  res.json(users);
});

/**
 * GET user by id
 */
usersRouter.get("/:id", (req, res, next) => {
  const user = users.find((user) => user.id == req.params.id);
  if (user) {
    res.json(user);
  } else {
    next(error(404, "Resource not found!")); 
  }
});

/**
 * POST create new user
 */
usersRouter.post("/", (req, res, next) => {
  const { name, username, email } = req.body;

  //check for missing fields
  if (!name || !username || !email) {
    return next(error(400, "Name, username, and email are required."));
  }

  //check if the username is already taken
  if (users.find((u) => u.username == username)) {
    return res.status(400).json({ error: "Username already taken" });
  }

  //create new user object
  const newUser = {
    id: users[users.length - 1].id + 1,
    name,
    username,
    email,
  };

  //add new user to users array
  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * PATCH or update user by id
 */
usersRouter.patch("/:id", (req, res, next) => {
  const user = users.find((u, i) => {
    if (u.id == req.params.id) {
      for (const key in req.body) {
        users[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (user) {
    res.json(user);
  } else {
    next(error(404, "User not found!"));
  }
});

/**
 * DELETE user by id
 */
usersRouter.delete("/:id", (req, res, next) => {
  const userIndex = users.findIndex((u) => u.id == req.params.id);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(204).send(); 
  } else {
    next(error(404, "User not found!"));
  }
});

/**
 * GET all posts by a specific user by user id
 */
usersRouter.get("/:id/posts", (req, res, next) => {
  const userPosts = posts.filter((post) => post.userId == req.params.id);

  if (userPosts.length > 0) {
    res.json(userPosts); //return posts if found
  } else {
    next(error(404, "Posts not found for this user!"));
  }
});

export default usersRouter;