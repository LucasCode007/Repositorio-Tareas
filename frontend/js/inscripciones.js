const API = "http://localhost:3000/api"

// obtener materias disponibles
async function cargarMaterias() {
    const res = await fetch(`${API}/materias`)
    const data = await res.json()
    return data
}

// inscribir estudiante a una materia
async function inscribir(usuario_id, materia_id) {
    const res = await fetch(`${API}/inscripciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id, materia_id })
    })
    const data = await res.json()
    return data
}

// obtener materias de un estudiante
async function getMisInscripciones(usuario_id) {
    const res = await fetch(`${API}/inscripciones/${usuario_id}`)
    const data = await res.json()
    return data
}

// eliminar inscripcion
async function eliminarInscripcion(id) {
    const res = await fetch(`${API}/inscripciones/${id}`, {
        method: "DELETE"
    })
    const data = await res.json()
    return data
}

// validar correo
async function validarCorreo(email) {
    const res = await fetch(`${API}/inscripciones/validar-correo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
    const data = await res.json()
    return data
}