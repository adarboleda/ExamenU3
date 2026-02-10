import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

//endpoint de respuesta
app.get('/', (_req, res) => {
  res.send('Examen con CI/CD');
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el ${PORT}`);
});
