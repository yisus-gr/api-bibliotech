const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {

    req.getConnection((err, conn) => {

      if (err) {
        return res.status(500).send("error en el servidor");
      }

      conn.query("SELECT * FROM catalogo", (err, rows) => {

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
            "SELECT * FROM catalogo WHERE ISBN = ?",
            [req.params.id],
            (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.json(result);
            }
        );

    });

});


router.post("/", (req, res) => {
    const { ISBN, titulo, autor, year, sinopsis, ID_biblioteca, portada_url, existencias } = req.body;

    console.log(req.body);
    
    if (ISBN && titulo && autor && year && ID_biblioteca && portada_url && existencias) {
      
      req.getConnection((err, conn) => {
        if (err) {
          return res.status(500).send("Error en el servidor");
        }
        conn.query(
          "INSERT INTO catalogo SET ?",
          [{ ISBN, titulo, autor, year, sinopsis, ID_biblioteca, portada_url, existencias}],
          (err) => {
            if (err) {
              console.log(err)
              return res.status(500).send("error en el servidor");
            }
          }
        );
      });
      res.json({ ISBN, titulo, autor, year, sinopsis, ID_biblioteca, portada_url, existencias});
    } else {
      res.json({ error: "there was an error" });
      //console.log(err)
    }
});

router.delete("/:isbn", (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("error en el servidor");
      }
      conn.query("DELETE FROM catalogo WHERE isbn = ?", [req.params.isbn], (err) => {
        if (err) {
          return res.send(500).send("error en el servidor");
        }
        res.send("deleted");
      });
    });
});

router.put("/:isbn",  (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send("error en el servidor");
      }
      
      const { titulo, autor, year, sinopsis, ID_biblioteca, portada_url, existencias  } = req.body;
      
      const updatedProducto = {
        titulo, 
        autor, 
        year, 
        sinopsis, 
        ID_biblioteca, 
        portada_url, 
        existencias 
      };
      const isbn = req.params.isbn
      conn.query("UPDATE catalogo SET ? WHERE isbn = ?", 
      [updatedProducto, isbn], (err) =>{
          if(err) {
              return res.status(500).send('error en el servidor');
          } 
          res.send('updated')
      });
    });
});

module.exports = router;
