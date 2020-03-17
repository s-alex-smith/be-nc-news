const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an array", () => {
    expect(
      formatDates([
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ])
    ).to.be.an("array");
  });
  it("returns an array of objects", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const output = formatDates(input);
    expect(output[0]).to.be.an("object");
  });
  it("returns an array of objects which have the correct keys", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const output = formatDates(input);
    expect(output[0]).to.have.keys([
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes"
    ]);
  });
  it("the returned objects have the created_at value in a correct format", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1575909015,
        votes: 100
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1575909015),
        votes: 100
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("returns the date in the correct format", () => {
    const input = [
      {
        otherKey: "hello",
        created_at: 1542284514171
      },
      {
        otherKey: "hello again",
        created_at: 1416140514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        otherKey: "hello",
        created_at: new Date(1542284514171)
      },
      {
        otherKey: "hello again",
        created_at: new Date(1416140514171)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("does not mutate the original array and returns a new array", () => {
    const input = [];
    const actualResult = formatDates(input);
    expect(actualResult).to.not.equal(input);
  });
});

describe("makeRefObj", () => {
  it("returns an object", () => {
    expect(makeRefObj([{ article_id: 1, title: "A" }])).to.be.an("object");
  });
  it("returns an object where the title value is the key and where the article_id value is the new value when one item is passed", () => {
    const input = [{ article_id: 1, title: "A" }];
    const output = { A: 1 };
    expect(makeRefObj(input)).to.eql(output);
  });
  it("returns the object with the correct key & value pair when several items are passed", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    const output = { A: 1, B: 2, C: 3 };
    expect(makeRefObj(input)).to.eql(output);
  });
});

describe("formatComments", () => {
  it("returns an array", () => {
    expect(formatComments([])).to.be.an("array");
  });
  it("does not mutate the original array and returns a new array", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const refObj = {
      "this title": 1,
      "Living in the shadow of a great man": 3,
      "other title": 2
    };
    const actualResult = formatComments(input, refObj);
    expect(actualResult).to.not.equal(input);
  });
  it("returns an array in the correct format when passed one item and a reference object", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const refObj = {
      "this title": 1,
      "Living in the shadow of a great man": 3,
      "other title": 2
    };
    const output = [
      {
        author: "butter_bridge",
        article_id: 3,
        votes: 14,
        created_at: new Date(1479818163389),
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
      }
    ];
    expect(formatComments(input, refObj)).to.eql(output);
  });
  it("returns an array in the correct format when several items are passed in the array", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        belongs_to: "UNCOVERED: catspiracy to bring down democracy",
        created_by: "icellusedkars",
        votes: 16,
        created_at: 1101386163389
      }
    ];
    const refObj = {
      "this title": 1,
      "Living in the shadow of a great man": 3,
      "UNCOVERED: catspiracy to bring down democracy": 2
    };
    const output = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 3,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 3,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      },
      {
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        article_id: 2,
        author: "icellusedkars",
        votes: 16,
        created_at: new Date(1101386163389)
      }
    ];
    expect(formatComments(input, refObj)).to.eql(output);
  });
});
