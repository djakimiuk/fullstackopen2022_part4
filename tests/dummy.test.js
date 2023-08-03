 const listHelper = require("../utils/list_helper");
const list = require("../utils/listOfBlogs");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const emptyList = [];

  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes(emptyList);
    expect(result).toBe(0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(list.blogs);
    expect(result).toBe(36);
  });
});

describe("favorite blog", () => {
  test("of a list of blogs, returns object with most liked one", () => {
    const result = listHelper.favoriteBlog(list.blogs);
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("most blogs", () => {
  test("of the most common blog author, reutrns the object with the author and number of blogs", () => {
    const result = listHelper.mostBlogs(list.blogs);
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });

  describe("most likes", () => {
    test("of the top amount of total likes, returns the object with the autohor and number of total likes", () => {
      const result = listHelper.mostLikes(list.blogs);
      expect(result).toEqual({
        author: "Edsger W. Dijkstra",
        likes: 17,
      });
    });
  });
});
