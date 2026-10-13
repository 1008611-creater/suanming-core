/** API-only production listener. Nginx is the sole trusted loopback caller. */
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {careerConfig,createCareerHandler} from './service.mjs';
export const CAREER_PUBLIC_ORIGIN='https://suanming.cauai.fun';
export function createCareerApiServer({career,fetchImpl=fetch}={}){
 const handler=createCareerHandler(career,{publicOrigin:CAREER_PUBLIC_ORIGIN,fetchImpl});
 const server=createServer(async(req,res)=>{
  if(await handler(req,res))return;
  res.writeHead(404,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify({error:'没有这个咨询入口。'}));
 });
 server.requestTimeout=45000;server.headersTimeout=15000;server.keepAliveTimeout=5000;server.maxHeadersCount=30;
 return server;
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 try{
  if(!process.env.CREDENTIALS_DIRECTORY)throw Error('System credential missing.');
  const apiKey=readFileSync(resolve(process.env.CREDENTIALS_DIRECTORY,'mcgrox-api-key'),'utf8');
  const career=careerConfig({MCGROX_API_KEY:apiKey,MCGROX_BASE_URL:'https://www.mcgrox.top',MCGROX_TEXT_API_MODE:'anthropic'},true);
  const server=createCareerApiServer({career});
  server.on('error',()=>{console.error('职业AI后台无法启动。');process.exitCode=1;});
  server.listen(8140,'127.0.0.1',()=>console.log('职业AI后台已就绪（仅本机代理可访问）。'));
  for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>{server.close(()=>process.exit(0));const timer=setTimeout(()=>server.closeAllConnections(),8000);timer.unref();});
 }catch{console.error('职业AI后台配置无效，请检查专用凭据。');process.exitCode=1;}
}
