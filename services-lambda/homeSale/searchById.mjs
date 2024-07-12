import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event) => {
    const  { projectId } = event.queryStringParameters;

    if (!projectId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'No ha ingresado ningún ID de proyecto' })
        };
      }

    try {
        const info = await ddbDocClient.send(new GetCommand({
            TableName: 'Proyectos',
            Key: { 'projectId': Number(projectId) }
        }));
        
      if(info.Item){
      return {
         statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(info.Item)
        };
        
        } else {
            return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Proyecto no encontrado' })
          };
        }
    }
   catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving project', error: error.message })
    };
  }
};