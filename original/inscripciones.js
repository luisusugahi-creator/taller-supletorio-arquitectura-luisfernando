// inscripciones.js
var inscripciones = [];
var cursos = [{ codigo: "ARQ1", nombre: "Arquitectura I", cupo: 2, prerrequisito: null },
              { codigo: "ARQ2", nombre: "Arquitectura II", cupo: 25, prerrequisito: "ARQ1" }];

function inscribir(est, codigo, modalidad) {
  if (!est || !est.nombre || est.nombre.length < 3) { console.log("Error: estudiante invalido"); return; }
  if (!codigo || codigo.length != 4) { console.log("Error: codigo invalido"); return; }
  var curso = null;
  for (var i = 0; i < cursos.length; i++) { if (cursos[i].codigo == codigo) curso = cursos[i]; }
  var inscritos = 0;
  for (var j = 0; j < inscripciones.length; j++) {
    if (inscripciones[j].curso == codigo && inscripciones[j].estado == "activa") inscritos++;
    if (inscripciones[j].curso == codigo && inscripciones[j].estudiante == est.nombre && inscripciones[j].estado == "activa") {
      console.log("Error: ya inscrito"); return;
    }
  }
  if (inscritos >= curso.cupo) { console.log("Error: sin cupo"); return; }
  if (curso.prerrequisito != null && est.aprobados.indexOf(curso.prerrequisito) == -1) {
    console.log("Error: falta prerrequisito " + curso.prerrequisito); return;
  }
  var valor = 0;
  if (modalidad == "presencial") valor = 200000;
  else if (modalidad == "virtual") valor = 150000;
  if (est.becado == true) valor = valor * 0.3;
  inscripciones.push({ estudiante: est.nombre, curso: codigo, valor: valor, estado: "activa" });
  console.log("EMAIL a " + est.correo + ": quedaste inscrito en " + curso.nombre + ". Valor $" + valor);
  console.log("EMAIL a coordinacion: nuevo inscrito en " + curso.nombre);
  document.getElementById("res").innerHTML = "<b>Inscrito en " + curso.nombre + " por $" + valor + "</b>";
}

function retirar(est, codigo) {
  if (!est || !est.nombre || est.nombre.length < 3) { console.log("Error: estudiante invalido"); return; }
  if (!codigo || codigo.length != 4) { console.log("Error: codigo invalido"); return; }
  for (var i = 0; i < inscripciones.length; i++) {
    if (inscripciones[i].curso == codigo && inscripciones[i].estudiante == est.nombre && inscripciones[i].estado == "activa") {
      inscripciones[i].estado = "retirada";
      console.log("EMAIL a " + est.correo + ": te retiraste de " + codigo);
      console.log("EMAIL a coordinacion: retiro en " + codigo);
      document.getElementById("res").innerHTML = "<b>Retiro OK</b>";
    }
  }
}
