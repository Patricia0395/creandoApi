const db = require('../../database/models');

const moment = require('moment')

const throwError = (res, error) =>{
    console.log(error)
    return res.status(error.status).json({
        meta : {
            status : error.status || 500
        },
        data : error.message
    })
}

const NaNError = id => {
    if(isNaN(id)){
        let error = new Error('ID incorrecto');
        error.status= 422;
        throw error
    }
} 

module.exports = {
      list : async (req, res) =>{
     try {
         let movies = await db.Movie.findAll();
// le mandamos una respuesta en fotmato json
         let response = {
             meta : {
                 status : 200,
                 total : movies.length, //cuantos generos te esta devolviendo
                 link: 'api/movies' //como se accede a este recurso

             },
             data : movies // contiene los generos que acabamos de consultar de la base de datos la variable de arriba
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
            NaNError(req.params.id);
            
            let movie = await db.Movie.findByPk(req.params.id)

            if(!movie){
                let error = new Error('ID inexistente');
                error.status= 404;
                throw error
            }

            let response ={
                meta : {
                    status : 200,
                    link: 'api/movies/' + req.params.id
   
                },
                data : movie
            }

            return res.status(200).json(response)

        } catch (error) {
            throwError(res.error)
        }
    },



    create : async(req, res) =>{
        try{
            req.body.release_date ? req.body.release_date = moment(req.body.release_date).format('DD-MM-YYYY') : null

            let movie = await db.Movie.create({
                //trae todos los objetos que vienen del req.body
                ...req.body
            }) 

           let  response ={
                meta : {
                    status : 201,
                    link: 'api/movies/' + movie.id,
                    msg: "Pelicula creada con éxito"
   
                },
                data : movie
            }
            return res.status(201).json(response)

        }catch (error) {
            console.log(error);
          return res.status(400).json({
            meta : {
                status : 400
            },
            data : error.errors.map(error => error.message)
          })
        }
    },
    
    update : async(req, res) =>{
        try {

            NaNError(req.params.id);

            let result = await db.Movie.update(
                {
                    ...req.body
                },
                {
                    where : {
                        id: req.params.id
                    }
                    
                }
            )
            let response;
            if (result[0] === 1) {
                 response ={
                    meta : {
                        status : 201,
                        msg: "Película actualizada con éxito"
                    },
                    
                }
                return res.status(201).json(response)

            }else{
                response ={
                    meta : {
                        status : 204,
                        msg: "No hubo modificaciones en la película"
       
                    },
            }
            return res.status(204).json(response)

        }
    
            
        } catch (error) {
            console.log(error);
            return res.status(400).json({
              meta : {
                  status : 400
              },
              data : error.errors.map(error => error.message)
            })
        }
    },

    destroy: async (req, res) => {
        try {
            NaNError(req.params.id);

            let result = await db.Movie.destroy({
                where : {
                    id: req.params.id
                }
                })
                if (result === 1) {
                    response ={
                       meta : {
                           status : 201,
                           msg: "Película eliminada con éxito"
                       },
                       
                   }
                   return res.status(201).json(response)

               }else{
                   response ={
                       meta : {
                           status : 204,
                           msg: "No se borro ninguna película"
          
                       },
               }
               console.log(response);
               return res.status(204).json(response)
           }
              
        } catch (error) {
            console.log(error);
            return res.status(400).json({
              meta : {
                  status : 400
              },
              data : error.errors.map(error => error.message)
            })
        }
    }
}