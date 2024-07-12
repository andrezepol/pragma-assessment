import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event, context) => {

        const body = JSON.parse(event.body);
        const { projectId , apartmentId } = body.data;
        const identifier = `${projectId}${apartmentId}`;    
    if (!projectId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'No ha ingresado ningún ID de proyecto' })
        };
      }
    const params = {
            TableName: 'Apartamentos',
            Key: {  
                'proyectoId': identifier
            }
        };
    try {
        
      const consultation = await ddbDocClient.send(new GetCommand(params));
      if(consultation.Item){
      return {
         statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(consultation.Item)
        };
        
        } else {
            return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Verificar datos ingresados' })
          };
        }
    }
   catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving project1', error: identifier })
    };
  }
};