import { expect } from "chai";
import { initializeTestDb, insertTestUser, getToken } from "./helper/test.js";

const baseUrl = "http://localhost:3001";

describe("GET Tasks", () => {
  before(() => {
    initializeTestDb();
  });

  it("should get all tasks", async () => {
    const res = await fetch(baseUrl);
    const data = await res.json();

    expect(res.status).to.equal(200);
    expect(data).to.be.an("array").that.is.not.empty;
    expect(data[0]).to.include.all.keys("id", "description");
  });
});

describe("POST task", () => {
  const email = "post@foo.com";
  const password = "post123";
  insertTestUser(email, password);
  const token = getToken(email);
  it("should post a task", async () => {
    const res = await fetch(`${baseUrl}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: "Task from unit test" }),
    });
    const data = await res.json();

    expect(res.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id");
  });

  it("should not post a task without description", async () => {
    const res = await fetch(`${baseUrl}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: null }),
    });
    const data = await res.json();

    expect(res.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });

  it("should not post a task with zero length description", async () => {
    const res = await fetch(`${baseUrl}/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: "" }),
    });
    const data = await res.json();

    expect(res.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("DELETE task", () => {
  const email = "post@foo.com";
  const password = "post123";
  insertTestUser(email, password);
  const token = getToken(email);
  it("should delete a task", async () => {
    const res = await fetch(`${baseUrl}/delete/1`, {
      method: "delete",
      headers: {
        Authorization: token,
      },
    });
    const data = await res.json();

    expect(res.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id");
  });

  it("should not delete a task with SQL injection", async () => {
    const res = await fetch(`${baseUrl}/delete/id=0 or id > 0`, {
      method: "delete",
      headers: {
        Authorization: token,
      },
    });
    const data = await res.json();

    expect(res.status).to.equal(500);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("POST register", () => {
  const email = "register@foo.com";
  const password = "register123";
  it("should register with valid email and password", async () => {
    const res = await fetch(baseUrl + "/user/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await res.json();
    expect(res.status).to.equal(201, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email");
  });

  it("should not post a user with less than 8 character password", async () => {
    const email = "register@foo.com";
    const password = "short1";
    const res = await fetch(baseUrl + "/user/register", {
      method: "POST",
      headers: {
        "Application-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await res.json();
    expect(res.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("error");
  });
});

describe("POST login", () => {
  const email = "register@foo.com";
  const password = "register123";
  insertTestUser(email, password);
  it("should login with valid email and password", async () => {
    const res = await fetch(baseUrl + "/user/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await res.json();
    expect(res.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.all.keys("id", "email", "token");
  });
});
