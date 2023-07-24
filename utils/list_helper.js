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
module.exports = { dummy, totalLikes, favoriteBlog };
