import { handler } from "../src/services/user";

// successful signup

handler({
    pathParameters: { proxy: "users/signup" },
    body: JSON.stringify({
        name: "test",
        surname: "test",
        email: "test@gmail.com",
        password: "test",
    }),
} as any, {} as any).then((result) => {
    console.log("Signup Result:", result);
});


// successful login 
// handler({
//     pathParameters: { proxy: "users/login" },
//     body: JSON.stringify({
//         email: "test@gmail.com",
//         password: "testpassword",
//     }),
// } as any, {} as any).then((result) => {
//     console.log("Login Result:", result);
// });