const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

let heroes = [
    { id: 1, name: "Alucard", role: "Fighter", difficulty: "Easy" },
    { id: 2, name: "Gusion", role: "Assassin", difficulty: "Hard" },
    { id: 3, name: "Miya", role: "Marksman", difficulty: "Easy" },
]

app.get('/api/heroes', (req, res) =>{
    res.json(heroes)
})

app.get('/api/heroes/:id', (req, res) =>{
    const hero = heroes.find(h => h.id == req.params.id)
    if (!hero) return res.status(404).json({ message: "Hero not found" })
    res.json(hero)
})

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

app.delete('/api/heroes/:id', (req, res) =>{
    const index = heroes.findIndex(h => h.id == req.params.id)
    if (index === -1) return res.status(404).json({ message: "Hero not found" })

    heroes.splice(index, 1)

    res.json({ message: "Hero deleted" })
})

app.get('/api/search', (req, res) =>{
    const name = req.query.name || ""
    const result = heroes.filter(h =>
        h.name.toLowerCase().includes(name.toLowerCase())
    )
    res.json(result)
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
