const API = "http://localhost:3000/api"

// cargar materias en el selector
async function cargarMateriasSelect() {
    const res = await fetch(`${API}/materias`)
    const materias = await res.json()
    const select = document.getElementById('select-materia')
    materias.forEach(m => {
        select.innerHTML += `<option value="${m.id}">${m.nombre} (${m.codigo})</option>`
    })
}

// filtrar tareas por materia
async function filtrarPorMateria(materia_id) {
    const res = await fetch(`${API}/organizacion/tareas/materia?materia_id=${materia_id}`)
    const data = await res.json()
    return data
}

// filtrar tareas por materia y grupo
async function filtrarPorMateriaYGrupo(materia_id, grupo) {
    const res = await fetch(`${API}/organizacion/tareas/filtro?materia_id=${materia_id}&grupo=${grupo}`)
    const data = await res.json()
    return data
}

// obtener conteo
async function obtenerConteo(materia_id) {
    const res = await fetch(`${API}/organizacion/conteo?materia_id=${materia_id}`)
    const data = await res.json()
    return data
}

// aplicar filtro
async function aplicarFiltro() {
    const materia_id = document.getElementById('select-materia').value
    const grupo = document.getElementById('input-grupo').value
    const div = document.getElementById('tareas-filtradas')
    const conteoDiv = document.getElementById('conteo-materia')

    if (!materia_id) {
        alert('Selecciona una materia')
        return
    }

    const conteo = await obtenerConteo(materia_id)
    conteoDiv.innerHTML = `
        <p>Estudiantes inscritos: <b>${conteo.estudiantes_inscritos}</b></p>
        <p>Tareas en esta materia: <b>${conteo.tareas_en_materia}</b></p>
    `

    let tareas
    if (grupo) {
        tareas = await filtrarPorMateriaYGrupo(materia_id, grupo)
    } else {
        tareas = await filtrarPorMateria(materia_id)
    }

    div.innerHTML = ''
    if (tareas.mensaje) {
        div.innerHTML = `<p>${tareas.mensaje}</p>`
        return
    }

    tareas.forEach(t => {
        div.innerHTML += `
            <div>
                <h3>${t.titulo}</h3>
                <p>${t.descripcion}</p>
                <p>Estado: ${t.estado}</p>
                <p>Fecha: ${t.fecha_entrega || 'Sin fecha'}</p>
            </div>
        `
    })
}

// limpiar filtro
function limpiarFiltro() {
    document.getElementById('select-materia').value = ''
    document.getElementById('input-grupo').value = ''
    document.getElementById('tareas-filtradas').innerHTML = ''
    document.getElementById('conteo-materia').innerHTML = ''
}

cargarMateriasSelect()