const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const fetch = require('node-fetch');

const FAKEAPI_BASE_URL = "https://fakerestapi.azurewebsites.net/api/v1";

const app = express();
app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));
app.use(bodyParser.json());

const SECRET_KEY = "miclaveultrasecreta";
let productos = [
  { id: 1, name: "Zapatillas", price: 79.9, stock: 10, color: "blue", brand: "Essence" },
  { id: 2, name: "Camiseta", price: 25.5, stock: 20, color: "red", brand: "Nike" }
];

// ================== AUTENTICACIÓN ==================
/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Crear token de autenticación
 *     description: Retorna un token JWT si el usuario y contraseña son correctos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: emilys
 *               password:
 *                 type: string
 *                 example: emilyspass
 *     responses:
 *       200:
 *         description: Token generado
 */
app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  if (username === "emilys" && password === "contrasena123") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "10m" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Credenciales inválidas" });
});

// Middleware para verificar token
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(403);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ================== CRUD ACTIVITIES ==================
/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Listar todas las actividades
 *     responses:
 *       200:
 *         description: Lista de actividades
 *   post:
 *     summary: Crear una nueva actividad
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Nueva Actividad"
 *               dueDate:
 *                 type: string
 *                 example: "2025-10-21T04:40:32.4045896+00:00"
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Actividad creada
 */
app.get("/activities", async (req, res) => {
  try {
    const response = await fetch(`${FAKEAPI_BASE_URL}/Activities`);
    const activities = await response.json();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener actividades", error: error.message });
  }
});

app.post("/activities", verificarToken, async (req, res) => {
  try {
    const response = await fetch(`${FAKEAPI_BASE_URL}/Activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });
    const newActivity = await response.json();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la actividad", error: error.message });
  }
});

/**
 * @swagger
*"/productos/{id}": {
*  "get": {
*    "summary": "Obtener un producto por ID",
*    "tags": ["Productos"],
*    "security": [{ "bearerAuth": [] }],
*    "parameters": [
*      {
*        "name": "id",
*        "in": "path",
*        "required": true,
*        "schema": {
*          "type": "integer"
*        },
*        "description": "ID del producto a consultar"
*      }
*    ],
*    "responses": {
*      "200": {
*        "description": "Producto encontrado",
*        "content": {
*          "application/json": {
*            "example": {
*              "id": 1,
*              "name": "Zapatillas",
*              "price": 79.9,
*              "stock": 10,
*              "color": "blue",
*              "brand": "Essence"
*            }
*          }
*        }
*      },
*      "404": {
*        "description": "Producto no encontrado"
*      }
*   }
* }
*}
*/
/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     summary: Obtener una actividad por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Actividad encontrada
 *       404:
 *         description: Actividad no encontrada
 */
app.get('/activities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${FAKEAPI_BASE_URL}/Activities/${id}`);
    if (!response.ok) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }
    const activity = await response.json();
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la actividad", error: error.message });
  }
});

/**
 * @swagger
 * /activities/{id}:
 *   put:
 *     summary: Actualizar una actividad por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Actividad Actualizada"
 *               dueDate:
 *                 type: string
 *                 example: "2025-10-21T04:40:32.4045896+00:00"
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Actividad actualizada
 *       404:
 *         description: Actividad no encontrada
 *
 *   delete:
 *     summary: Eliminar una actividad por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Actividad eliminada
 */
app.put("/activities/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${FAKEAPI_BASE_URL}/Activities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }
    const updatedActivity = await response.json();
    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la actividad", error: error.message });
  }
});

app.delete("/activities/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${FAKEAPI_BASE_URL}/Activities/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }
    res.json({ message: "Actividad eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la actividad", error: error.message });
  }
});

// ================== SWAGGER CONFIG ==================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Actividades con JWT",
      version: "1.0.0",
      description: "API proxy para FakeRESTApi Activities con autenticación JWT",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/api_producto.js"],
};  

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ================== INICIO SERVIDOR ==================
const PORT = process.env.PORT || 3000;
// Página de inicio con criterios del parcial
app.get("/", (req, res) => {
  res.send(`
    <h1>API de Actividades con Auth (JWT)</h1>
    <p>Documentación interactiva (Swagger UI): <a href="/api-docs">/api-docs</a></p>
    <hr>
    <p>👉 Endpoints disponibles:</p>
    <ul>
      <li><code>POST /auth</code> → obtener token</li>
      <li><code>GET /activities</code> → listar actividades</li>
      <li><code>GET /activities/:id</code> → detalle de actividad</li>
      <li><code>POST /activities</code> → crear actividad (requiere token)</li>
      <li><code>PUT /activities/:id</code> → actualizar actividad (requiere token)</li>
      <li><code>DELETE /activities/:id</code> → eliminar actividad (requiere token)</li>
    </ul>
    <hr>
    <p>ℹ️ Usa Postman para interactuar con la API. </p>
  `);
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

 
