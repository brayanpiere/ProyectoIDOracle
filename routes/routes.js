const {Router} = require('express');
const router = Router();
const BD = require('../config/config');

router.get('/',(req,res)=>{
    res.render("login");
});

router.post("/main",(req,res)=>{
    
    const usuario = {
        nombre : req.body.nombre,
        pass: req.body.password
    }
    req.session.usuario=usuario
    
    //TODO: logeo usuario y pass con la bd
    res.render("main",usuario)
})


router.get('/main',(req,res)=>{
    res.render("main",req.session.usuario);
})

//---------ROUTER EMMPLEADO-----------------//
//==========================================//

router.get('/empleados', async (req,res)=>{
    const listaEmpleados =[];
    sql='select e.idempleado, e.dni, e.nombres, e.telefono, e.direccion, e.salario, e.email, r.rol from empleado e, rol r where e.idrol=r.idrol';

    let result = await BD.open(sql,[],false);
    result.rows.map(emp=>{
        let empSchema = {
            'id': emp[0],
            'dni':emp[1],
            'nombres':emp[2],
            'telefono':emp[3],
            'direccion':emp[4],
            'salario':emp[5],
            'email':emp[6],
            'rol':emp[7]
        }
        listaEmpleados.push(empSchema)
    });

    res.render('empleados',{
        
        empleados : listaEmpleados,
        usuario : req.session.usuario
    })
})

router.get('/add_empleado', async (req,res)=>{

    const listaRoles =[];
    sql='select * from rol';
    let result = await BD.open(sql,[],false);
    result.rows.map(r=>{
        let rolSchema = {
            'id': r[0],
            'rol':r[1]
        }
        listaRoles.push(rolSchema)
    });
    res.render('add_empleado',{
        roles : listaRoles
    })
})

router.post('/add_empleado', async (req,res)=>{
    let dni=req.body.dni;
    let nombres=req.body.nombres;
    let telef=req.body.telefono;
    let direc=req.body.direccion;
    let sal=parseFloat(req.body.salario);
    let email=req.body.email;
    let idrol=parseInt(req.body.idrol);
    sql=`BEGIN insertar_empleado('${dni}','${nombres}','${telef}','${direc}',${sal},'${email}',${idrol}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/empleados');
})

router.get("/edit_empleado/:id", async (req,res)=>{
    let id = req.params.id;

    const listaRoles =[];
    sql1='select * from rol';
    let result2 = await BD.open(sql1,[],false);
    result2.rows.map(r=>{
        let rolSchema = {
            'id': r[0],
            'rol':r[1]
        }
        listaRoles.push(rolSchema)
    });

    let listaEmpleados;
    sql=`select * from empleado e where e.idempleado=${id}`;
    let result = await BD.open(sql,[],false);
    console.log(result);
    result.rows.map(emp=>{
        let empSchema = {
            'id': emp[0],
            'dni':emp[1],
            'nombres':emp[2],
            'telefono':emp[3],
            'direccion':emp[4],
            'salario':emp[5],
            'email':emp[6],
            'idrol':emp[7]
        }
        listaEmpleados =empSchema
        console.log(listaEmpleados);
    });
    res.render("edit_empleado",{
        empleado : listaEmpleados,
        roles : listaRoles

    })
})

router.post('/edit_empleado', async (req,res)=>{
    let id=req.body.id;
    let dni=req.body.dni;
    let nombres=req.body.nombres;
    let telef=req.body.telef;
    let direc=req.body.direc;
    let sal=parseFloat(req.body.sal);
    let email=req.body.email;
    let idrol=parseInt(req.body.idrol);
    sql=`BEGIN modifica_empleado(${id},'${dni}','${nombres}','${telef}','${direc}',${sal},'${email}',${idrol}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/empleados');
})

router.get('/delete_empleado/:id', async (req,res)=>{
    const id = req.params.id;
    sql=`BEGIN elimina_empleado(${id}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/empleados');
})

router.post('/search_empleado', async (req,res)=>{
    let nombre=req.body.nombre;
    console.log(nombre);
    const listaEmpleados =[];
    sql=`select * from empleado e where e.nombres like '%${nombre}%'`;

    let result = await BD.open(sql,[],false);
    result.rows.map(emp=>{
        let empSchema = {
            'id': emp[0],
            'dni':emp[1],
            'nombres':emp[2],
            'telefono':emp[3],
            'direccion':emp[4],
            'salario':emp[5],
            'email':emp[6],
            'rol':emp[7]
        }
        listaEmpleados.push(empSchema)
    });

    res.render('empleados',{
        
        empleados : listaEmpleados,
        usuario : req.session.usuario
    })
})

router.post('/order_empleado', async (req,res)=>{
    let tipo_orden=req.body.tipo_orden;
    const listaEmpleados =[];
    if (tipo_orden=='o_nombre') {
        sql=`select * from empleado e order by e.nombres`;
    }
    else if (tipo_orden=='o_idempleado'){
        sql=`select * from empleado e order by e.idempleado desc`;
    }
    else if (tipo_orden=='o_rol'){
        sql=`select * from empleado e order by e.idrol`;
    }
    let result = await BD.open(sql,[],false);
    result.rows.map(emp=>{
        let empSchema = {
            'id': emp[0],
            'dni':emp[1],
            'nombres':emp[2],
            'telefono':emp[3],
            'direccion':emp[4],
            'salario':emp[5],
            'email':emp[6],
            'rol':emp[7]
        }
        listaEmpleados.push(empSchema)
    });

    res.render('empleados',{
        empleados : listaEmpleados,
        usuario : req.session.usuario
    })
})

//---------ROUTER ROL-----------------//
//==========================================//

router.get('/roles', async (req,res)=>{
    const listaRoles =[];
    sql='select * from rol';

    let result = await BD.open(sql,[],false);
    result.rows.map(r=>{
        let rolSchema = {
            'id': r[0],
            'rol':r[1],
        }
        listaRoles.push(rolSchema)
    });

    res.render('roles',{
        
        roles : listaRoles,
        usuario : req.session.usuario
    })
})

router.get('/add_rol',(req,res)=>{
    res.render('add_rol');
})

router.post('/add_rol', async (req,res)=>{
    let rol=req.body.rol;
    sql=`BEGIN insertar_rol('${rol}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/roles');
})

router.get("/edit_rol/:id", async (req,res)=>{
    let id = req.params.id;
    console.log(id);
    let listaRoles;
    sql=`select * from rol r where r.idrol=${id}`;
    let result = await BD.open(sql,[],false);
    console.log(result);
    result.rows.map(r=>{
        let rolSchema = {
            'id': r[0],
            'rol':r[1],
        }
        listaRoles =rolSchema
        console.log(listaRoles);
    });
    res.render("edit_rol",{
        rol : listaRoles,
    })
})

router.post('/edit_rol', async (req,res)=>{
    let id=req.body.id;
    let rol=req.body.rol;
    sql=`BEGIN modifica_rol(${id},'${rol}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/roles');
})

router.get('/delete_rol/:id', async (req,res)=>{
    const id = req.params.id;
    sql=`BEGIN elimina_rol(${id}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/roles');
})

router.post('/search_rol', async (req,res)=>{
    let rol=req.body.rol;
    console.log(rol);
    const listaRoles =[];
    sql=`select * from rol r where upper(r.rol) like upper('%${rol}%')`;

    let result = await BD.open(sql,[],false);
    result.rows.map(r=>{
        let rolSchema = {
            'id': r[0],
            'rol':r[1],
        }
        listaRoles.push(rolSchema)
    });

    res.render('roles',{
        
        roles : listaRoles,
        usuario : req.session.usuario
    })
})



//---------ROUTER CLIENTE-----------------//
//==========================================//

router.get('/clientes', async (req,res)=>{
    const listaClientes =[];
    sql='select * from cliente';

    let result = await BD.open(sql,[],false);
    result.rows.map(c=>{
        let cliSchema = {
            'id': c[0],
            'ruc': c[1],
            'rs': c[2],
            'telef': c[3],
            'direc': c[4],
            'email': c[5],
        }
        listaClientes.push(cliSchema)
    });

    res.render('clientes',{
        
        clientes : listaClientes,
        usuario : req.session.usuario
    })
})

router.get('/add_cliente',(req,res)=>{
    res.render('add_cliente');
})

router.post('/add_cliente', async (req,res)=>{
    let ruc=req.body.ruc;
    let rs=req.body.rs;
    let telef=req.body.telef;
    let direc=req.body.direc;
    let email=req.body.email;
    sql=`BEGIN insertar_cliente('${ruc}','${rs}','${telef}','${direc}','${email}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/clientes');
})

router.get("/edit_cliente/:id", async (req,res)=>{
    let id = req.params.id;
    console.log(id);
    let listaClientes;
    sql=`select * from cliente c where c.idcliente=${id}`;
    let result = await BD.open(sql,[],false);
    console.log(result);
    result.rows.map(cli=>{
        let cliSchema = {
            'id': cli[0],
            'ruc':cli[1],
            'rs':cli[2],
            'telef':cli[3],
            'direc':cli[4],
            'email':cli[5]
        }
        listaClientes =cliSchema
        console.log(listaClientes);
    });
    res.render("edit_cliente",{
        clientes : listaClientes,
    })
})

router.post('/edit_cliente', async (req,res)=>{
    let id=parseInt(req.body.id);
    let ruc=req.body.ruc;
    let rs=req.body.rs;
    let telef=req.body.telef;
    let direc=req.body.direc;
    let email=req.body.email;
    sql=`BEGIN modifica_cliente(${id},'${ruc}','${rs}','${telef}','${direc}','${email}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/clientes');
})

router.get('/delete_cliente/:id', async (req,res)=>{
    const id = req.params.id;
    sql=`BEGIN elimina_cliente(${id}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/clientes');
})

router.post('/search_cliente', async (req,res)=>{
    let rs=req.body.rs;
    console.log(rs);
    const listaClientes =[];
    sql=`select * from cliente c where upper(c.razonsocial) like upper('%${rs}%')`;

    let result = await BD.open(sql,[],false);
    result.rows.map(cli=>{
        let cliSchema = {
            'id': cli[0],
            'ruc':cli[1],
            'rs':cli[2],
            'telef':cli[3],
            'direc':cli[4],
            'email':cli[5]
        }
        listaClientes.push(cliSchema)
    });

    res.render('clientes',{
        
        clientes : listaClientes,
        usuario : req.session.usuario
    })
})

router.post('/order_cliente', async (req,res)=>{
    let tipo_orden=req.body.tipo_orden;
    const listaClientes =[];
    if (tipo_orden=='o_rs') {
        sql=`select * from cliente c order by c.razonsocial`;
    }
    else if (tipo_orden=='o_id'){
        sql=`select * from cliente c order by c.idcliente desc`;
    }
    let result = await BD.open(sql,[],false);
    result.rows.map(cli=>{
        let cliSchema = {
            'id': cli[0],
            'ruc':cli[1],
            'rs':cli[2],
            'telef':cli[3],
            'direc':cli[4],
            'email':cli[5]
        }
        listaClientes.push(cliSchema)
    });

    res.render('clientes',{
        clientes : listaClientes,
        usuario : req.session.usuario
    })
})


//---------ROUTER FACTURA-----------------//
//==========================================//

router.get('/facturas', async (req,res)=>{
    const listaFacturas =[];
    sql=`select f.idfactura, f.numfactura, to_char(f.fecha), f.monto_fact, e.nombres, c.razonsocial from factura f, empleado e, cliente c where f.idempleado=e.idempleado and f.idcliente=c.idcliente`;

    let result = await BD.open(sql,[],false);
    result.rows.map(f=>{
        let facSchema = {
            'id': f[0],
            'nf':f[1],
            'ff':f[2],
            'mf':f[3],
            'ide':f[4],
            'idc':f[5],
        }
        listaFacturas.push(facSchema)
    });

    res.render('facturas',{
        
        facturas : listaFacturas,
        usuario : req.session.usuario
    })
})

router.get('/add_factura', async (req,res)=>{

    const listaEmpleados =[];
    sql='select e.idempleado, e.nombres from empleado e';
    let result = await BD.open(sql,[],false);
    result.rows.map(e=>{
        let empSchema = {
            'id': e[0],
            'nombres':e[1]
        }
        listaEmpleados.push(empSchema)
    });

    const listaClientes =[];
    sql2='select c.idcliente, c.razonsocial from cliente c';
    let result2 = await BD.open(sql2,[],false);
    result2.rows.map(cli=>{
        let cliSchema = {
            'id': cli[0],
            'rs':cli[1]
        }
        listaClientes.push(cliSchema)
    });

    res.render('add_factura',{
        empleados : listaEmpleados,
        clientes : listaClientes
    })
})

router.post('/add_factura', async (req,res)=>{
    let id=req.body.id;
    let nf=req.body.nf;
    let ff=new Date(req.body.ff);
    let mf=req.body.mf;
    let ide=req.body.ide;
    let idc=req.body.idc;

    console.log(ff);

    
    sql=`BEGIN insertar_factura(${nf},'01-01-2020',${mf},${ide},${idc}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    
    res.redirect('/facturas');
})

function convertDateFormat(fecha) {
    let dia = fecha.getDate();
    let mes = fecha.getMonth()+1;
    let agnio = fecha.getFullYear();

    dia = ('0' + dia).slice(-2);
    mes = ('0' + mes).slice(-2);

    return agnio+"-"+mes+"-"+dia;
  }

router.get("/edit_factura/:id", async (req,res)=>{
    let id = req.params.id;

    const listaEmpleados =[];
    sql='select e.idempleado, e.nombres from empleado e';
    let result = await BD.open(sql,[],false);
    result.rows.map(e=>{
        let empSchema = {
            'id': e[0],
            'nombres':e[1]
        }
        listaEmpleados.push(empSchema)
    });

    const listaClientes =[];
    sql2='select c.idcliente, c.razonsocial from cliente c';
    let result2 = await BD.open(sql2,[],false);
    result2.rows.map(cli=>{
        let cliSchema = {
            'id': cli[0],
            'rs':cli[1]
        }
        listaClientes.push(cliSchema)
    });

    let listaFactura;
    sql=`select * from factura f where f.idfactura=${id}`;
    let result3 = await BD.open(sql,[],false);
    result3.rows.map(f=>{
        let fSchema = {
            'id': f[0],
            'nf':f[1],
            'ff':convertDateFormat(new Date(f[2])),
            'mf':f[3],
            'ide':f[4],
            'idc':f[5],
        }
        listaFactura =fSchema
    });
    res.render("edit_factura",{
        empleado : listaEmpleados,
        cliente : listaClientes,
        factura : listaFactura
    })
})

router.post('/edit_factura', async (req,res)=>{
    let id=req.body.id;
    let nf=req.body.nf;
    let ff=new Date(req.body.ff);
    let mf=req.body.mf;
    let ide=req.body.ide;
    let idc=req.body.idc;
    console.log(id);
    console.log(nf);
    console.log(ff);
    console.log(mf);
    console.log(ide);
    console.log(idc);

    sql=`BEGIN modifica_factura(${id},${nf},'01-02-2020',${mf},${ide},${idc}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/facturas');
})

router.get('/delete_factura/:id', async (req,res)=>{
    const id = req.params.id;
    sql=`BEGIN elimina_factura(${id}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/facturas');
})

//---------ROUTER CONTRATISTA-----------------//
//==========================================//

router.get('/contratista', async (req,res)=>{
    const listaContratistas =[];
    sql='select * from contratista';

    let result = await BD.open(sql,[],false);
    result.rows.map(c=>{
        let contSchema = {
            'id': c[0],
            'ruc': c[1],
            'rs': c[2],
            'ce': c[3],
            'telef': c[4],
            'direc': c[5],
            'email': c[6],
        }
        listaContratistas.push(contSchema)
    });

    res.render('contratista',{
        
        contratistas : listaContratistas,
        usuario : req.session.usuario
    })
})

router.get('/add_contratista',(req,res)=>{
    res.render('add_contratista');
})

router.post('/add_contratista', async (req,res)=>{
    let ruc=req.body.ruc;
    let rs=req.body.rs;
    let ce=parseInt(req.body.ce);
    let telef=req.body.telef;
    let direc=req.body.direc;
    let email=req.body.email;

    sql=`BEGIN insertar_contratista(${ruc},'${rs}',${ce},'${telef}','${direc}','${email}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/contratista');
})

router.get("/edit_contratista/:id", async (req,res)=>{
    let id = req.params.id;
    console.log(id);
    let listaContratistas;
    sql=`select * from contratista where idcontratista=${id}`;
    let result = await BD.open(sql,[],false);
    console.log(result);
    result.rows.map(cont=>{
        let contSchema = {
            'id': cont[0],
            'ruc':cont[1],
            'rs':cont[2],
            'ce':cont[3],
            'telef':cont[4],
            'direc':cont[5],
            'email':cont[6]
        }
        listaContratistas =contSchema
    });
    res.render("edit_contratista",{
        contratista : listaContratistas,
    })
})

router.post('/edit_contratista', async (req,res)=>{
    let id=parseInt(req.body.id);
    let ruc=parseInt(req.body.ruc);
    let rs=req.body.rs;
    let ce=parseInt(req.body.ce);
    let telef=req.body.telef;
    let direc=req.body.direc;
    let email=req.body.email;
    sql=`BEGIN modifica_contratista(${id},${ruc},'${rs}',${ce},'${telef}','${direc}','${email}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/contratista');
})

router.get('/delete_contratista/:id', async (req,res)=>{
    const id = req.params.id;
    sql=`BEGIN elimina_contratista(${id}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/contratista');
})


//---------ROUTER YACIMIENTO-----------------//
//==========================================//


router.get('/yacimiento', async (req,res)=>{
    const listaYacimientos =[];
    sql='select * from yacimiento';

    let result = await BD.open(sql,[],false);
    result.rows.map(y=>{
        let yaciSchema = {
            'id': y[0],
            'nom': y[1],
            'tm': y[2],
            'due': y[3],
            'capac': y[4],
            'telef': y[5],
            'ubi': y[6],
            'refe': y[7],
        }
        listaYacimientos.push(yaciSchema)
    });

    res.render('yacimiento',{
        
        yacimientos : listaYacimientos,
        usuario : req.session.usuario
    })
})

router.get('/add_yacimiento',(req,res)=>{
    res.render('add_yacimiento');
})

router.post('/add_yacimiento', async (req,res)=>{
    let nom=req.body.nom;
    let tm=req.body.tm;
    let due=req.body.due;
    let capac=parseInt(req.body.capac);
    let telef=req.body.telef;
    let ubi=req.body.ubi;
    let refe=req.body.refe;

    sql=`BEGIN insertar_yacimiento('${nom}','${tm}','${due}',${capac},'${telef}','${ubi}','${refe}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/yacimiento');
})

router.get("/edit_yacimiento/:id", async (req,res)=>{
    let id = req.params.id;
    console.log(id);
    let listaYacimiento;
    sql=`select * from yacimiento y where y.idyacimiento=${id}`;
    let result = await BD.open(sql,[],false);
    console.log(result);
    result.rows.map(y=>{
        let yaciSchema = {
            'id': y[0],
            'nom': y[1],
            'tm': y[2],
            'due': y[3],
            'capac': y[4],
            'telef': y[5],
            'ubi': y[6],
            'refe': y[7],
        }
        listaYacimiento =yaciSchema
    });
    res.render("edit_yacimiento",{
        yacimiento : listaYacimiento,
    })
})

router.post('/edit_yacimiento', async (req,res)=>{
    let id=req.body.id;
    let nom=req.body.nom;
    let tm=req.body.tm;
    let due=req.body.due;
    let capac=parseInt(req.body.capac);
    let telef=req.body.telef;
    let ubi=req.body.ubi;
    let refe=req.body.refe;
    sql=`BEGIN modifica_yacimiento(${id},'${nom}','${tm}','${due}',${capac},'${telef}','${ubi}','${refe}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/yacimiento');
})

router.get('/delete_yacimiento/:id', async (req,res)=>{
    const id = req.params.id;
    sql=`BEGIN elimina_yacimiento(${id}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/yacimiento');
})



//---------ROUTER TRANSPORTISTA-----------------//
//==========================================//


router.get('/transportista', async (req,res)=>{
    const listaTransportistas =[];
    sql='select * from transportista';

    let result = await BD.open(sql,[],false);
    result.rows.map(t=>{
        let transSchema = {
            'id': t[0],
            'ruc': t[1],
            'rs': t[2],
            'cant': t[3],
            'telef': t[4],
            'direc': t[5],
            'email': t[6],
        }
        listaTransportistas.push(transSchema)
    });

    res.render('transportista',{
        
        transportistas : listaTransportistas,
        usuario : req.session.usuario
    })
})

router.get('/add_transportista',(req,res)=>{
    res.render('add_transportista');
})

router.post('/add_transportista', async (req,res)=>{
    let id=req.body.id;
    let ruc=req.body.ruc;
    let rs=req.body.rs;
    let cant=parseInt(req.body.cant);
    let telef=req.body.telef;
    let direc=req.body.direc;
    let email=req.body.email;

    sql=`BEGIN insertar_transportista(${ruc},'${rs}',${cant},'${telef}','${direc}','${email}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/transportista');
})

router.get("/edit_transportista/:id", async (req,res)=>{
    let id = req.params.id;
    console.log(id);
    let listaTransportista;
    sql=`select * from transportista t where t.idtransportista=${id}`;
    let result = await BD.open(sql,[],false);
    console.log(result);
    result.rows.map(t=>{
        let transSchema = {
            'id': t[0],
            'ruc': t[1],
            'rs': t[2],
            'cant': t[3],
            'telef': t[4],
            'direc': t[5],
            'email': t[6],
        }
        listaTransportista =transSchema
    });
    res.render("edit_transportista",{
        transportista : listaTransportista,
    })
})

router.post('/edit_transportista', async (req,res)=>{
    let id=req.body.id;
    let ruc=req.body.ruc;
    let rs=req.body.rs;
    let cant=parseInt(req.body.cant);
    let telef=req.body.telef;
    let direc=req.body.direc;
    let email=req.body.email;

    sql=`BEGIN modifica_transportista(${id},${ruc},'${rs}',${cant},'${telef}','${direc}','${email}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/transportista');
})

router.get('/delete_transportista/:id', async (req,res)=>{
    const id = req.params.id;
    sql=`BEGIN elimina_transportista(${id}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/transportista');
})

//---------ROUTER CONTRATO-----------------//
//==========================================//

router.get('/contrato/:nf/:id', async (req,res)=>{
    const nf = req.params.nf;
    const idf = req.params.id;
    const listaContratos =[];
    sql=`select c.idfactura, contr.razonsocial, t.razonsocial, y.nombre, c.fecha, c.toneladas, c.estado from contrato c, contratista contr, transportista t, yacimiento y where c.idfactura=${idf} and c.idcontratista=contr.idcontratista and c.idtransportista=t.idtransportista and c.idyacimiento=y.idyacimiento`;

    let result = await BD.open(sql,[],false);
    result.rows.map(c=>{
        let contSchema = {
            'id': c[0],
            'contr': c[1],
            't': c[2],
            'y': c[3],
            'fe': c[4],
            'ton': c[5],
            'est': c[6],
        }
        listaContratos.push(contSchema)
    });

    res.render('contrato',{
        numf:nf,
        idf:idf,
        contratos : listaContratos,
        usuario : req.session.usuario
    })
})

router.get('/add_contrato/:idf', async (req,res)=>{
    let idf = req.params.idf;
    console.log(idf);
    const listaContratista =[];
    sql='select c.idcontratista, c.razonsocial from contratista c';
    let result = await BD.open(sql,[],false);
    result.rows.map(cont=>{
        let contSchema = {
            'id': cont[0],
            'rs':cont[1]
        }
        listaContratista.push(contSchema)
    });

    const listaTransportista =[];
    sql2='select t.idtransportista, t.razonsocial from transportista t';
    let result2 = await BD.open(sql2,[],false);
    result2.rows.map(t=>{
        let tSchema = {
            'id': t[0],
            'rs':t[1]
        }
        listaTransportista.push(tSchema)
    });

    const listaYacimiento =[];
    sql3='select y.idyacimiento, y.nombre from yacimiento y';
    let result3 = await BD.open(sql3,[],false);
    result3.rows.map(y=>{
        let ySchema = {
            'id': y[0],
            'nom':y[1]
        }
        listaYacimiento.push(ySchema)
    });

    res.render('add_contrato',{
        idfac:idf,
        contratistas : listaContratista,
        transportistas : listaTransportista,
        yacimientos : listaYacimiento
    })
})

router.post('/add_contrato', async (req,res)=>{
    let idf=parseInt(req.body.idfac);
    let idcontr=parseInt(req.body.idcontr);
    let idt=parseInt(req.body.idt);
    let idy=parseInt(req.body.idy);
    let fe=req.body.fe;
    let ton=parseFloat(req.body.ton);
    let est=req.body.est;
    console.log(idf);
    
    sql=`BEGIN insertar_contrato(${idf},${idcontr},${idt},${idy},'01-01-2021',${ton},'${est}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/facturas');
    
})

router.get("/edit_contratista/:id", async (req,res)=>{
    let id = req.params.id;
    console.log(id);
    let listaContratistas;
    sql=`select * from contratista where idcontratista=${id}`;
    let result = await BD.open(sql,[],false);
    console.log(result);
    result.rows.map(cont=>{
        let contSchema = {
            'id': cont[0],
            'ruc':cont[1],
            'rs':cont[2],
            'ce':cont[3],
            'telef':cont[4],
            'direc':cont[5],
            'email':cont[6]
        }
        listaContratistas =contSchema
    });
    res.render("edit_contratista",{
        contratista : listaContratistas,
    })
})

router.post('/edit_contratista', async (req,res)=>{
    let id=parseInt(req.body.id);
    let ruc=parseInt(req.body.ruc);
    let rs=req.body.rs;
    let ce=parseInt(req.body.ce);
    let telef=req.body.telef;
    let direc=req.body.direc;
    let email=req.body.email;
    sql=`BEGIN modifica_contratista(${id},${ruc},'${rs}',${ce},'${telef}','${direc}','${email}'); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/contratista');
})

router.get('/delete_contrato/:id', async (req,res)=>{
    const id = req.params.id;
    sql=`BEGIN elimina_contrato(${id}); COMMIT;END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/facturas');
})

/*------------------------------------------------------*/
/*------------------------------------------------------*/

router.get('/index',(req,res)=>{
    res.render('index');
})

router.get('/form',(req,res)=>{
    res.render('form');
})

router.post('/agrega', async (req,res)=>{
    let id=parseInt(req.body.id);
    let ruc=req.body.ruc;
    let rs=req.body.rs;
    let telef=req.body.telef;
    let direc=req.body.direc;
    let email=req.body.email;
    sql=`BEGIN insertar(${id},${ruc},${rs},${telef},${direc},${email}); COMMIT; END;`
    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    res.redirect('/fromoracle');
})

router.get('/fromoracle',async(req,res)=>{
    const personas =[];
    sql='select * from cliente';

    let result = await BD.open(sql,[],false);
    console.log(result.rows);
    console.log(personas);
    result.rows.map(person=>{
        let userSchema = {
            'id': person[0],
            'ruc':person[1],
            'razonSocial':person[2],
            'telefono':person[3],
            'direccion':person[4],
            'email':person[5]
        }
        personas.push(userSchema)
    });
    //res.json({personas});
    console.log(personas);
    res.render('index',{
        clientes:personas
    });
})









module.exports=router;