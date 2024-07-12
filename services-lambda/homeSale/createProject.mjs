import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event, context) => {
    try {
        const project = JSON.parse(event.body);
        const { name, type, description, date_start, date_end, responsible, state, resourcesToday, resourcesLimit } = project;
        
        // Calcular el porcentaje de resourcesToday respecto a resourcesLimit
        const percentageResources = (resourcesToday / resourcesLimit) * 100;
        
        const newProject = {
            ...project,
            percentageResources
        };
        await ddbDocClient.send(new PutCommand({
            TableName: "Proyectos",
            Item: newProject,
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Se ha creado exitosamente el proyecto' }),
        };
    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};