const { supabase } = require('../db')

// obtener todas las materias
const getMaterias = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('materias')
            .select('*')

        if (error) throw error
        res.json(data)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// crear una materia nueva
const createMateria = async (req, res) => {
    const { nombre, codigo } = req.body

    if (!nombre || !codigo) {
        return res.status(400).json({ error: 'Nombre y codigo son requeridos.' })
    }

    try {
        const { data, error } = await supabase
            .from('materias')
            .insert([{ nombre, codigo }])
            .select()

        if (error) throw error
        res.status(201).json(data[0])

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { getMaterias, createMateria }