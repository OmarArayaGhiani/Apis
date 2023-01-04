let none = document.querySelector("#none")
let impResult = document.querySelector("#result")
let impDivisa = document.querySelector("#divisa")
const ctx = document.getElementById('graficas');

let grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Valor en los últimos 10 días registrados',
                data: [],
                borderWidth: 1
            }]
        },    
    }
)

const getDivisa = async (moneda, clp) => {
    try{
        const dataDivisa = await fetch("https://mindicador.cl/api/")
        const divisa = await dataDivisa.json()
        let result = clp / divisa[moneda].valor
        none.style.display = "block"
        impResult.innerHTML = result.toFixed(2)
        impDivisa.innerHTML = moneda
        getGraficas(moneda)
    }
    catch (error){
        alert("No se pudo obtener el valor de la divisa")
    }
}

const getGraficas = async(moneda) =>{
    try{
        const dataFechas = await fetch(`https://mindicador.cl/api/${moneda}`)
        const fechasDivisa = await dataFechas.json()
        let fechas = fechasDivisa.serie.splice(0, 10)
        console.log(fechas)
        labelsFechas = []
        valoresDivisa= []
        fechas.forEach(element => {
            let formatoFecha = moment(element.fecha).format("DD/MM/YYYY")
            labelsFechas.push(formatoFecha)
            valoresDivisa.push(element.valor)        
        })
        labelsFechas.reverse()
        valoresDivisa.reverse()
        grafico.data.labels = labelsFechas
        grafico.data.datasets[0].data = valoresDivisa
        grafico.update()   
    }
    catch (error){
        alert("No se pudo obtener los datos para graficar")
    }
}

const calculate = () => {
    let clp = document.querySelector("#input").value
    let moneda = document.querySelector("#select").value
    if(clp == ""){
        alert("Debes ingresar un valor de CLP")
    }
    else{
        getDivisa(moneda, clp)
    }
}

document.querySelector("#input").addEventListener("keydown", function(event){
    let clp = document.querySelector("#input").value
    let moneda = document.querySelector("#select").value
    if(event.keyCode === 13 && clp == ""){
        alert("Debes ingresar un valor de CLP")
    }
    else if(event.keyCode === 13){
        getDivisa(moneda, clp)
    }
})
