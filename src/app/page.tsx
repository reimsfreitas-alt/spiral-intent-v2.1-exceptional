import fs from 'fs';
import path from 'path';

export default function Page(){
  const html=fs.readFileSync(path.join(process.cwd(),'index.html'),'utf8');
  const body=html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1]??html;
  return <main dangerouslySetInnerHTML={{__html:body}}/>;
}
