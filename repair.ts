import { jsonrepair } from 'jsonrepair'

const fs = require('fs')
function repairAndParseJSON() {
    // Paso 1: Reemplazar ' por " y asegurarse de que las claves estén entre comillas

    try {
        // The following is invalid JSON: is consists of JSON contents copied from
        // a JavaScript code base, where the keys are missing double quotes,
        // and strings are using single quotes:
        const json = fs.readFileSync('./jsonMalo.txt', 'utf8')
        const repaired = jsonrepair(json)

        console.log(repaired) // '{"name": "John"}'
    } catch (err) {
        console.error(err)
    }
}

// Uso de la función con el string de entrada (asegúrate de pasar el string correcto aquí)

const jsonObject = repairAndParseJSON()

console.log(jsonObject)
