//Importación de Librerías
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event) => {
        const requestBody = JSON.parse(event.body);
        const identifier = `${requestBody.proyectoId}${requestBody.apartmentId}`;
        
        const { updateExpression, expressionAttributeValues, expressionAttributeNames } = generateUpdateExpression(requestBody);
        const proyecto = JSON.parse(event.body);  
        
        const params = {
            TableName: "Apartamentos",
            Key: {
                proyectoId: identifier
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames, 
            ReturnValues: "ALL_NEW" 
        };
    try{
        const result = await ddbDocClient.send(new UpdateCommand(params));
        const response = {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(result.Attributes)
        };

        return response;
        
    } catch (err) {
        console.error("Error:", err);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: err.message })
        };
    }
};

//Crear Función updateExpression
function generateUpdateExpression(requestBody) {
    const updateExpressionParts = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    for (const key in requestBody) {
        if (key !== "proyectoId") {
            const attributeName = `#${key}`;
            updateExpressionParts.push(`${attributeName} = :${key}`);
            expressionAttributeNames[attributeName] = key;
            expressionAttributeValues[`:${key}`] = requestBody[key];
        }
    }
    return {
        updateExpression: `SET ${updateExpressionParts.join(", ")}`,
        expressionAttributeValues: expressionAttributeValues,
        expressionAttributeNames: expressionAttributeNames 
    };
}