const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObject = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObject.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("all blogs have unique identifier named id", async () => {
  const response = await api.get("/api/blogs");
  const ids = response.body.map((blog) => blog.id);
  expect(ids).toBeDefined();
}, 100000);

test("all blogs are returend", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("a specific url is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const urls = response.body.map((blog) => blog.url);
  expect(urls).toContain("http://google.pl");
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "TEST3",
    author: "JAKIMIEC",
    url: "http://x2.com",
    likes: 69,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const urls = blogsAtEnd.map((blog) => blog.url);

  expect(urls).toContain("http://x2.com");
});

test("blog without url is not added", async () => {
  const newBlog = {
    title: "TEST4",
    author: "JAKIMIEC",
    likes: 69,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "JAKIMIEC",
    likes: 69,
    url: "http://x2.com",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
