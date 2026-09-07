import crypto from 'node:crypto';
export function isAuthorized(req:Request):boolean{const expected=process.env.SPIRAL_API_TOKEN;if(!expected)return false;const header=req.headers.get('authorization')||'';const provided=header.startsWith('Bearer ')?header.slice(7):'';const a=Buffer.from(provided);const b=Buffer.from(expected);return a.length===b.length&&crypto.timingSafeEqual(a,b);}
