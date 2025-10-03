import { Router } from "express";

const router = Router();

//Declaramos cual va ser la renderizacion de la pagina 
router.get('/', (req, res)=>{
    res.render('chat')
})

export default router;