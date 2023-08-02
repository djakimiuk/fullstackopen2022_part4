const Blog = require("../models/blog");

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

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
