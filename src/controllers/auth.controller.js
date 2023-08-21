import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { db } from "../database/database.conection.js";

export async function signup(req, res) {
  const { username, email, password, picture_url } = req.body;

  try {
    if (!password) {
      return res.status(400).send("Senha não informada!");
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await db.query(
      `INSERT INTO users (username, email, password, profile_image) VALUES ($1, $2, $3, $4)`,
      [username, email, passwordHash, picture_url]
    );

    res.status(201).send("Usuário criado com sucesso!");
  } catch (err) {
    if (err.code === "23505") {
      if (err.detail.includes("email")) {
        return res.status(400).send("E-mail já cadastrado");
      }

      if (err.detail.includes("username")) {
        return res.status(400).send(`Username ${username} não está disponível`);
      }
    }
    res.status(500).send(err.message);
  }
}

export async function signin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await db.query(
      `SELECT id, username, password FROM users WHERE email = $1`,
      [email]
    );

    if (user.rowCount === 0) {
      return res.status(401).send("E-mail não encontrado");
    }

    const comparePassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!comparePassword) {
      return res.status(401).send("Senha incorreta!");
    }

    const token = uuid();

    await db.query('INSERT INTO sessions (user_id, "token") VALUES ($1, $2)', [
      user.rows[0].id,
      token,
    ]);

    res.status(200).send({ user: user.rows[0].username, token: token });
  } catch (err) {
    res.status(500).send(err.message);
    console.error(err.message);
  }
}
