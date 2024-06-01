import { NextApiRequest, NextApiResponse } from "next/types";

export function getTokenFromRequest(req: any) {
    return req.cookies.token || '';
}

// export function checkTokenMiddleware(req: NextApiRequest, res: NextApiResponse) {
//     return async (req: any, res: any) => {
//         const token = getTokenFromRequest(req);
//         // Kiểm tra xem token có tồn tại không, nếu không, chuyển hướng đến trang login
//         if (!token) {
//             res.writeHead(302, { Location: '/login' });
//             res.end();
//             return;
//         }
//         // Pass token to handler
//         req.token = token;
       
//     };
// }