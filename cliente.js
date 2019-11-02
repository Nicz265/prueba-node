const inquirer = require('inquirer');

let preguntas = [
	{
		type: 'confirm',
		message: '¿Querés la pizza para delivery?',
		name: 'paraDelivery',
		default: false,
	},
	{
		type: 'input',
		message: 'Ingresá tu dirección:',
		name: 'direccionEntrega',
		when: function (respuestas) {
			return respuestas.paraDelivery;
		},
		validate: rta=>rta.trim()==""?"Campo obligatorio":true,
	},
	{
		type: 'input',
		message: 'Ingresá tu nombre:',
		name: 'nombreCliente',
		validate: rtaDeEstaPregunta => {
			if (rtaDeEstaPregunta.trim() == ""){
				return "El nombre es obligatorio";
			}
			return true;
		}
	},
	{
		type: 'input',
		message: 'Ingresá tu teléfono:',
		name: 'telefonoCliente',
		validate: rtaDeEstaPregunta => {
			if (rtaDeEstaPregunta.trim() == ""){
				return "El número es obligatorio";
			}else if(rtaDeEstaPregunta.length < 8 || isNaN(rtaDeEstaPregunta)){
				return "Ingresá un número válido y mayor a 8 números";
			}else{
				return true;
			}
		}
	},
	{
		type: 'rawlist',
		message: 'Elegí el gusto de la pizza:',
		choices: ['Muzza', 'Napo', '4 quesos', 'Calabresa'],
		name: 'gustoPizza',
	},
	{
		type: 'list',
		message: 'Elegí el tamaño de la pizza:',
		choices: ['Personal', 'Mediana', 'Grande'],
		name: 'tamanioPizza',
	},
	{
		type: 'confirm',
		message: '¿Querés agregar bebida?',
		name: 'conBebida',
		default: false,
	},
	{
		type: 'list',
		message: 'Elegí el gusto de la bebida:',
		choices: ['Coca-cola', 'Pepsi', 'Sprite', '7 Up'],
		name: 'gustoBebida',
		when: function (respuestas) {
			return respuestas.conBebida;
		},
	},
	{
		type: 'confirm',
		message: '¿Sos cliente habitual?',
		name: 'clienteHabitual',
		default: false,
	},
	{
		type: 'checkbox',
		message: 'Elegí los gustos de las empanadas:',
		choices: ['Carne picante', 'Pollo', 'Margarita', 'Cebolla y queso'],
		name: 'gustoEmpanadas',
		when: rta=>rta.clienteHabitual,
		validate: function (rta){
			if (rta.length<3||rta.length>3){
				return "Elegí 3 empanadas";
			}
			return true
		}
	},
];

inquirer
	.prompt(preguntas)
	.then(function (respuestas) {
		respuestas.nombreCliente=respuestas.nombreCliente.trim();
		let precioPizza=0;
		console.log("=== Resumen de tu pedido ===");
		console.log("Tus datos son - Nombre: "+respuestas.nombreCliente+" / Teléfono: "+respuestas.telefonoCliente);
		if (respuestas.paraDelivery){
			console.log("Tu pedido será entregado en: "+respuestas.direccionEntrega);
		}else{
			console.log("Nos indicaste que pasarás a retirar tu pedido")
		}
		console.log("=== Productos solicitados ===");
		console.log("Pizza: "+respuestas.gustoPizza);
		console.log("Tamaño: "+respuestas.tamanioPizza);
		if (respuestas.conBebida==true){
			console.log("Bebida: "+respuestas.gustoBebida);
		}
		if (respuestas.clienteHabitual==true){
			console.log("Tus tres empanadas de regalo serán de: "+"\n● "+respuestas.gustoEmpanadas[0]+"\n● "+respuestas.gustoEmpanadas[1]+"\n● "+respuestas.gustoEmpanadas[2]);
		}
		console.log("===============================");
		if (respuestas.tamanioPizza=="Personal"){
			precioPizza=430;
		}
		if (respuestas.tamanioPizza=="Mediana"){
			precioPizza=560;
		}
		if (respuestas.tamanioPizza=="Grande"){
			precioPizza=650;
		}
		if (respuestas.conBebida==false){
			console.log("Total productos: $"+precioPizza);
		}else{
			precioPizza=precioPizza+80;
			console.log("Total productos: $"+precioPizza);
		}
		if (respuestas.paraDelivery==true){
			console.log("Total delivery: $20");
		}
		if (respuestas.conBebida==true && respuestas.tamanioPizza=="Personal"){
			precioPizza2=precioPizza*0.03;
			console.log("Descuentos: $"+parseInt(precioPizza2))
			precioPizza=precioPizza-precioPizza2;
		}else if (respuestas.conBebida==true && respuestas.tamanioPizza=="Mediana"){
			precioPizza2=precioPizza*0.05;
			console.log("Descuentos: $"+parseInt(precioPizza2))
			precioPizza=precioPizza-precioPizza2;
		}
		else if (respuestas.conBebida==true && respuestas.tamanioPizza=="Grande"){
			precioPizza2=precioPizza*0.08;
			console.log("Descuentos: $"+parseInt(precioPizza2))
			precioPizza=precioPizza-precioPizza2;
		}
		if (respuestas.paraDelivery==true){
			precioPizza=precioPizza+20;
			console.log("TOTAL: $"+parseInt(precioPizza));
		}else {
			console.log("TOTAL: $"+parseInt(precioPizza));
		}
		console.log("===============================");
		console.log("Gracias por comprar en DH Pizzas. Esperamos que disfrutes tu pedido.");
		console.log(respuestas);
	});
