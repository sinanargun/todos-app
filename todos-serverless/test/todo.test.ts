
import { handler } from '../src/services/todo';

// create todo
// handler({
//     httpMethod: 'POST',
//     body: JSON.stringify({
//         text: 'This is a test todo',
//         due_date: '2023-10-01',
//     }),
// } as any, {
//     user_id: 'f97d9b92-c7e1-44c7-b09a-f7381d829d7c'
// } as any).then((response) => {
//     console.log('Create Todo Response:', response);
// }
// ).catch((error) => {
//     console.error('Error creating todo:', error);
// });

// get todos 
handler({
    httpMethod: 'GET',
    queryStringParameters: {
        status: 'TODO',
        limit: '10',
        offset: '0'
    }
} as any, {
    user_id: 'f97d9b92-c7e1-44c7-b09a-f7381d829d7c'
} as any).then((response) => {
    console.log('Get Todo Response:', response);
}
).catch((error) => {
    console.error('Error getting todo:', error);
});


//update todo
// handler({
//     httpMethod: 'PUT',
//     pathParameters: {
//         todoId: '438f21cf-b3fc-40fc-88c8-1c4e14af937e'
//     },
//     body: JSON.stringify({
//         text: 'This is an updated test todo',
//         due_date: '2025-10-01',
//         status: 'TODO'
//     }),
// } as any, {
//     user_id: 'f97d9b92-c7e1-44c7-b09a-f7381d829d7c'
// } as any).then((response) => {
//     console.log('Update Todo Response:', response);
// }
// ).catch((error) => {
//     console.error('Error updating todo:', error);
// })

// delete todo
// handler({
//     httpMethod: 'DELETE',
//     pathParameters: {
//         todoId: '438f21cf-b3fc-40fc-88c8-1c4e14af937e'
//     },
// } as any, {
//     user_id: 'f97d9b92-c7e1-44c7-b09a-f7381d829d7c'
// } as any).then((response) => {
//     console.log('Delete Todo Response:', response);
// }
// ).catch((error) => {
//     console.error('Error deleting todo:', error);
// });