function passOne(code) {
    //reutrns symbol table
    //no empty lines no more trimming

    code = code.replace(/<br\s*[\/]?>/gi, "\n");
    symbolTable = {};
    externals = [];
    globals = [];
    code = code.split('\n');
    var pass1Code = "";
    //compute symbol table
    var pc = 0;
    for(var i=0; i < code.length; i++) {
        //not empty
        line = code[i];
        if(!(line === "")) {
            var inst = line.split(' ')[0];
            var args = line.split(' ')[1];
            //if label add to symbol table
            if(mt = line.match(reLabel)) {
                symbolTable[mt[1]] = pc;
                inst = mt[2].trim().split(' ')[0];
            }
            //increment pc by size of instruction
            
            console.log(inst);
            if(instructions[inst]) {
                pc = pc + instructions[inst].size;
            }
            else if(directives[inst]) {
                pc = pc + directives[inst].size(args);
            }
            else {
                console.log('Error: Invalid instruction ' + inst);
            }

            //if external add to externals
            
            //if global add to globals
            if(inst==='EXTERN') {
                externals.push(args.trim());
                continue;
            }
            if(inst==='GLOBAL') {
                globals.push(args.trim());
                continue;
            }
            if(mt = line.match(reLabel)) {
                line = mt[2];
            }
            pass1Code += line +"\n";
        }

        
        
    }

    return {
        code: pass1Code,
        symbolTable: symbolTable,
        externals: externals,
        globals: globals
    };


}

function passTwo(code, symbolTable) {
    //split into lines
    code = code.split('\n');
    //iterate over lines
    newCode = [];
    for(var i=0; i < code.length; i++) {
        var line = code[i].trim();
        //remove empty lines
        if(!(line==="")) {
            var inst = line.split(' ')[0];
            var args = line.split(' ')[1];
            

            //handle directives
            if(directives[inst]) {
                newCode.push.apply(newCode, directives[inst].replace(args));
            }
            //if label definition remove
            else if(mt = line.match(reLabel)) {
                //remove label
                newCode.push(mt[2].trim());
                
            }
            else {
                newLine = line;
                //replace labels
                if(typeof(symbolTable[args]) != "undefined") {
                    var newLine =  inst +' ' + '*('+symbolTable[args]+')';
                }
                //push to new code
                newCode.push(newLine);
            }

        }
    }

    var newString = "";
    for(var i=0; i < newCode.length; i++) {
        newString += newCode[i] + '\n';
    }

    //return
    return newString;

}