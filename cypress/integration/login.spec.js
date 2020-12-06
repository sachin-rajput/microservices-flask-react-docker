const randomstring = require("randomstring");

const username = randomstring.generate();
const email = `${username}@test.com`;
const password = "greaterthanten";

describe("Login", () => {
  it("should display the sign in form", () => {
    cy.visit("/login")
      .get("h1")
      .contains("Log In")
      .get("form")
      .get("input[disabled]")
      .get(".validation-list") // new
      .get(".validation-list > .error")
      .first()
      .contains("Email is required."); // new
  });

  it("should allow a user to sign in", () => {
    // register user
    cy.visit("/register")
      .get('input[name="username"]')
      .type(username)
      .get('input[name="email"]')
      .type(email)
      .get('input[name="password"]')
      .type(password)
      .get('input[type="submit"]')
      .click();

    // log a user out
    cy.get(".navbar-burger").click();
    cy.contains("Log Out").click();

    // log a user in
    cy.get("a")
      .contains("Log In")
      .click()
      .get('input[name="email"]')
      .type(email)
      .get('input[name="password"]')
      .type(password)
      .get('input[type="submit"]')
      .click()
      .wait(100);

    // assert user is redirected to '/'
    cy.get(".notification.is-success").contains("Welcome!");
    cy.contains("Users").click();
    // assert '/all-users' is displayed properly
    cy.get(".navbar-burger").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/all-users");
    });
    cy.contains("All Users");
    cy.get("table").find("tbody > tr").last().find("td").contains(username);
    cy.get(".navbar-burger").click();
    cy.wait(300);
    cy.get(".navbar-menu").within(() => {
      cy.get(".navbar-item")
        .contains("User Status")
        .get(".navbar-item")
        .contains("Log Out")
        .get(".navbar-item")
        .contains("Log In")
        .should("not.exist")
        .get(".navbar-item")
        .contains("Register")
        .should("not.exist");
    });

    // log a user out
    cy.get("a").contains("Log Out").click();

    // assert '/logout' is displayed properly
    cy.get("p").contains("You are now logged out");
    cy.wait(300);
    cy.get(".navbar-menu").within(() => {
      cy.get(".navbar-item")
        .contains("User Status")
        .should("not.exist")
        .get(".navbar-item")
        .contains("Log Out")
        .should("not.exist")
        .get(".navbar-item")
        .contains("Log In")
        .get(".navbar-item")
        .contains("Register");
    });
  });

  it("should throw an error if the credentials are incorrect", () => {
    // attempt to log in
    cy.visit("/login")
      .get('input[name="email"]')
      .type("incorrect@email.com")
      .get('input[name="password"]')
      .type(password)
      .get('input[type="submit"]')
      .click();

    // assert user login failed
    cy.contains("All Users").should("not.exist");
    cy.contains("Log In");
    cy.get(".navbar-burger").click();
    cy.get(".navbar-menu").within(() => {
      cy.get(".navbar-item")
        .contains("User Status")
        .should("not.exist")
        .get(".navbar-item")
        .contains("Log Out")
        .should("not.exist")
        .get(".navbar-item")
        .contains("Log In")
        .get(".navbar-item")
        .contains("Register");
    });
    cy.get(".notification.is-success")
      .should("not.exist")
      .get(".notification.is-danger")
      .contains("Login failed.");

    // attempt to log in
    cy.get("a")
      .contains("Log In")
      .click()
      .get('input[name="email"]')
      .type(email)
      .get('input[name="password"]')
      .type("incorrectpassword")
      .get('input[type="submit"]')
      .click()
      .wait(100);

    // assert user login failed
    cy.contains("All Users").should("not.exist");
    cy.contains("Log In");
    cy.get(".navbar-burger").click();
    cy.get(".navbar-menu").within(() => {
      cy.get(".navbar-item")
        .contains("User Status")
        .should("not.exist")
        .get(".navbar-item")
        .contains("Log Out")
        .should("not.exist")
        .get(".navbar-item")
        .contains("Log In")
        .get(".navbar-item")
        .contains("Register");
    });
    cy.get(".notification.is-success")
      .should("not.exist")
      .get(".notification.is-danger")
      .contains("Login failed.");
  });
});
