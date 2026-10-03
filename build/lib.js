function parseSeries(s){return s.trim().split(/\s+/).map(kv=>{const [y,m]=kv.split(":");return [+y,+m]});}
function valueAt(ser,y){
  if(y<ser[0][0])return 0;
  const last=ser[ser.length-1];
  if(y>=last[0])return last[1];
  for(let i=0;i<ser.length-1;i++){
    const [y0,m0]=ser[i],[y1,m1]=ser[i+1];
    if(y>=y0&&y<y1){
      if(y1===y0)return m1;
      const t=(y-y0)/(y1-y0);
      if(m0>0&&m1>0)return m0*Math.pow(m1/m0,t);
      return m0+(m1-m0)*t;
    }
  }
  return 0;
}
module.exports={parseSeries,valueAt};
