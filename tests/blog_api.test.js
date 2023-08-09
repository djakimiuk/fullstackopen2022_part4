const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await helper.hashPassword(helper.initialUser.password);
  const user = new User({
    username: helper.initialUser.username,
    passwordHash,
  });
  await user.save();

  const blogObject = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user._id })
  );
  const promiseArrayBlogs = blogObject.map((blog) => blog.save());
  await Promise.all(promiseArrayBlogs);
});

describe("when there is initially some blogs saved", () => {
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
});

describe("viewing a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];
    blogToView.user = blogToView.user.toString();

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    console.log(blogsAtStart, "blogsAtstart");
    console.log(resultBlog.body, "resultblogbody");

    expect(resultBlog.body).toEqual(blogToView);
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test(`fails with statuscode 400 if id is invalid`, async () => {
    const invalidId = `64cac2e9792d5c5ccb4cd3c`;

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("addition of a new blog", () => {
  test("a valid blog can be added", async () => {
    const userData = await helper.getUserToken(
      helper.initialUser.username,
      helper.initialUser.password
    );

    const newBlog = {
      title: "TEST3",
      author: "JAKIMIEC",
      url: "http://x2.com",
      likes: 69,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userData.token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const urls = blogsAtEnd.map((blog) => blog.url);

    expect(urls).toContain("http://x2.com");
  });

  test("blog without url is not added", async () => {
    const userData = await helper.getUserToken(
      helper.initialUser.username,
      helper.initialUser.password
    );

    const newBlog = {
      title: "TEST4",
      author: "JAKIMIEC",
      likes: 69,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userData.token}`)
      .send(newBlog)
      .expect(400);

    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blog without title is not added", async () => {
    const userData = await helper.getUserToken(
      helper.initialUser.username,
      helper.initialUser.password
    );

    const newBlog = {
      author: "JAKIMIEC",
      likes: 69,
      url: "http://x2.com",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${userData.token}`)
      .send(newBlog)
      .expect(400);

    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("fails with statuscode 401 if a token is not provided", async () => {
    const newBlog = {
      author: "JAKIMIEC",
      likes: 69,
      url: "http://x2.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const userData = await helper.getUserToken(
      helper.initialUser.username,
      helper.initialUser.password
    );

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${userData.token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const urls = blogsAtEnd.map((blog) => blog.url);

    expect(urls).not.toContain(blogToDelete.url);
  });
});

describe("edition of a blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const userData = await helper.getUserToken(
      helper.initialUser.username,
      helper.initialUser.password
    );

    const blogsAtStart = await helper.blogsInDb();
    const blogToEdit = blogsAtStart[0];

    const editedBlog = {
      title: "test",
      author: "DAWID",
      url: "http://google.pl",
      likes: 5,
    };

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .set("Authorization", `Bearer ${userData.token}`)
      .send(editedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd[0].likes).toBe(5);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
