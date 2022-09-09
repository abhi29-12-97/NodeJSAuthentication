export default class Home {
  static home = (req, res) => {};

  static signUpPage = (req, res) => {
    res.render("signup", {
      title: "signup",
    });
  };

  static signInPage = (req, res) => {
    res.render("signin", {
      title: "signin",
    });
  };

  static createUser = (req, res) => {};

  static loginUser = (req, res) => {};

  static logoutUser = (req, res) => {};
}
