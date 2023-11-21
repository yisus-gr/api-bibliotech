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
    req.getConnection((err, conn) => {
        if(err) {
            return res.status(500).send("Error en el servidor ")
        }
        conn.query("SELECT * FROM BIBLIOTECAS WEHERE CP = ?",
            [req.params.cp],
            (err, result) => {
                if(err) {
                    return res.status(500).send("Error al obtener datos")
                }
                res.json(result[0])
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

module.exports = router