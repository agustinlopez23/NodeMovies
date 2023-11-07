const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const validateMovie = require('./schemas/movies')
const app = express()
app.use(express.json())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.json('Hola mundo!')
})
// Movies Resources
app.get('/movies', (req, res) => {
  res.json(movies)
})
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})
app.get('/movies/:genre', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLocaleLowerCase() === genre.toLocaleLowerCase()))
    return res.json(filteredMovies)
  }
  res.status(404).json({ message: 'Movie not found' })
})
app.post('/movies/', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  movies.push(newMovie)
  return res.status(201).json(newMovie)
})
const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`)
})
