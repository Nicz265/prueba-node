const inquirer = require('inquirer');
const fs = require('fs');

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
		choices: ['Muzzarella', 'Napolitana', '4 quesos', 'Calabresa'],
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
		message: 'Por ser cliente habitual te regalamos 3 empanadas, elegí tres gustos distintos:',
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
		console.log('Bienvenido a DH Pizzas. Estamos listos para tomar tu pedido');
		respuestas.nombreCliente=respuestas.nombreCliente.trim();
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
		let precioPizza = 0;
		let precioBebida = 0;
		let descuento = 0;

		if (respuestas.conBebida) {
			precioBebida = 80;
		}

		switch (respuestas.tamanioPizza) {
			case 'Personal':
				descuento = respuestas.conBebida ? 3 : 0;
				precioPizza = 430 + precioBebida;
				break;
			case 'Mediana':
				descuento = respuestas.conBebida ? 5 : 0;
				precioPizza = 560 + precioBebida;
				break;
			default:
				descuento = respuestas.conBebida ? 8 : 0;
				precioPizza = 650 + precioBebida;
				break;
		}
		console.log('===============================');
		console.log(`Total productos: \$${precioPizza}`);

		if (respuestas.paraDelivery) {
			console.log('Total delivery: $20');
			precioPizza += 20;
		}

		console.log(`Descuentos: ${descuento}%`);
		console.log(`TOTAL: \$${(precioPizza - (precioPizza * descuento) / 100)}`);
		console.log("===============================");
		console.log("Gracias por comprar en DH Pizzas. Esperamos que disfrutes tu pedido.");
		//console.log(respuestas);
		let fecha = new Date();
		let fechaPedido = fecha.toLocaleDateString();
		let horaPedido = fecha.toLocaleTimeString();
		let dataAdicional = {
			fecha: fechaPedido,
			hora: horaPedido,
			totalProductos: precioPizza,
			descuento: descuento,
		}
		const rutaDelArchivo = __dirname + '/pedidos.json';

		let infoArchivo = fs.readFileSync(rutaDelArchivo, 'utf8');

		let arrayPedidos = infoArchivo.length == 0 ? [] : JSON.parse(infoArchivo);

		respuestas = {
			numeroPedido: arrayPedidos.length + 1,
			...respuestas,
			...dataAdicional,
		};

		arrayPedidos.push(respuestas);

		fs.writeFileSync(rutaDelArchivo, JSON.stringify(arrayPedidos, null, ' '));
});