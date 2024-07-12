export const handler = async (event, context) => {
    const body = JSON.parse(event.body);
    const percentage = body.percentage;
    const value = body.value;
        
   function calculateComission(value, percentage){
          if(percentage >= 1){
            percentage = percentage/100;
          }
          const commission = value * percentage; 
          return commission;
        }
        
   try {
        const responseBody = {
          success: true,
          commission: calculateComission(value, percentage)
        };
        
        return {
          statusCode: 200,
          headers:{
            "Content-Type":"application/jason",
            "accept": "application/json"
          },
          body: JSON.stringify(responseBody),
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