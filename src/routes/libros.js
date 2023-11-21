const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {

    req.getConnection((err, conn) => {

      if (err) {
        return res.status(500).send("error en el servidor");
      }

      conn.query("SELECT * FROM libros", (err, rows) => {

        if (err) {
          return res.status(500).send("error en el servidor");
        }

        res.json(rows);
      });

    });
    
});

router.get("/:id", (req, res) => {

    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("Error en el servidor ");
      }

        conn.query(
            "SELECT * FROM libros WHERE id = ?",
            [req.params.id],
            (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.json(result[0]);
            }
        );

    });

});


router.post("/", (req, res) => {
    const { ISBN, titulo, autor, year, sinopsis, portada_url, categoria_id, editorial } = req.body;
    
    if (ISBN && titulo && autor && year && portada_url && categoria_id && editorial ) {
      
      req.getConnection((err, conn) => {
        if (err) {
          return res.status(500).send("Error en el servidor");
        }
        conn.query(
          "INSERT INTO libros SET ?",
          [{ ISBN, titulo, autor, year, sinopsis, portada_url, categoria_id, editorial}],
          (err) => {
            if (err) {
              console.log(err)
              return res.status(500).send("error AL INSERTAR");
            }
          }
        );
      });
      res.json({ ISBN, titulo, autor, year, sinopsis, portada_url, categoria_id, editorial});
    } else {
      res.json({ error: "DATOS FALTANTES" });
      //console.log(err)
    }
});

router.delete("/:id", (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("error en el servidor");
      }
      conn.query("DELETE FROM libros WHERE id = ?", [req.params.id], (err) => {
        if (err) {
          return res.send(500).send("error en el servidor");
        }
        res.send("deleted");
      });
    });
});

router.put("/:id",  (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("error en el servidor");
      }
      
      const { ISBN, titulo, autor, year, sinopsis, portada_url, categoria_id, editorial } = req.body;
      
      const updatedProducto = {
        ISBN, 
        titulo, 
        autor, 
        year, 
        sinopsis, 
        portada_url,
         categoria_id,
         editorial     
      };
      const id = req.params.id
      conn.query("UPDATE libros SET ? WHERE id = ?", 
      [updatedProducto, id], (err) =>{
          if(err) {
              return res.status(500).send('error en el servidor');
          } 
          res.send('updated')
      });
    }); 
});

router.get("/:id/reviews", (req, res) => {
  req.getConnection((err, conn) => {
    if(err){
      return res.status(500).send("Error en el servidor")
    }
    conn.query("SELECT * FROM REVIEWS WHERE ID_PUBLICACION = ?", 
    [req.params.id], (err) =>{
      if(err) {
        return res.status(500).send("error al obtener datos")
      }
    })

  })
})

router.post("/:id/reviews", (req, res) => {
  req.getConnection((err, conn) => {
    if(err){
      return res.status(500).send("Error en el servidor")
    }
    const {ID_PUBLICACION, ID_USER, CONTENIDO, CALIFICACION} = req.params
    if(ID_PUBLICACION && ID_USER && CONTENIDO && CALIFICACION){
      const newReview = {
        ID_PUBLICACION,
        ID_USER,
        CONTENIDO,
        CALIFICACION
      }
      conn.query("INSTER INTO REVIEWS SET ?", [newReview])
    } else {
      return res.status(500).send("Error, datos faltantes")
    }
    
  })
})

module.exports = router;
