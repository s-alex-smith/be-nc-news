process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);
const request = require("supertest");
const app = require("../app");
const knex = require("../connection");

describe("/api", () => {
  beforeEach(() => knex.seed.run());
  after(() => knex.destroy());
  describe("/topics", () => {
    it("GET request returns 200 and all topics available", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(response => {
          expect(response.body.topic).to.be.an("array");
          expect(response.body.topic[0]).to.have.keys(["slug", "description"]);
        });
    });
  });
  describe("/users/:username", () => {
    it("GET request returns 200 and the selected user", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.user[0]).to.have.keys([
            "username",
            "avatar_url",
            "name"
          ]);
          expect(response.body.user.length).to.equal(1);
          expect(response.body.user[0].username).to.equal("butter_bridge");
        });
    });
    it("GET request returns 400 and error message when nonexistent username is used in the query", () => {
      return request(app)
        .get("/api/users/does_not_exist")
        .expect(400)
        .then(response => {
          expect(response.body.message).to.equal("Value does not exist");
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET request returns 200 and the selected article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(response => {
          expect(response.body.article).to.be.an("object");
          expect(response.body.article).to.have.keys([
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          ]);
        });
    });
    it("GET request returns 400 and the correct error message when an incorrect article_id is passed", () => {
      return request(app)
        .get("/api/users/500")
        .expect(400)
        .then(response => {
          expect(response.body).to.eql({ message: "Value does not exist" });
        });
    });
    it("GET request returns 400 and the correct error message when an incorrect article_id is passed", () => {
      return request(app)
        .get("/api/users/not_a_number")
        .expect(400)
        .then(response => {
          expect(response.body).to.eql({ message: "Value does not exist" });
        });
    });
    it("PATCH request returns 202 and returns the updated article", () => {
      return request(app)
        .patch("/api/articles/2")
        .send({ inc_votes: 10 })
        .expect(202)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.article[0].votes).to.equal(10);
        });
    });
    it("PATCH request returns 400 and correct error message when trying to update invalid article", () => {
      return request(app)
        .patch("/api/articles/not_a_number")
        .send({ inc_votes: 10 })
        .expect(400)
        .then(response => {
          expect(response.body).to.eql({ message: "Bad request" });
        });
    });
    it("PATCH request returns 400 and correct error message when trying to update article that does not exist", () => {
      return request(app)
        .patch("/api/articles/500")
        .send({ inc_votes: 10 })
        .expect(400)
        .then(response => {
          expect(response.body.message).to.eql("Value does not exist");
        });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("POST request returns 201 and the new comment added to the requested article", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "butter_bridge", body: "this is a new comment" })
        .expect(201)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comment[0]).to.have.keys([
            "body",
            "article_id",
            "author",
            "votes",
            "comment_id",
            "created_at"
          ]);
        });
    });
    it('POST request returns 400 and message bad request when one "not null" property is missing', () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({
          username: "salexsmth",
          article_id: 2,
          votes: 0
        })
        .expect(400)
        .then(response => {
          expect(response.body).to.eql({ message: "Bad request" });
        });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("GET request returns 200 and an array of all comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments[0]).to.have.keys([
            "comment_id",
            "votes",
            "author",
            "created_at",
            "body"
          ]);
        });
    });
    it("GET request returns 200 and an array of all comments for the given article_id filtered by author username", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=author")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments[0]).to.have.keys([
            "comment_id",
            "votes",
            "author",
            "created_at",
            "body"
          ]);
          expect(response.body.comments).to.be.sortedBy("author", {
            descending: true
          });
        });
    });
    it("GET request returns 200 and an array of all comments for the given article_id filtered by created_at as default and ordered in ascending order", () => {
      return request(app)
        .get("/api/articles/1/comments?order=desc")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.comments[0]).to.have.keys([
            "comment_id",
            "votes",
            "author",
            "created_at",
            "body"
          ]);
          expect(response.body.comments).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
  });
  describe("/articles", () => {
    it("GET request returns 200 and all articles available", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("array");
          expect(response.body[0]).to.have.keys([
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          ]);
        });
    });
    describe("/articles?sort_by", () => {
      it("GET request returns 200 and all articles sorted by the passed query", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("array");
            expect(response.body[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(response.body).to.be.sortedBy("author", {
              descending: true
            });
          });
      });
      it("GET request returns 200 and all articles sorted by created_at by default", () => {
        return request(app)
          .get("/api/articles?sort_by=")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("array");
            expect(response.body[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(response.body).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET request returns 200 and all articles ordered by descending as default", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=desc")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("array");
            expect(response.body[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(response.body).to.be.sortedBy("author", {
              descending: true
            });
            expect(response.body[0].author).to.eql("rogersop");
          });
      });
      it("GET request returns 200 and all articles filtered by username", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("array");
            expect(response.body[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(response.body).to.be.sortedBy("author", {
              descending: true
            });
            expect(response.body[0].author).to.eql("rogersop");
          });
      });
      it("GET request returns 200 and all articles filtered by topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("array");
            expect(response.body[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(response.body).to.be.sortedBy("cats", {
              descending: true
            });
          });
      });
    });
    describe("/comments/:comments_id", () => {
      it("PATCH request returns 201 and the updated comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 10 })
          .expect(202)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body.comment[0].votes).to.equal(10);
          });
      });
      it("DELETE request returns 204 and has no body", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
    });
  });
});
