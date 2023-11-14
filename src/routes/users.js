const { Router } = require("express");
const router = Router();

router.post("/", (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).send('error en el servidor: ', err)
        } else{
            const { ID, NAME, CP, CORREO, FECHA_NACIMIENTO, PASS } = req.body;
            if (ID && NAME && CP && CORREO && PASS) {
            conn.query(
                "INSERT INTO USERS SET ?",
                [{ ID, NAME, CP, CORREO, FECHA_NACIMIENTO, PASS }],
                (err) => {
                if (err) {
                    console.error("Error al insertar usuario: " + err);
                    return res.status(500).send("Error en el servidor");
                }
                res.json({
                    ID,
                    NAME,
                    CP,
                    CORREO,
                    FECHA_NACIMIENTO,
                    PASS
                });
                }
            );
            } else {
                res.status(400).json({ error: "Faltan campos obligatorios" });
            }
        }
    })
});

router.get("/:id", (req, res) => {
    req.getConnection((err, conn) => {
        if (err){
            return res.status(500).send('Error en el servidor')
        } 
        conn.query(
            "SELECT NAME, CP, CORREO, FECHA_NACIMIENTO FROM USERS WHERE ID = ?", 
            [req.params.id],
            (err, result) =>{
                if (err) {
                    return res.status(500).send('Error al obtener datos')
                }
                if(result[0]){
                    res.json(result)
                }
                else{res.send('Usuario no existente')}
            }
        )
    })
})

router.put("/:id", (req, res) => {
    req.getConnection((err, conn) => {
        if(err){
            return res.status(500).send('Error en el servidor')
        }

        const {NAME, CP, CORREO} = req.body
        if (NAME && CP && CORREO){
            const userUpdated = {NAME, CP, CORREO}
            conn.query(
                "UPDATE USERS SET ? WHERE ID = ?",
                [userUpdated, req.params.id], (err) =>{
                    if(err){
                        res.status(500).send(err)
                    } else {
                        res.send('updated')
                    }
                }
            )
           
        } else {
            res.status(500).send('Erro, faltan datos')
        }
        
    })
})

router.delete("/:id", (req, res) => {
    req.getConnection((err, conn) => {
        if(err){
            return res.status(500).send('Error en el servidor')
        }
        const {id} = req.params
        conn.query('DELETE FROM USERS WHERE ID = ?', 
        [id], (err) =>{
            if(err) {
                return res.status(500).send('Error al borrar')
            } 
            res.send('deleted')
        })
    })
})

module.exports = router;