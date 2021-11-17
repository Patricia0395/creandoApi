const db = require('../../database/models');

const throwError = (res, error) =>{
    console.log(error)
    return res.status(error.status).json({
        meta : {
            status : error.status || 500
        },
        data : error.message
    })
}

module.exports = {
    list : async (req, res) =>{
     try {
         let genres = await db.Genre.findAll();
// le mandamos una respuesta en fotmato json
         let response = {
             meta : {
                 status : 200,
                 total : genres.length, //cuantos generos te esta devolviendo
                 link: 'api/genres' //como se accede a este recurso

             },
             data : genres // contiene los generos que acabamos de consultar de la base de datos la variable de arriba
         }
         return res.status(200).json(response) //no mandamos una vista sino informacion el json de arriba

/* tambien puede ser asi es lo mismo que arriba
return res.status(200).json({
             meta : {
                 status : 200,
                 total : genres.length, //cuantos generos te esta devolviendo
                 link: 'api/genres' //como se accede a este recurso

             }) */
     } catch (error) {
         throwError(res.error)
     }
    },
    detail : async(req,res) =>{
        try {
            if(isNaN(req.params.id)){
                let error = new Error('ID incorrecto');
                error.status= 422;
                throw error
            }
            
            let genre = await db.Genre.findByPk(req.params.id)

            if(!genre){
                let error = new Error('ID inexistente');
                error.status= 404;
                throw error
            }

            let response ={
                meta : {
                    status : 200,
                    link: 'api/genres/' + req.params.id
   
                },
                data : genre
            }

            return res.status(200).json(response)

        } catch (error) {
            throwError(res.error)
        }
    }
}