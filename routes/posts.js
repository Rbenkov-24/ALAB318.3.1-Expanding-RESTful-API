//routes/posts.js
import { Router } from "express";
import { posts } from "../data/posts.js";

const postsRouter = Router();

/**
 * GET /api/posts
 */
postsRouter.get("/", (req, res) => {
  if (req.query.userId) {
    const filteredPosts = posts.filter(post => post.userId == req.query.userId);
    return res.json(filteredPosts);
  }
  res.json(posts);
});

/**
 * GET /api/posts/:id
 */
postsRouter.get("/:id", (req, res, next) => {
  const post = posts.find((post) => post.id == req.params.id);
  if (post) {
    res.json(post);
  } else {
    next(); //calls the custom 404 middleware
  }
});

/**
 * POST /api/posts
 */
postsRouter.post("/", (req, res) => {
  const { userId, title, content } = req.body;  

  //validate request data
  if (!userId || !title || !content) {
    return res.status(400).json({ error: "userId, title, and content are required." });
  }

  const newPost = {
    id: posts.length + 1, //increment the ID for the new post
    userId,
    title,
    content,
  };

  posts.push(newPost);  //add the new post to the posts array
  res.status(201).json(newPost);  //respond with the new post and a 201 status
});

/**
 * PATCH /api/posts/:id
 */
postsRouter.patch("/:id", (req, res) => {
  const post = posts.find(post => post.id == req.params.id);
  
  if (post) {
    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;

    res.json(post);
  } else {
    res.status(404).send('Post not found');
  }
});

/**
 * GET /api/users/:id/posts
 */
postsRouter.get("/users/:id", (req, res) => {
  const userPosts = posts.filter(post => post.userId == req.params.id);
  res.json(userPosts);
});

export default postsRouter;