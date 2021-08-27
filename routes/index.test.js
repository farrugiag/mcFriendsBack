const app = require("../app");
const request = require("supertest");

// test(/** Explication du test: String*/, /**callback du test: Function*/ */)

test("Login - Body correct", async () => {
  await request(app)
    .post("/login")
    .send({ email: "geoffroy@lacapsule.io", password: "abcdef" })
    .expect(200)
    .expect({
      result: true,
      token: 123456,
    });
});

test("Login - Body correct", async () => {
  await request(app)
    .post("/login")
    .send({ email: "lucas@lacapsule.io", password: "ghijkl" })
    .expect(200)
    .expect({
      result: true,
      token: 789012,
    });
});

test("Login - Body incorrect", async () => {
  await request(app)
    .post("/login")
    .send({ mail: "geoffroy@lacapsule.io", pass: "abcdef" })
    .expect(200)
    .expect({
      result: false,
      message: "Les clés [email] et [password] sont obligatoires",
    });
});

test("Sign up - Body correct", async () => {
  await request(app)
    .post("/signup")
    .send({
      status: "particulier",
      nom: "maxime violi",
      email: "maxime@lacapsule.io",
      password: "mnopqr",
    })
    .expect(200)
    .expect({
      result: true,
      token: 345678,
    });
});

test("Sign up - Body incorrect", async () => {
  await request(app)
    .post("/signup")
    .send({
      statu: "particulier",
      name: "axel piras",
      mail: "axel@lacapsule.io",
      pass: "stuvwx",
    })
    .expect(200)
    .expect({
      result: false,
      message:
        "Les clés [status], [nom], [email], [password] sont obligatoires",
    });
});
