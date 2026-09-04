const SOURCE='https://spiral-intent-independent-execution-assurance-29h9zo.v2.appdeploy.ai/resources/spiral_intent_condensed_10s(2).mp4';

export default async function handler(req,res){
  try{
    const headers={};
    if(req.headers.range) headers.Range=req.headers.range;
    const upstream=await fetch(SOURCE,{headers});
    res.statusCode=upstream.status;
    const forward=['content-type','content-length','content-range','accept-ranges'];
    for(const h of forward){const v=upstream.headers.get(h);if(v)res.setHeader(h,v)}
    res.setHeader('Cache-Control','public,max-age=31536000,immutable');
    if(!upstream.body)return res.end();
    for await(const chunk of upstream.body)res.write(chunk);
    return res.end();
  }catch(e){
    return res.status(502).send('video unavailable');
  }
}
