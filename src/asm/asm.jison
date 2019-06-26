/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

/* \n                                      return 'NL' */
\s+                                     /* skip whitespace */
"//".*                                  /* skip single line comment */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     /* skip multiline comment */
[0-9]+                                  return 'NUMBER'
"-"                                     return 'MINUS'
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
    : NUMBER COLON SYMBOL
        {$$ = { type: 'C_INS', store: parseInt($1, 10), store_symbol: null, jump: $3 }}
    | SYMBOL STORE SYMBOL MINUS SYMBOL COLON SYMBOL
        {$$ = { type: 'C_INS', store: $1, compute: $3 + $4 + $5, jump: $7 }}
    | SYMBOL STORE SYMBOL PLUS SYMBOL COLON SYMBOL
        {$$ = { type: 'C_INS', store: $1, compute: $3 + $4 + $5, jump: $7 }}
    | SYMBOL STORE SYMBOL COLON SYMBOL
        {$$ = { type: 'C_INS', store: $1, compute: $3, jump: $5 }}
    | SYMBOL COLON SYMBOL
        {$$ = { type: 'C_INS', store: null, store_symbol: $1, jump: $3 }}
    ;

ains
    : AT NUMBER
        {$$ = { type: 'A_INS', symbol: null, value: parseInt($2, 10) }}
    | AT SYMBOL
        {$$ = { type: 'A_INS', symbol: $2, value: null }}
    ;