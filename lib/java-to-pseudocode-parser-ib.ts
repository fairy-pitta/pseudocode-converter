export type Block = "function"|"class"|"if"|"elif"|"else"|"for"|"while"|"repeat"|"try"|"finally";
export interface ParseResult{code:string;block:Block|null}
interface Frame{type:Block;ident?:string}
interface St{ind:number[];stack:Frame[];out:string[]}

const IND=4,ARW="←",OP={EQ:"=",NE:"≠",LE:"≤",GE:"≥",AND:"AND",OR:"OR",NOT:"NOT",DIV:"div",MOD:"mod"},CMP=[["+=","+"],["-=","-"],["*=","*"],["/=","/"],["%=",OP.MOD]] as const;

export class Java2IB {
    private st!:St;
    
    parse(src:string){
        if(!src.trim())return"";
        this.st={ind:[0],stack:[],out:[]};
        src.split(/\r?\n/).forEach(l=>this.line(l));
        while(this.st.stack.length)this.end();
        return this.st.out.join("\n")
    }
    
    /* ─ helpers ─ */
    private ws(r:string){return r.match(/^(\s*)/)?.[1]||""}
    private ind(r:string){return this.ws(r).length}
    private push(b:Frame){this.st.stack.push(b)}
    private end(){
        this.st.ind.pop();
        const f=this.st.stack.pop();
        if(!f || !f.type) return;
        const pad=" ".repeat((this.st.ind.length-1)*IND);
        const end={function:"END FUNCTION",class:"END CLASS",if:"END IF",elif:"END IF",else:"END IF",for:"end loop",while:"END WHILE",repeat:"end loop",try:"END TRY",finally:"END TRY"}[f.type];
        this.st.out.push(pad+end)
    }
    
    /* ─ per‑line ─ */
    private line(raw:string){
        const t=raw.trim();
        if(!t){this.st.out.push("");return}
        if(t.startsWith("//")){this.st.out.push(raw);return}
        const cur=this.ind(raw);
        while(this.st.ind.length>1&&cur<this.st.ind.at(-1)!)this.end();
        if(cur>this.st.ind.at(-1)!)this.st.ind.push(cur);
        const pad=" ".repeat((this.st.ind.length-1)*IND);
        const r=this.conv(t,pad);
        this.st.out.push(r.code);
        if(r.block)this.push({type:r.block,ident:/for/.test(r.block)?this.lastVar(t):undefined})
    }
    
    /* ─ converters ─ */
    private conv(s:string,i:string):ParseResult{
        // Handle closing braces
        if(s === '}') return {code:'',block:null};
        
        const a=[this.cls,this.meth,this.ifb,this.elif,this.els,this.forCnt,this.forEach,this.whileb,this.dob,this.tryb,this.catchb,this.finallyb,this.ret,this.print,this.input,this.varDecl,this.arrayDecl,this.finalVarDecl,this.scannerInput,this.mathFunc,this.comp,this.asg];
        for(const f of a){
            const r=f.call(this,s,i);
            if(r.code!==s)return r
        }
        return{code:`${i}// TODO ${s}`,block:null}
    }
    
    private cls(s:string,i:string){
        const m=s.match(/^(public\s+)?class\s+(\w+)/);
        return m?{code:`${i}CLASS ${m[2]}`,block:"class" as Block}:{code:s,block:null}
    }
    
    private meth(s:string,i:string){
        const m=s.match(/^(public|private)?\s*(static)?\s*(void|int|double|boolean|String|long|byte|char|float)\s+(\w+)\(([^)]*)\)\s*\{/);
        return m?{code:`${i}FUNCTION ${m[4]}(${m[5]})`,block:"function" as Block}:{code:s,block:null}
    }
    
    private ifb(s:string,i:string){
        const m=s.match(/^if\s*\((.+)\)\s*\{/);
        return m?{code:`${i}IF ${this.cond(m[1])} THEN`,block:"if" as Block}:{code:s,block:null}
    }
    
    private elif(s:string,i:string){
        const m=s.match(/^else if\s*\((.+)\)\s*\{/);
        return m?{code:`${i}ELSE IF ${this.cond(m[1])} THEN`,block:"elif" as Block}:{code:s,block:null}
    }
    
    private els(s:string,i:string){
        return/^else\s*\{/.test(s)?{code:`${i}ELSE`,block:"else" as Block}:{code:s,block:null}
    }
    
    private forCnt(s:string,i:string){
        const m=s.match(/^for\s*\((int|long|byte)\s+(\w+)\s*=\s*(\d+)\s*;\s*\2\s*<\s*(\d+)\s*;\s*\2\+\+\)\s*\{/);
        if(!m)return{code:s,block:null};
        return{code:`${i}loop ${m[2]} from ${m[3]} to ${(+m[4])-1}`,block:"for" as Block}
    }
    
    private forEach(s:string,i:string){
        const m=s.match(/^for\s*\((\w+)\s*:\s*(\w+)\)\s*\{/);
        return m?{code:`${i}FOR EACH ${m[1]} IN ${m[2]}`,block:"for" as Block}:{code:s,block:null}
    }
    
    private whileb(s:string,i:string){
        const m=s.match(/^while\s*\((.+)\)\s*\{/);
        return m?{code:`${i}WHILE ${this.cond(m[1])} DO`,block:"while" as Block}:{code:s,block:null}
    }
    
    private dob(s:string,i:string){
        return/^do\s*\{/.test(s)?{code:`${i}REPEAT`,block:"repeat" as Block}:{code:s,block:null}
    }
    
    private tryb(s:string,i:string){
        return s==="try{"?{code:`${i}TRY`,block:"try" as Block}:{code:s,block:null}
    }
    
    private catchb(s:string,i:string){
        const m=s.match(/^catch\s*\(([^)]*)\)\s*\{/);
        return m?{code:`${i}CATCH ${m[1].split(" ").at(-1)}`,block:null}:{code:s,block:null}
    }
    
    private finallyb(s:string,i:string){
        return/^finally\s*\{/.test(s)?{code:`${i}FINALLY`,block:"finally" as Block}:{code:s,block:null}
    }
    
    private ret(s:string,i:string){
        const m=s.match(/^return\s*(.*);/);
        return m?{code:`${i}RETURN${m[1]?" "+m[1]:""}`,block:null}:{code:s,block:null}
    }
    
    private print(s:string,i:string){
        const m=s.match(/^System\.out\.println\((.*?)\);?$/);
        return m?{code:`${i}OUTPUT ${m[1]}`,block:null}:{code:s,block:null}
    }
    
    private input(s:string,i:string){
        const m=s.match(/^(\w+)\s*=\s*sc\.next.*?\(\);/);
        return m?{code:`${i}INPUT ${m[1]}`,block:null}:{code:s,block:null}
    }
    
    private varDecl(s:string,i:string){
        const m=s.match(/^(int|double|boolean|String|float|char|long|byte)\s+(\w+)\s*=\s*([^;]+);/);
        return m?{code:`${i}${m[2]} ${ARW} ${m[3]}`,block:null}:{code:s,block:null}
    }
    
    private arrayDecl(s:string,i:string){
        const m1=s.match(/^(int|double|boolean|String|float|char|long|byte)\[\]\s+(\w+)\s*=\s*\{([^}]*)\};/);
        if(m1)return{code:`${i}${m1[2]} ${ARW} [${m1[3]}]`,block:null};
        
        const m2=s.match(/^(int|double|boolean|String|float|char|long|byte)\[\]\s+(\w+)\s*=\s*new\s+\1\[(\d+)\];/);
        if(m2)return{code:`${i}${m2[2]} ${ARW} ARRAY[${m2[3]}] OF ${m2[1].toUpperCase()}`,block:null};
        
        return{code:s,block:null}
    }
    
    private finalVarDecl(s:string,i:string){
        const m=s.match(/^final\s+(int|double|boolean|String|float|char|long|byte)\s+(\w+)\s*=\s*([^;]+);/);
        return m?{code:`${i}CONSTANT ${m[2]} ${ARW} ${m[3]}`,block:null}:{code:s,block:null}
    }
    
    private scannerInput(s:string,i:string){
        const m=s.match(/^(\w+)\s*=\s*(\w+)\.(nextInt|nextDouble|nextLine|nextBoolean|nextFloat|nextLong|nextByte)\(\);/);
        if(m){
            const inputType={nextInt:"INTEGER",nextDouble:"REAL",nextLine:"STRING",nextBoolean:"BOOLEAN",nextFloat:"REAL",nextLong:"INTEGER",nextByte:"INTEGER"}[m[3]]||"";
            return{code:`${i}INPUT ${m[1]} // ${inputType}`,block:null}
        }
        return{code:s,block:null}
    }
    
    private mathFunc(s:string,i:string){
        let result=s;
        result=result.replace(/Math\.sqrt\(([^)]+)\)/g,'√($1)');
        result=result.replace(/Math\.max\(([^,]+),\s*([^)]+)\)/g,'MAX($1, $2)');
        result=result.replace(/Math\.min\(([^,]+),\s*([^)]+)\)/g,'MIN($1, $2)');
        result=result.replace(/Math\.abs\(([^)]+)\)/g,'ABS($1)');
        result=result.replace(/Math\.pow\(([^,]+),\s*([^)]+)\)/g,'$1 ^ $2');
        
        if(result!==s){
            const m=result.match(/^(\w+)\s*=\s*(.+);/);
            return m?{code:`${i}${m[1]} ${ARW} ${m[2]}`,block:null}:{code:`${i}${result}`,block:null}
        }
        return{code:s,block:null}
    }
    
    private comp(s:string,i:string){
        for(const[q,sy]of CMP)if(s.includes(q)){
            const[l,r]=s.split(q);
            return{code:`${i}${l.trim()} ${ARW} ${l.trim()} ${sy} ${r.replace(/;$/,"").trim()}`,block:null}
        }
        return{code:s,block:null}
    }
    
    private asg(s:string,i:string){
        const m=s.match(/^([A-Za-z_]\w*)\s*=\s*([^=].*);/);
        return m?{code:`${i}${m[1]} ${ARW} ${m[2].trim()}`,block:null}:{code:s,block:null}
    }
    
    /* ─ util ─ */
    private cond(x:string){
        return x.replace(/==/g,OP.EQ).replace(/!=/g,OP.NE).replace(/<=/g,OP.LE).replace(/>=/g,OP.GE).replace(/&&/g,` ${OP.AND} `).replace(/\|\|/g,` ${OP.OR} `).replace(/!([A-Za-z_\(])/g,`${OP.NOT} $1`).replace(/true/gi,"TRUE").replace(/false/gi,"FALSE").replace(/\bMath\.pow\(([^,]+),\s*([^\)]+)\)/g,"$1 ^ $2")
    }
    
    private lastVar(s:string){
        const m=s.match(/(\w+)\+\+/);
        return m?m[1]:""
    }
}
