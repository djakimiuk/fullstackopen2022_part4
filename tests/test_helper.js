const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const initialBlogs = [
  {
    title: "test",
    author: "DAWID",
    url: "http://google.pl",
    likes: 3,
  },
  {
    title: "TEST2",
    author: "JAKIM",
    url: "http://x.com",
    likes: 3,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author: "willremovethissson",
    url: "http://willremovethissoon.pl",
    likes: 0,
  });

  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const initialUser = { username: "testUser", password: "testUser" };

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const getUserToken = async (username, password) => {
  const response = await api.post("/api/login").send({
    username: username,
    password: password,
  });
  return response.body;
};

module.exports = {
  initialBlogs,
  initialUser,
  nonExistingId,
  blogsInDb,
  usersInDb,
  hashPassword,
  getUserToken,
};
