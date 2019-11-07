const fs = require('fs');

let fecha = new Date();
		let fechaReporte = fecha.toLocaleDateString();
        let horaReporte = fecha.toLocaleTimeString();

const rutaPedidos = `${__dirname}/pedidos.json`;
const contenidoPedidos = fs.readFileSync(rutaPedidos, 'utf8');
let pedidos = contenidoPedidos.length > 0 ? JSON.parse(contenidoPedidos) : null;

if (pedidos == null) {
	console.log('Actualmente el sistema no tiene pedidos para generar el reporte');
} else {
    console.log('¡Reporte generado con éxito!\n');

    console.log('|===*** Reporte de ventas ***====|');
    console.log(`Fecha de generación: ${fechaReporte}`)
    console.log(`Hora: ${horaReporte}\n`)

    console.log("|===*** Cantidad de pedidos realizados ***====|")
    console.log(`Total: ${pedidos.length}\n`);
    
    console.log("|===*** Cantidad de pedidos para delivery ***====|")
    let filtrarDelivery = pedidos => pedidos.filter(pedido => pedido.paraDelivery == true).length;
    let cantidadDelivery = filtrarDelivery(pedidos);
	console.log(`Total: ${cantidadDelivery}\n`);
	
    console.log("|===*** Cantidad de pizzas vendidas por gusto ***====|");
    let filtrarPorGusto = gusto => pedidos.filter(pedido => pedido.gustoPizza == gusto).length;
	let gustoMuzzarella = filtrarPorGusto('Muzzarella');
	let gustoQuesos = filtrarPorGusto('4 quesos');
	let gustoCalabresa = filtrarPorGusto('Calabresa');
    let gustoNapolitana = filtrarPorGusto('Napolitana');
	console.log(`Total Muzzarella: ${gustoMuzzarella}`);
	console.log(`Total 4 quesos: ${gustoQuesos}`);
	console.log(`Total Calabresa: ${gustoCalabresa}`);
	console.log(`Total Napolitana: ${gustoNapolitana}\n`);

    console.log("|===*** Cantidad de pizzas vendidas por tamaño ***====|");
    let filtrarPorTamanio = tamanio => pedidos.filter(pedido => pedido.tamanioPizza == tamanio).length;
	let tamanioPersonal = filtrarPorTamanio('Personal');
	let tamanioMediana = filtrarPorTamanio('Mediana');
	let tamanioGrande = filtrarPorTamanio('Grande');
	console.log(`Total Personal: ${tamanioPersonal}`);
	console.log(`Total Mediana: ${tamanioMediana}`);
	console.log(`Total Grande: ${tamanioGrande}\n`);

    console.log("|===*** Cantidad de pedidos con bebida ***====|")
    let filtrarBebida = pedidos => pedidos.filter(pedido => pedido.conBebida == true).length;
    let cantidadBebida = filtrarBebida(pedidos);
	console.log(`Total: ${cantidadBebida}\n`);

    console.log("|===*** Cantidad de clientes habituales ***====|")
    let filtrarHabituales = pedidos => pedidos.filter(pedido => pedido.clienteHabitual == true).length;
    let cantidadHabituales = filtrarHabituales(pedidos);
	console.log(`Total: ${cantidadHabituales}\n`);

    console.log("|===*** Cantidad de empanadas regaladas ***====|")
    let cantidadEmpanadas= cantidadHabituales*3;
	console.log(`Total: ${cantidadEmpanadas}`);

    let contenidoAGuardar = `
        Fecha de generación: ${fechaReporte}
        Hora: ${horaReporte}    
        Cantidad total de pedidos: ${pedidos.length}
        Cantidad de pedidos para delivery: ${cantidadDelivery}
		Cantidad de Muzzarella: ${gustoMuzzarella}
		Cantidad de 4 quesos: ${gustoQuesos}
		Cantidad de Calabresa: ${gustoCalabresa}
        Cantidad de Napolitana: ${gustoNapolitana}
        Cantidad Personales: ${tamanioPersonal}
        Cantidad Medianas: ${tamanioMediana}
        Cantidad Grandes: ${tamanioGrande}
        Cantidad de pedidos con bebida: ${cantidadBebida}
        Cantidad de clientes habituales: ${cantidadHabituales}
        Cantidad de empanadas regaladas: ${cantidadEmpanadas}
	`;

	fs.writeFileSync(`${__dirname}/reporte.txt`, contenidoAGuardar);
}