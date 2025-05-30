export type Block = "function"|"procedure"|"class"|"if"|"elif"|"else"|"for"|"while"|"do"|"try"|"catch"|"finally";
export interface ParseResult { converted:string; block:Frame|null }
interface Frame { type:Block; ident?:string }
interface State { ind:number[]; stack:Frame[]; out:string[]; decl:Set<string> }

const TAB=3, ARW="←", OP={EQ:"=",NE:"<>",LE:"<=",GE:">=",AND:"AND",OR:"OR",NOT:"NOT",DIV:"DIV",MOD:"MOD",POW:"^"}, CMP=[["+=","+"],["-=","-"],["*=","*"],["/=","/"],["%=",OP.MOD]] as const;

export class Java2IG {
  private st!:State;

  parse(src:string):string {
    if(!src.trim()) return "";
    this.init(); const lines=src.split(/\r?\n/);
    this.collect(lines); lines.forEach(l=>this.handle(l)); this.closeAll();
    return this.st.out.join("\n");
  }

  private init(){ this.st={ind:[0],stack:[],out:[],decl:new Set()} }
  private collect(lines:string[]){
    lines.forEach(l=>{
      const t=l.trim();
      // 拡張された型サポート
      const decl=t.match(/^(int|double|String|boolean|char|long|byte|float|short)\s+([A-Za-z_]\w*)/); 
      if(decl) this.st.decl.add(decl[2]);
      // 配列宣言のサポート
      const arrDecl=t.match(/^(int|double|String|boolean|char|long|byte|float|short)\[\]\s+([A-Za-z_]\w*)/); 
      if(arrDecl) this.st.decl.add(arrDecl[2]);
      // final変数のサポート
      const finalDecl=t.match(/^final\s+(int|double|String|boolean|char|long|byte|float|short)\s+([A-Za-z_]\w*)/); 
      if(finalDecl) this.st.decl.add(finalDecl[2]);
      // 複数変数宣言のサポート
      const multiDecl=t.match(/^(int|double|String|boolean|char|long|byte|float|short)\s+([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)/); 
      if(multiDecl) {
        multiDecl[2].split(',').forEach(v => this.st.decl.add(v.trim()));
      }
      const forVar=t.match(/^for\s*\(.*?(int|double|String|boolean|char|long|byte|float|short)\s+([A-Za-z_]\w*)/);
      if(forVar) this.st.decl.add(forVar[2]);
    });
    if(this.st.decl.size){
      this.st.out.push("// DECLARE (default INTEGER)");
      [...this.st.decl].sort().forEach(v=>this.st.out.push(`DECLARE ${v} : INTEGER`));
      this.st.out.push("");
    }
  }

  private handle(raw:string){
    const txt=raw.trim();
    if(!txt){ this.st.out.push(""); return }
    if(txt.startsWith("//")){ this.st.out.push(raw); return }
    // 閉じ括弧の処理
    if(txt === '}') { this.st.out.push(""); return }

    const ind=this.leading(raw);
    while(this.st.ind.length>1 && ind<this.st.ind.at(-1)!) this.popBlock();
    if(ind>this.st.ind.at(-1)!) this.st.ind.push(ind);

    const pad=" ".repeat((this.st.ind.length-1)*TAB);
    const res=this.convert(txt,pad);
    this.st.out.push(res.converted);
    if(res.block) this.st.stack.push(res.block);
  }

  private popBlock(){
    this.st.ind.pop(); const f=this.st.stack.pop()!;
    const pad=" ".repeat((this.st.ind.length-1)*TAB);
    const end={function:"ENDFUNCTION",procedure:"ENDPROCEDURE",class:"ENDCLASS",if:"ENDIF",elif:"ENDIF",else:"ENDIF",for:`NEXT ${f.ident??""}`.trim(),while:"ENDWHILE",do:"UNTIL <condition>",try:"ENDTRY",catch:"ENDTRY",finally:"ENDTRY"}[f.type];
    this.st.out.push(pad+end);
  }
  private closeAll(){ while(this.st.stack.length) this.popBlock() }

  private convert(s:string,i:string):ParseResult {
    const chain=[this.cls,this.method,this.varDecl,this.arrDecl,this.arrInit,this.ifBlk,this.elifBlk,this.elseBlk,this.forCount,this.forEach,this.whileBlk,this.doBlk,this.tryBlk,this.catchBlk,this.finallyBlk,this.returnStmt,this.printStmt,this.inputStmt,this.mathFunc,this.compAssign,this.assign];
    for(const fn of chain){const r=fn.call(this,s,i); if(r.converted!==s) return r}
    return {converted:`${i}// TODO ${s}`,block:null};
  }

  // 既存メソッド（修正版）
  private cls(s:string,i:string){const m=s.match(/^(public\s+)?class\s+(\w+)/);return m?{converted:`${i}CLASS ${m[2]}`,block:{type:"class" as Block}}:{converted:s,block:null}}
  private method(s:string,i:string){const m=s.match(/^(public|private)?\s*(static)?\s*(void|int|double|boolean|String|char|long|byte|float|short)\s+(\w+)\(([^)]*)\)\s*\{/);return m?{converted:`${i}PROCEDURE ${m[4]}(${m[5]})`,block:{type:"function" as Block}}:{converted:s,block:null}}
  
  // 新規追加メソッド
  private varDecl(s:string,i:string){
    const m=s.match(/^(final\s+)?(int|double|String|boolean|char|long|byte|float|short)\s+([A-Za-z_]\w*)\s*=\s*([^;]+);/);
    if(m) return {converted:`${i}${m[3]} ${ARW} ${m[4]}`,block:null};
    const multiM=s.match(/^(final\s+)?(int|double|String|boolean|char|long|byte|float|short)\s+([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*);/);
    if(multiM) {
      const vars=multiM[3].split(',').map(v=>v.trim()).join(', ');
      return {converted:`${i}// DECLARE ${vars}`,block:null};
    }
    return {converted:s,block:null};
  }
  
  private arrDecl(s:string,i:string){
    const m=s.match(/^(int|double|String|boolean|char|long|byte|float|short)\[\]\s+([A-Za-z_]\w*)\s*=\s*new\s+\1\[(\d+)\];/);
    if(m) return {converted:`${i}DECLARE ${m[2]} : ARRAY[1:${m[3]}] OF INTEGER`,block:null};
    return {converted:s,block:null};
  }
  
  private arrInit(s:string,i:string){
    const m=s.match(/^(int|double|String|boolean|char|long|byte|float|short)\[\]\s+([A-Za-z_]\w*)\s*=\s*\{([^}]+)\};/);
    if(m) {
      const values=m[3].split(',').map(v=>v.trim()).join(', ');
      return {converted:`${i}${m[2]} ${ARW} [${values}]`,block:null};
    }
    return {converted:s,block:null};
  }
  
  private tryBlk(s:string,i:string){return/^try\s*\{/.test(s)?{converted:`${i}TRY`,block:{type:"try" as Block}}:{converted:s,block:null}}
  private catchBlk(s:string,i:string){const m=s.match(/^catch\s*\(([^)]*)\)\s*\{/);return m?{converted:`${i}CATCH ${m[1]}`,block:{type:"catch" as Block}}:{converted:s,block:null}}
  private finallyBlk(s:string,i:string){return/^finally\s*\{/.test(s)?{converted:`${i}FINALLY`,block:{type:"finally" as Block}}:{converted:s,block:null}}
  
  private mathFunc(s:string,i:string){
    let result=s;
    result=result.replace(/Math\.abs\(([^)]+)\)/g,'ABS($1)');
    result=result.replace(/Math\.sqrt\(([^)]+)\)/g,'SQRT($1)');
    result=result.replace(/Math\.pow\(([^,]+),\s*([^)]+)\)/g,'$1 ^ $2');
    result=result.replace(/Math\.max\(([^,]+),\s*([^)]+)\)/g,'MAX($1, $2)');
    result=result.replace(/Math\.min\(([^,]+),\s*([^)]+)\)/g,'MIN($1, $2)');
    result=result.replace(/Math\.random\(\)/g,'RANDOM()');
    return result!==s?{converted:`${i}${result}`,block:null}:{converted:s,block:null};
  }
  
  // 既存メソッド（そのまま）
  private ifBlk(s:string,i:string){const m=s.match(/^if\s*\((.+)\)\s*\{/);return m?{converted:`${i}IF ${this.cond(m[1])} THEN`,block:{type:"if" as Block}}:{converted:s,block:null}}
  private elifBlk(s:string,i:string){const m=s.match(/^else if\s*\((.+)\)\s*\{/);return m?{converted:`${i}ELSE IF ${this.cond(m[1])} THEN`,block:{type:"elif" as Block}}:{converted:s,block:null}}
  private elseBlk(s:string,i:string){return/^else\s*\{/.test(s)?{converted:`${i}ELSE`,block:{type:"else" as Block}}:{converted:s,block:null}}
  private forCount(s:string,i:string){const m=s.match(/^for\s*\((int|double|String|boolean|char|long|byte|float|short)\s+(\w+)\s*=\s*(\d+)\s*;\s*\2\s*<\s*(\d+)\s*;\s*\2\+\+\)\s*\{/);if(!m)return{converted:s,block:null};return{converted:`${i}FOR ${m[2]} ${ARW} ${m[3]} TO ${(+m[4])-1}`,block:{type:"for" as Block,ident:m[2]}}}
  private forEach(s:string,i:string){const m=s.match(/^for\s*\((\w+)\s*:\s*(\w+)\)\s*\{/);return m?{converted:`${i}FOR EACH ${m[1]} IN ${m[2]}`,block:{type:"for" as Block,ident:m[1]}}:{converted:s,block:null}}
  private whileBlk(s:string,i:string){const m=s.match(/^while\s*\((.+)\)\s*\{/);return m?{converted:`${i}WHILE ${this.cond(m[1])} DO`,block:{type:"while" as Block}}:{converted:s,block:null}}
  private doBlk(s:string,i:string){return/^do\s*\{/.test(s)?{converted:`${i}REPEAT`,block:{type:"do" as Block}}:{converted:s,block:null}}
  private returnStmt(s:string,i:string){const m=s.match(/^return\s*(.*);/);return m?{converted:`${i}RETURN${m[1]?" "+m[1]:""}`,block:null}:{converted:s,block:null}}
  private printStmt(s:string,i:string){
    const m=s.match(/^System\.out\.println\((.*?)\);/);
    if(m) return {converted:`${i}OUTPUT ${m[1]}`,block:null};
    const printM=s.match(/^System\.out\.print\((.*?)\);/);
    if(printM) return {converted:`${i}OUTPUT ${printM[1]}`,block:null};
    return {converted:s,block:null};
  }
  private inputStmt(s:string,i:string){
    const m=s.match(/^(\w+)\s*=\s*sc\.(nextInt|nextDouble|nextLine|next|nextBoolean)\(\);/);
    if(m) return {converted:`${i}INPUT ${m[1]}`,block:null};
    return {converted:s,block:null};
  }
  private compAssign(s:string,i:string){for(const[q,sy]of CMP)if(s.includes(q)){const[l,r]=s.split(q);return{converted:`${i}${l.trim()} ${ARW} ${l.trim()} ${sy} ${r.replace(/;$/,'').trim()}`,block:null}}return{converted:s,block:null}}
  private assign(s:string,i:string){const m=s.match(/^([A-Za-z_]\w*)\s*=\s*([^=].*);/);return m?{converted:`${i}${m[1]} ${ARW} ${m[2].trim()}`,block:null}:{converted:s,block:null}}

  /* ▸ helpers */
  private cond(x:string){return x.replace(/==/g,OP.EQ).replace(/!=/g,OP.NE).replace(/<=/g,OP.LE).replace(/>=/g,OP.GE).replace(/&&/g,` ${OP.AND} `).replace(/\|\|/g,` ${OP.OR} `).replace(/!([A-Za-z_\(])/g,`${OP.NOT} $1`).replace(/true/gi,"TRUE").replace(/false/gi,"FALSE").replace(/\bMath\.pow\(([^,]+),\s*([^\)]+)\)/g,"$1 ^ $2")}
  private leading(r:string){return r.match(/^(\s*)/)?.[1].length||0}
  private lastVar(s:string){const m=s.match(/(\w+)\+\+/);return m?m[1]:""}
}
