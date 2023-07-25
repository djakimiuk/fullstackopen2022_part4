const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const blogsCopy = [...blogs].sort((a, b) => b.likes - a.likes);
  const result = blogsCopy[0];
  delete result._id;
  delete result.url;
  delete result.__v;
  return result;
};

const mostBlogs = (blogs) => {
  const blogsCopy = [...blogs];
  const blogsByAuthorObj = _.countBy(blogsCopy, "author");
  const blogsByAuthorArr = [];
  for (const [key, value] of Object.entries(blogsByAuthorObj)) {
    blogsByAuthorArr.push({ author: key, blogs: value });
  }
  const topAuthor = _.maxBy(blogsByAuthorArr, "author");
  return topAuthor;
};

const mostLikes = (blogs) => {
  const blogsCopy = [...blogs];
  const groupedBlogsByAuthor = _.groupBy(blogsCopy, "author");
  const blogsByAuthorArr = [];
  for (const [key, value] of Object.entries(groupedBlogsByAuthor)) {
    blogsByAuthorArr.push({ author: key, likes: _.sumBy(value, "likes") });
  }
  const topLikes = _.maxBy(blogsByAuthorArr, "likes");
  return topLikes;
};
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
