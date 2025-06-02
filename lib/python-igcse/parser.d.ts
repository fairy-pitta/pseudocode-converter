export declare class IGCSEPseudocodeParser {
    private state;
    parse(sourceCode: string): string;
    private initializeState;
    private collectDeclarations;
    private prescanDictionaryFields;
    private processLine;
    private closeBlocksForIndentation;
    private closeCurrentBlock;
    private getCloseKeyword;
    private inferReturnType;
    private finalizeFunctionDefinition;
    private closeRemainingBlocks;
    private convertLine;
}
