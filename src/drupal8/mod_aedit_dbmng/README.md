# Modulo vuoto basato su Drupal8
## Configurato con DBMNG2 e Navigo

Per testare il funzionamento del modulo provare i seguenti link:

### Home del modulo:
```
http://localhost/agrestic/mod_aedit_dbmng
```

### Navigo:
```
http://localhost/agrestic/mod_aedit_dbmng#dbmng_test
```

### Esempio di API funzionanti sul modulo:
#### API DBMNG2:
```
http://localhost/agrestic/api_mod_aedit_dbmng/api/dbmng_tables/
```

#### API proprie del modulo:
```
http://localhost/agrestic/api_mod_aedit_dbmng/ciao

{
  "ok":true,
  "message":"Ciao"
}
```

```
http://localhost/agrestic/api_mod_aedit_dbmng/aaa/bbb

{
  "ok":true,
  "message":"Ok.Funziona",
  "aUri":["","agrestic","api_mod_aedit_dbmng","aaa","bbb"],
  "root":"\/agrestic\/"
}
```
