Feature: Gestión de Proyectos de Construcción

  Escenario: Que se desea crear un proyecto de construcción
    Dado que la constructora desea crear un proyecto de construccion
    Cuando ingresa datos minimos para creacion de un nuevo proyecto
    Entonces se crea un proyecto de construccion con identificador unico
    Y la respuesta tiene el estado 200

  Escenario: Se desea consultar un proyeto de construccion previamente creado
    Dado que la constructora desea consultar un proyecto de construccion
    Cuando ingresa indicador unico projectId 
    Entonces se consulta el proyecto de construccion con identificador unico
    Y la respuesta tiene el estado 200

  Escenario: Se desea consultar un proyeto de construccion erroneo
    Dado que la constructora desea consultar un proyecto de construccion 
    Cuando se ingresa un indicador unico projectId erroneo
    Entonces responde error de negocio Proyecto no encontrado
    Y la respuesta tiene el estado 404

  Escenario: Se desea consultar un inmueble(unidad)
    Dado que la constructora desea consultar un proyecto de construccion
    Cuando ingresa indicador unico projectId e indicador de inmueble
    Entonces se consulta el proyecto de construccion con identificador unico
    Y la respuesta tiene el estado 200

  Escenario: Se desea consultar inmueble(unidad) que no existe
    Dado que la constructora desea consultar un inmueble de construccion
    Cuando se ingresa un indicador unico projectId o indicador de inmueble erroneo
    Entonces responde error de negocio Verificar datos ingresados
    Y la respuesta tiene el estado 404

  Escenario: Un cliente desea reservar un inmueble
    Dado que un cliente desea reservar un inmueble
    Cuando ingresa indicador unico del proyecto e indicador de inmueble a reservar
    Entonces se reserva inmueble y se genera un codigo unico de reserva
    Y la respuesta tiene el estado 200

  Escenario: Un cliente desea reservar un inmueble que ya reservo otro cliente
    Dado que un cliente desea reservar un inmueble que ya reservo otro cliente
    Cuando ingresa indicador unico del proyecto e indicador de inmueble a reservar
    Entonces responde error de negocio Unidad no se encuentra disponible para reservar
    Y la respuesta tiene el estado 400

  Escenario: Un cliente desea reservar un inmueble que ya compro otro cliente
    Dado que un cliente desea reservar un inmueble que ya compro otro cliente
    Cuando ingresa indicador unico del proyecto e indicador de inmueble a reservar
    Entonces responde error de negocio Unidad no se encuentra disponible para reservar
    Y la respuesta tiene el estado 400

  Escenario: Un cliente desea comprar un inmueble
    Dado que un cliente desea comprar un inmueble
    Cuando ingresa indicador unico del proyecto, indicador de inmueble y codigo unico de reserva 
    Entonces se valida el codigo de reserva y se realiza la compra
    Y la respuesta tiene el estado 200

  Escenario: Un cliente desea comprar un inmueble que ya compró otro cliente
    Dado que un cliente desea comprar un inmueble que ya compró otro cliente
    Cuando ingresa indicador unico del proyecto, indicador codigo de reserva de inmueble a comprar
    Entonces responde error de negocio Unidad no se encuentra disponible
    Y la respuesta tiene el estado 400

  Escenario: Un empleado desea gestionar los recursos de un proyecto
    Dado que un empleado desea gestionar los recursos de un proyecto
    Cuando ingresa el indicador unico de proyecto y los recursos a modificar
    Entonces se actualiza el numero de recursos en ese dia
    Y la respuesta tiene el estado 200