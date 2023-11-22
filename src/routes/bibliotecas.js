const { Router } = require("express");
const router = Router();

router.get('/', (req, res) => { 
    req.getConnection((err, conn) => {
        if (err){
            return res.status(500).send("Error en el servidor")
        } 
        conn.query("SELECT * FROM BIBLIOTECAS", (err, rows) =>{
            if(err) {
                return res.status(500).send("Error al obtener datos")
            }
            res.json(rows)
        })
    })
})

router.get('/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) {
            return res.status(500).send("Error en el servidor")
        }
        conn.query("SELECT * FROM BIBLIOTECAS WHERE ID = ?", 
            [req.params.id],
            (err, result) => {
                if (err) {
                    return res.status(500).send("Error al obtener datos")
                }
                res.json(result[0])
            }
        )
    })
})

router.get('/cp/:cp', (req, res) => {
    //obtiene las bibliotecas mas cercanas basadas en el codigo postal
    const cp_str = req.params.cp.toString()
    const primerosDosDigitos = cp_str.slice(0, 2)

    req.getConnection((err, conn) => {
        if(err) {
            return res.status(500).send("Error en el servidor ")
        }
        conn.query("SELECT * FROM BIBLIOTECAS WHERE LEFT(CAST(CP AS CHAR), 2) = ? ORDER BY ABS(CP - ?);",
            [primerosDosDigitos, req.params.cp],
            (err, result) => {
                if(err) {
                    return res.status(500).send("Error al obtener datos")
                }
                res.json(result)
            }
        )
    })
})

router.post("/", (req, res) => {

    req.getConnection((err, conn) => {
        if(err) {
            return res.status(500).send("Error en el servidor")
        }
        const {NOMBRE, CP} = req.body
        if(NOMBRE && CP) {
            conn.query("INSERT INTO BIBLIOTECAS SET ?",
                [{NOMBRE, CP}],
                (err) => {
                    if(err){
                        return res.status(500).send("Error al insertar")
                    }
                }
            )
            res.json({NOMBRE, CP})
        }
        else {
            return res.status(500).send("Datos faltantes")
        }
    })
})

router.post("/inventario/", (req, res) => {
    req.getConnection((err, conn) => {
        if(err) {
            return res.status("Error en el servidor", err)
        }
        const {ID_LIBRO , ID_BIBLIOTECA, EXISTENCIAS} = req.body
        if(ID_LIBRO && ID_BIBLIOTECA) {
            conn.query("INSERT INTO INVENTARIO SET ?",
                [{ID_LIBRO, ID_BIBLIOTECA, EXISTENCIAS}],
                (err) =>{
                    if(err){
                        return res.status(500).send("Error al insertar datos")
                    }
                }
            )
            res.json({ID_LIBRO, ID_BIBLIOTECA, EXISTENCIAS})
        }
    })
})

module.exports = router