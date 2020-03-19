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
  it("DELETE returns 405 method not allowed", () => {
    return request(app)
      .delete("/api")
      .expect(405)
      .then(response => {
        expect(response.body).to.eql({ message: "Method not allowed" });
      });
  });
  describe("/topics", () => {
    it("GET request returns 200 and all topics available", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.keys(["topics"]);
          expect(response.body.topics).to.be.an("array");
          expect(response.body.topics[0]).to.have.keys(["slug", "description"]);
        });
    });
    it("PATCH/POST request returns 405 if unauthorised method is attempted", () => {
      return request(app)
        .patch("/api/topics")
        .expect(405)
        .then(response =>
          expect(response.body).to.eql({ message: "Method not allowed" })
        );
    });
  });
  describe("/users/:username", () => {
    it("GET request returns 200 and the selected user", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.keys(["users"]);
          expect(response.body.users[0]).to.have.keys([
            "username",
            "avatar_url",
            "name"
          ]);
          expect(response.body.users.length).to.equal(1);
          expect(response.body.users[0].username).to.equal("butter_bridge");
        });
    });
    it("GET request returns 404 and error message when nonexistent username is used in the query", () => {
      return request(app)
        .get("/api/users/does_not_exist")
        .expect(404)
        .then(response => {
          expect(response.body.message).to.equal("Not found");
        });
    });
    it("PUT requesut returns 405 method not allowed", () => {
      return request(app)
        .put("/api/users/butter_bridge")
        .expect(405)
        .then(response => {
          expect(response.body).to.eql({ message: "Method not allowed" });
        });
    });
  });
  describe("/articles", () => {
    it("GET request returns 200 and all articles available sorted by created_at column by default and in descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.keys(["articles"]);
          expect(response.body.articles[0]).to.have.keys([
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          ]);
          expect(response.body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("PATCH request returns 405 method not allowed", () => {
      return request(app)
        .patch("/api/articles")
        .expect(405)
        .then(response => {
          expect(response.body).to.eql({ message: "Method not allowed" });
        });
    });
    describe("/articles?sort_by", () => {
      it("GET request returns 200 and all articles sorted by the passed query", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.keys(["articles"]);
            expect(response.body.articles[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(response.body.articles).to.be.sortedBy("author", {
              descending: true
            });
          });
      });
      it("GET request returns 200 and all articles sorted by the passed query in ascending order as passed by the order query", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.keys(["articles"]);
            expect(response.body.articles[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(response.body.articles).to.be.sortedBy("author", {
              ascending: true
            });
          });
      });
      it("GET request returns 400 and error message bad request when non-existent query is passed", () => {
        return request(app)
          .get("/api/articles?sort_by=pink")
          .expect(400)
          .then(response => {
            expect(response.body).to.eql({ message: "Bad request" });
          });
      });
      it("GET request returns 200 and all articles filtered by username", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.keys(["articles"]);
            expect(response.body.articles[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(response.body.articles).to.be.sortedBy("author", {
              descending: true
            });
            expect(response.body.articles[0].author).to.eql("rogersop");
          });
      });
      it("GET request returns 404 not found when articles filtered by non-existent author", () => {
        return request(app)
          .get("/api/articles?author=not-an-author")
          .expect(404)
          .then(response => {
            expect(response.body).to.eql({ message: "Not found" });
          });
      });
      it("GET request returns 200 and all articles filtered by topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.keys(["articles"]);
            expect(response.body.articles[0]).to.have.keys([
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            ]);
            expect(response.body.articles).to.be.sortedBy("cats", {
              descending: true
            });
          });
      });
      it("GET request returns 404 not found when articles filtered by non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=not-a-topic")
          .expect(404)
          .then(response => {
            expect(response.body).to.eql({ message: "Not found" });
          });
      });
      it("GET request returns 200 and empty array when topic exists but has no articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.keys(["articles"]);
            expect(response.body.articles.length).to.eql(0);
          });
      });
      it("GET request returns 200 and empty array when author exists but has not written any articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.keys(["articles"]);
            expect(response.body.articles.length).to.eql(0);
          });
      });
      describe("/articles/:article_id", () => {
        it("GET request returns 200 and the selected article", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(response => {
              expect(response.body).to.be.an("object");
              expect(response.body).to.have.keys(["articles"]);
              expect(response.body.articles[0]).to.have.keys([
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
        it("GET request returns 404 not found when an non-existent article_id is passed", () => {
          return request(app)
            .get("/api/articles/500")
            .expect(404)
            .then(response => {
              expect(response.body).to.eql({
                message: "Not found"
              });
            });
        });
        it("GET request returns 400 and the correct error message when an invalid article_id is passed", () => {
          return request(app)
            .get("/api/articles/not_a_number")
            .expect(400)
            .then(response => {
              expect(response.body).to.eql({ message: "Bad request" });
            });
        });
        it("PATCH request returns 200 and returns the updated article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 10 })
            .expect(200)
            .then(response => {
              expect(response.body).to.be.an("object");
              expect(response.body).to.have.keys(["articles"]);
              expect(response.body.articles[0].votes).to.equal(110);
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
              expect(response.body.message).to.eql("Article does not exist");
            });
        });
        it("PUT returns 405 and message Method not allowed", () => {
          return request(app)
            .put("/api/articles/1")
            .expect(405)
            .then(response => {
              expect(response.body).to.eql({ message: "Method not allowed" });
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
              expect(response.body).to.have.keys(["comments"]);
              expect(response.body.comments[0]).to.have.keys([
                "body",
                "article_id",
                "author",
                "votes",
                "comment_id",
                "created_at"
              ]);
              expect(response.body.comments[0].votes).to.eql(0);
            });
        });
        it('POST request returns 400 and message bad request when one "not null" property is missing', () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({
              username: "butter_bridge"
            })
            .expect(400)
            .then(response => {
              expect(response.body).to.eql({ message: "Bad request" });
            });
        });
        it("POST request returns 404 not found when article_id does not exist", () => {
          return request(app)
            .post("/api/articles/340/comments")
            .send({ username: "butter_bridge", body: "this is a new comment" })
            .expect(404)
            .then(response => {
              expect(response.body).to.eql({ message: "Not found" });
            });
        });
        it("PUT request returns 405 method not allowed", () => {
          return request(app)
            .put("/api/articles/1/comments")
            .expect(405)
            .then(response => {
              expect(response.body).to.eql({ message: "Method not allowed" });
            });
        });
      });
      it("GET request returns 200 and an array of all comments for the given article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.keys(["comments"]);
            expect(response.body.comments[0]).to.have.keys([
              "comment_id",
              "votes",
              "author",
              "created_at",
              "body"
            ]);
          });
      });
      it("GET request returns 200 and empty array when article exists but has no comments", () => {
        return request(app)
          .get("/api/articles/3/comments")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.keys(["comments"]);
            expect(response.body.comments.length).to.eql(0);
          });
      });
      it("GET request returns 200 and an array of all comments for the given article_id filtered by author username", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=author")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.keys(["comments"]);
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
      it("GET request returns 400 and error message value does not exist when trying to filter comments by author but username does not exist", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=salexsmith")
          .expect(400)
          .then(response => {
            expect(response.body).to.eql({ message: "Bad request" });
          });
      });
      it("GET request returns 200 and an array of all comments for the given article_id filtered by created_at as default and ordered in ascending order", () => {
        return request(app)
          .get("/api/articles/1/comments?order=")
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.keys(["comments"]);
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
  });
  describe("/comments/:comments_id", () => {
    it("PATCH request returns 200 and the updated comment", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body).to.have.keys(["comment"]);
          expect(response.body.comment[0].votes).to.equal(26);
        });
    });
    it("PATCH request returns 400 and correct error message when trying to update invalid comment", () => {
      return request(app)
        .patch("/api/comments/not_a_number")
        .send({ inc_votes: 10 })
        .expect(400)
        .then(response => {
          expect(response.body).to.eql({ message: "Bad request" });
        });
    });
    it("PATCH request returns 404 not found when trying to update comment that does not exist", () => {
      return request(app)
        .patch("/api/comments/500")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(response => {
          expect(response.body.message).to.eql("Not found");
        });
    });
    it("PUT request returns 405 method not allowed", () => {
      return request(app)
        .put("/api/comments/1")
        .expect(405)
        .then(response => {
          expect(response.body).to.eql({ message: "Method not allowed" });
        });
    });
    it("DELETE request returns 204 and has no body when deleting a comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204);
    });
    it("DELETE request returns 404 and error message when trying to delete comment that does not exist", () => {
      return request(app)
        .delete("/api/comments/0")
        .expect(404)
        .then(response => {
          expect(response.body).to.eql({
            message: "Comment does not exist"
          });
        });
    });
    it("DELETE request returns 400 and error message when trying to delete comment with an invalid id", () => {
      return request(app)
        .delete("/api/comments/cats")
        .expect(400)
        .then(response => {
          expect(response.body).to.eql({ message: "Bad request" });
        });
    });
  });
});
