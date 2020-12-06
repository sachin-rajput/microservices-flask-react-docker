const randomstring = require("randomstring");

const username = randomstring.generate();
const email = `${username}@test.com`;
const password = "greaterthanten";

describe("Index", () => {
  it("should display the page correctly if a user is not logged in", () => {
    cy.visit("/")
      .get("h1")
      .contains("Exercises") // new
      .get(".navbar-burger")
      .click()
      .get("a")
      .contains("User Status")
      .should("not.exist")
      .get("a")
      .contains("Log Out")
      .should("not.exist")
      .get("a")
      .contains("Register")
      .get("a")
      .contains("Log In")
      .get("a")
      .contains("Swagger")
      .get("a")
      .contains("Users") // new
      .get(".notification.is-warning")
      .contains("Please log in to submit an exercise.") // new
      .get(".notification.is-success")
      .should("not.exist");
  });

  // new
  it("should display the page correctly if a user is logged in`", () => {
    cy.server();
    cy.route("POST", "auth/register").as("createUser");

    // register user
    cy.visit("/register")
      .get('input[name="username"]')
      .type(username)
      .get('input[name="email"]')
      .type(email)
      .get('input[name="password"]')
      .type(password)
      .get('input[type="submit"]')
      .click()
      .wait("@createUser");

    // assert '/' is displayed properly
    cy.get("h1")
      .contains("Exercises")
      .get(".navbar-burger")
      .click()
      .get("a")
      .contains("User Status")
      .get("a")
      .contains("Log Out")
      .get("a")
      .contains("Register")
      .should("not.exist")
      .get("a")
      .contains("Log In")
      .should("not.exist")
      .get("a")
      .contains("Swagger")
      .get("a")
      .contains("Users")
      .get("button")
      .contains("Run Code")
      .get(".notification.is-warning")
      .should("not.exist")
      .get(".notification.is-success")
      .should("not.exist");
  });
});
