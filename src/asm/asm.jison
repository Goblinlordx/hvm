/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

/* \n                                      return 'NL' */
\s+                                     /* skip whitespace */
"//".*                                  /* skip single line comment */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     /* skip multiline comment */
[admADM]"="                             return 'STORE'
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
[a-zA-Z]([a-zA-Z0-9])*                  return 'SYMBOL'
<<EOF>>                                 return 'EOF'
.                                       return 'INVALID'

/lex

/* operator associations and precedence */

%start program

%% /* language grammar */

program
    : instructions EOF
        {return $1;}
    ;

instructions
    : instructions instruction
        {$$ = $1.concat($2)}
    | instruction
        {$$ = [$1]}
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
    : STORE compute SYMBOL
        {$$ = { type: 'C_INS', store: $1.slice(0, -1), compute: $2, jump: $3 }}
    | compute SYMBOL
        {$$ = { type: 'C_INS', compute: $1, jump: $2 }}
    ;

compute
    : NOT SYMBOL COLON
        {$$ = $1 + $2}
    | SYMBOL MINUS SYMBOL COLON
        {$$ = $1 + $2 + $3}
    | SYMBOL MINUS NUMBER COLON
        {$$ = $1 + $2 + $3}
    | SYMBOL PLUS SYMBOL COLON
        {$$ = $1 + $2 + $3}
    | SYMBOL PLUS NUMBER COLON
        {$$ = $1 + $2 + $3}
    | SYMBOL COLON
        {$$ = $1}
    | MINUS NUMBER COLON
        {$$ = $1 + $2}
    | NUMBER COLON
        {$$ = $1}
    ;

ains
    : AT NUMBER
        {$$ = { type: 'A_INS', symbol: null, value: parseInt($2, 10) }}
    | AT SYMBOL
        {$$ = { type: 'A_INS', symbol: $2, value: null }}
    ;