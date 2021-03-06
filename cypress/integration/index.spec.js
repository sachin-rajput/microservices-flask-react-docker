describe("Index", () => {
  it("should display the page correctly if a user is not logged in", () => {
    cy.visit("/")
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
      .get(".notification.is-success")
      .should("not.exist");
  });
});
