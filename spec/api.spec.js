process.env.NODE_ENV = "test";
const request = require("supertest");
const { expect } = require("chai");
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
  });
  // describe("/articles/:article_id/comments", () => {
  //   it("POST request returns 201 and the new comment added to the requested article", () => {
  //     return request(app)
  //       .post("/api/articles/3/comments")
  //       .send({ username: "butter_bridge", body: "this is a new comment" })
  //       .expect(201)
  //       .then(response => {
  //         expect(response.body).to.be.an("object");
  //         expect(response.body.comment[0]).to.eql({
  //           body: "this is a new comment",
  //           article_id: "3",
  //           author: "butter_bridge",
  //           votes: 16,
  //           created_at: new Date(now)
  //         });
  //       });
  //   });
  // });
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
          .get("/api/treasures?sort_by=votes")
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
            expect(response.body).to.be.sortedBy("votes");
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
      // it("DELETE request returns 400", () => {});
    });
  });
});
