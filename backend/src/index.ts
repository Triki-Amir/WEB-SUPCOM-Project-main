import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.get('/api/vehicles', (req, res) => {
  // mock data - replace with DB queries
  res.json([
    { id: 1, model: 'Renault Clio', status: 'available', price: 45 },
    { id: 2, model: 'Tesla Model 3', status: 'in_use', price: 120 }
  ])
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`))
