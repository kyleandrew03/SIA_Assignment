const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const port = 3000 // ✅ local only

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

const heroes = [
    { id: 1, name: "Alucard", role: "Fighter", difficulty: "Easy" },
    { id: 2, name: "Gusion", role: "Assassin", difficulty: "Hard" },
    { id: 3, name: "Miya", role: "Marksman", difficulty: "Easy" },
]

// ✅ GET all
app.get('/api/heroes', (req, res) =>{
    res.json(heroes)
})

// ✅ GET by ID
app.get('/api/heroes/:id', (req, res) =>{
    const hero = heroes.find(h => h.id == req.params.id)
    if (!hero) return res.status(404).json({ message: "Hero not found" })
    res.json(hero)
})

// ✅ POST
app.post('/api/heroes', (req, res) =>{
    const {name, role, difficulty} = req.body

    if (!name || !role || !difficulty) {
        return res.status(400).json({ message: "Missing fields" })
    }

    const newHero = {
        id: heroes.length + 1,
        name,
        role,
        difficulty
    }

    heroes.push(newHero)

    res.status(201).json({
        message: "Hero added successfully",
        hero: newHero
    })
})

// ✅ PUT
app.put('/api/heroes/:id', (req, res) =>{
    const hero = heroes.find(h => h.id == req.params.id)
    if (!hero) return res.status(404).json({ message: "Hero not found" })

    const {name, role, difficulty} = req.body

    if (name) hero.name = name
    if (role) hero.role = role
    if (difficulty) hero.difficulty = difficulty

    res.json({
        message: "Hero updated",
        hero
    })
})

// ✅ DELETE
app.delete('/api/heroes/:id', (req, res) =>{
    const index = heroes.findIndex(h => h.id == req.params.id)
    if (index === -1) return res.status(404).json({ message: "Hero not found" })

    heroes.splice(index, 1)

    res.json({ message: "Hero deleted" })
})

// ✅ FILTER by role
app.get('/api/heroes/role/:role', (req, res) =>{
    const result = heroes.filter(h => 
        h.role.toLowerCase() === req.params.role.toLowerCase()
    )
    res.json(result)
})

// ✅ SEARCH
app.get('/api/search', (req, res) =>{
    const name = req.query.name || ""
    const result = heroes.filter(h =>
        h.name.toLowerCase().includes(name.toLowerCase())
    )
    res.json(result)
})

// ✅ RANDOM
app.get('/api/random', (req, res) =>{
    const random = heroes[Math.floor(Math.random() * heroes.length)]
    res.json(random)
})

// ✅ STATS
app.get('/api/stats', (req, res) =>{
    res.json({ totalHeroes: heroes.length })
})

// ✅ TOP
app.get('/api/top-heroes', (req, res) =>{
    res.json(heroes.slice(0, 2))
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})