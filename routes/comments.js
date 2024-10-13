import { Router } from "express";
import { comments as initialComments } from "../data/comments.js";

const commentsRouter = Router();
let comments = initialComments;

/**
 * GET /comments
 */
commentsRouter.get("/", (req, res) => {
  if (req.query.userId) {
    const filteredComments = comments.filter(comment => comment.userId == req.query.userId);
    return res.json(filteredComments);
  }
  if (req.query.postId) {
    const filteredComments = comments.filter(comment => comment.postId == req.query.postId);
    return res.json(filteredComments);
  }
  res.json(comments);
});

/**
 * POST /comments
 */
commentsRouter.post("/", (req, res) => {
  const { userId, postId, body } = req.body;
  const newComment = {
    id: comments.length + 1,
    userId,
    postId,
    body,
  };
  comments.push(newComment);
  res.status(201).json(newComment);
});

/**
 * GET /comments/:id
 */
commentsRouter.get("/:id", (req, res) => {
  const comment = comments.find(comment => comment.id == req.params.id);
  if (comment) {
    res.json(comment);
  } else {
    res.status(404).send('Comment not found');
  }
});

/**
 * PATCH /comments/:id
 */
commentsRouter.patch("/:id", (req, res) => {
  const comment = comments.find(comment => comment.id == req.params.id);
  if (comment) {
    comment.body = req.body.body;
    res.json(comment);
  } else {
    res.status(404).send('Comment not found');
  }
});

/**
 * DELETE /comments/:id
 */
commentsRouter.delete("/:id", (req, res) => {
  const index = comments.findIndex(comment => comment.id == req.params.id);
  if (index !== -1) {
    comments.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send('Comment not found');
  }
});

/**
 * GET /posts/:id/comments
 */
commentsRouter.get("/posts/:id", (req, res) => {
  const postComments = comments.filter(comment => comment.postId == req.params.id);
  res.json(postComments);
});

/**
 * GET /users/:id/comments
 */
commentsRouter.get("/users/:id", (req, res) => {
  const userComments = comments.filter(comment => comment.userId == req.params.id);
  res.json(userComments);
});

/**
 * GET/posts/:id/comments?userId=<VALUE>
 */
commentsRouter.get("/posts/:id/comments", (req, res) => {
  const userId = req.query.userId;
  const postId = req.params.id;
  const userCommentsOnPost = comments.filter(comment => 
    comment.postId == postId && comment.userId == userId
  );
  res.json(userCommentsOnPost);
});

/**
 * GET/users/:id/comments?postId=<VALUE>
 */
commentsRouter.get("/users/:id/comments", (req, res) => {
  const userId = req.params.id;
  const postId = req.query.postId;
  const userCommentsOnPost = comments.filter(comment => 
    comment.userId == userId && comment.postId == postId
  );
  res.json(userCommentsOnPost);
});

export default commentsRouter;