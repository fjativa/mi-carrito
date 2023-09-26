console.clear();
// Tomar las secciones que contiene los elementos que tendrán eventos.
// Nota: El objetivo es obtener datos del producto (img, precios, nombre, id) para agregar al carrito.
  // Por ende hay que RECORRER con 'parentElement' dentro de los elementos hasta llegar a c/uno de ellos.

  // Paso#1: Crear variables
  const carrito = document.querySelector('#carrito'); // Toma el id del div/sección donde se agregarán los items. linea 23.
  const contenedorCarrito = document.querySelector ('#lista-carrito tbody'); //Toma el elemento 'tbody' que está dentro del contenedor con id 'lista-carrito'.
  const listaCursos = document.querySelector('#lista-cursos'); // Toma el contenedor con id 'lista-cursos' que contiene todos los cursos.
  
  const vaciarCarritoBtn = document.querySelector('#vaciar-carrito') //Toma el contenedor con id 'vaciar-carrito' está dentro de la sección de carrito.
  
  const formulario = document.querySelector('#busqueda');
  
  let articulosCarrito = []; // Matriz donde se almacenarán los productos.
  
  //Paso#2: Ubicar la sección de productos.
  cargaEventListeners (); //Función que contiene los eventos a realizar.
  
  function cargaEventListeners() {
    // Crear un curso al presionar 'Agregar al Carrito'.
    listaCursos.addEventListener('click', agregarCurso);

    // Elimina elemento del carrito - la variable 'carrito' contiene el elemento.
    carrito.addEventListener('click', eliminarCurso);

    // Vaciar carrito.
    vaciarCarritoBtn.addEventListener('click', () =>{
        articulosCarrito =[];
        limpiarHTML();
    })

    // Validar Formulario con 'preventDefault' para evitar el submit.
    formulario.addEventListener('submit',validarFormulario);

    // Cuando el documento esté cargado en su totalidad.
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];  // Se añadio el or para evitar error por el null, cuando en localstore no ha registro.
        carritoEnHTML();
    })

  }
  
  // Formulario
  function validarFormulario(e){
      e.preventDefault();
  }
  
  //Paso$6: Elimina curso del carrito.
  function eliminarCurso (e){
      cursoId = e.target.getAttribute('data-id');
      
      //Elminar del arreglo
      articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
      
      carritoEnHTML(); // Iterar sobre el carrito y mostrar el HTML. 
  }
  
  function agregarCurso (e){
      e.preventDefault(); // Previene un salto de focus.
      if (e.target.classList.contains('agregar-carrito')) {
          const cursoSeleccionado = e.target.parentElement.parentElement; //Esta sección contiene todos los elementos del producto.
          leerDatosCurso (cursoSeleccionado);
      }
  }
  
  //Paso#3: Almacenar los atributos del producto.
  // Lee el contenido del HTML, al dar click y extraer la info del curso.
  function leerDatosCurso(curso){
      //console.log(curso);
      // Crear un objeto con el contenido del curso actual.
      const infoCurso = {
          imagen: curso.querySelector('img').src,
          titulo: curso.querySelector('h4').textContent,
          precio: curso.querySelector('.precio span').textContent, // Seleciona span de la clase precio.
          id: curso.querySelector('a').getAttribute('data-id'), // Para obtener un atributo dentro de un elemento.
          cantidad: 1
      }
  
      //Paso#5: Revisar si un elemento ya existe en el carrito. Usaremos '.some'.
      const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
      if (existe){
          // Actualizar la cantidad.
          const cursos = articulosCarrito.map (curso => {
              if (curso.id === infoCurso.id){
                  curso.cantidad++;
                  return curso;
              } else {
                  return curso;
              }
          });
          articulosCarrito = [...cursos];
      } else {
          //console.table(infoCurso);
          //Paso#4: Agregar los elemtos del producto al carrito de compra.
          //Agregar elementos al arreglos del carrito.
          articulosCarrito = [...articulosCarrito, infoCurso]
          console.log(articulosCarrito);
      }
      carritoEnHTML();
  }
  
  //Muestra el carrito e comprar en el HTML.
  function carritoEnHTML(){
      // Limpiar HTML para evitar que se repita.
      limpiarHTML();
  
      // Recorre el carrito y genera el HTML
      articulosCarrito.forEach ( curso => {
          const {imagen, titulo, precio, cantidad, id} = curso;       // Una vez que el proces fnciones, Usar distuption para  optimizar código. 
          const row = document.createElement('tr'); // 'createElement' - Crea elemento HTML (fila).
          row.innerHTML = `
              <td>
                  <img src="${imagen}" width="80" img>  
              </td>
              <td> ${titulo} </td>
              <td> ${precio} </td>
              <td> ${cantidad} </td>
              <td>
                  <a href="#" class="borrar-curso" data-id="${id}"> x </a> 
              </td>
  
              `; 
  
          // Agrega el HTML al carrito: Agrega columna con su contenido segun del articulo..
          contenedorCarrito.appendChild(row);
      })
      
      sincronizarStorage();
  }
  
  // Elimina los cursos del tbody
  function limpiarHTML(){
      // Forma1: lenta.
      //contenedorCarrito.innerHTML='';
  
      //forma2: optima.
      while (contenedorCarrito.firstChild){
          contenedorCarrito.removeChild(contenedorCarrito.firstChild);
      }
  }

//Agrega los productos actuales a localStorage.
function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}