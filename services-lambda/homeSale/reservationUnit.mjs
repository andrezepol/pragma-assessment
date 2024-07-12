import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { request } from "https";

const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event, context) => {
    try {
        const sell = JSON.parse(event.body);
        const code = randomUUID(); // Creación de código único para la reserva

        // Consulta estado de Apartamento
        const identifier = `${sell.proyectoId}${sell.apartmentId}`;
        const APIURLsearch = "https://ttyeovkcw9.execute-api.us-east-1.amazonaws.com/v1/homeSale/searchByprojectIdapartamentId";
        const bodyPost = {
            "data": {
                "projectId": sell.proyectoId,
                "apartmentId": sell.apartmentId
            }
        };

        const data = await makePostRequest(APIURLsearch, bodyPost);

        if (data.state === 'Vendido') {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ message: "Unidad no se encuentra disponible para venta" }),
            };
        }

        if (data.state === 'Reservado') {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ message: "Unidad no se encuentra disponible para reservar" }),
            };
        }

        // Consumo de manageUnit para cambiar el estado
        const APIURLmanage = "https://ttyeovkcw9.execute-api.us-east-1.amazonaws.com/v1/homeSale/manageUnit";
        
        const bodyManage = {
            proyectoId: sell.proyectoId,
            apartmentId: sell.apartmentId,
            reserveToken: code, 
            state: "Reservado"
            
        };
        const changeState = await makePutRequest(APIURLmanage, bodyManage);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(changeState),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};

// Función para realizar solicitudes POST
const makePostRequest = (url, body) => {
    const bodyString = JSON.stringify(body);
    return new Promise((resolve, reject) => {
        const req = request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyString),
            }
        }, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    //reject(new Error(`Request failed with status code ${res.statusCode}`));
                    reject(new Error(`Request failed with status code ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(bodyString);
        req.end();
    });
};

// Función para realizar solicitudes PUT
const makePutRequest = (url, body) => {
    const bodyString = JSON.stringify(body);
    return new Promise((resolve, reject) => {
        const req = request(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyString),
            }
        }, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Request failed with status code ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(bodyString);
        req.end();
    });
};
