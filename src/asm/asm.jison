/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\n                                      return 'NL';
"//".*\n                                return 'NL';
" "                                     /* skip whitespace */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     /* skip multiline comment */
[admADM]{1,3}"="                        return 'STORE'
[0-9]+                                  return 'NUMBER'
"-"                                     return 'MINUS'
"!"                                     return 'NOT'
"&"                                     return 'AND'
"|"                                     return 'OR'
"+"                                     return 'PLUS'
"="                                     return 'STORE'
"@"                                     return 'AT'
";"                                     return 'COLON'
"("                                     return 'PAREN_OPEN'
")"                                     return 'PAREN_CLOSE'
[a-zA-Z]([a-zA-Z0-9_])*                 return 'SYMBOL'
<<EOF>>                                 return 'EOF'
.                                       return 'INVALID'

/lex

/* operator associations and precedence */

%start program

%% /* language grammar */

program
    : instructions eof
        {return $1;}
    ;

eof
    : EOF
    | nl EOF
    ;

instructions
    : instructions nl instruction
        {$$ = $1.concat($3)}
    | nl instruction
        {$$ = [$2]}
    ;

instruction
    : ains
        {$$ = Object.assign($1, {loc: [@$.first_line, @$.first_column, @$.last_line, @$.last_column] });}
    | cins
        {$$ = Object.assign($1, {loc: [@$.first_line, @$.first_column, @$.last_line, @$.last_column] });}
    | label
        {$$ = Object.assign($1, {loc: [@$.first_line, @$.first_column, @$.last_line, @$.last_column] });}
    ;

label
    : PAREN_OPEN SYMBOL PAREN_CLOSE
        {$$ = { type: 'LABEL', symbol: $2 }}
    ;

cins
    : compute
        {$$ = { type: 'C_INS', compute: $1.toUpperCase() }}
    | compute jmp
        {$$ = { type: 'C_INS', compute: $1.toUpperCase(), jump: $2.toUpperCase() }}
    | STORE compute
        {$$ = { type: 'C_INS', store: $1.slice(0, -1).toUpperCase(), compute: $2.toUpperCase() }}
    | STORE compute jmp
        {$$ = { type: 'C_INS', store: $1.slice(0, -1).toUpperCase(), compute: $2.toUpperCase(), jump: $3.toUpperCase() }}
    ;

compute
    : NOT SYMBOL
        {$$ = $1 + $2}
    | SYMBOL
        {$$ = $1}
    | SYMBOL MINUS SYMBOL
        {$$ = $1 + $2 + $3}
    | SYMBOL MINUS NUMBER
        {$$ = $1 + $2 + $3}
    | SYMBOL PLUS SYMBOL
        {$$ = $1 + $2 + $3}
    | SYMBOL PLUS NUMBER
        {$$ = $1 + $2 + $3}
    | MINUS NUMBER
        {$$ = $1 + $2}
    | NUMBER
        {$$ = $1}
    ;

jmp
    : COLON SYMBOL
        {$$ = $2}
    ;

ains
    : AT NUMBER
        {$$ = { type: 'A_INS', symbol: null, value: parseInt($2, 10) }}
    | AT SYMBOL
        {$$ = { type: 'A_INS', symbol: $2, value: null }}
    ;

nl
    : nl NL
    | NL
    ;