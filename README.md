# visanet(Perú) en Express

Ejemplo de implementacion de visanet en nodejs/express

Intalación
---

``` bash
npm i
```

Ejecución

cambiar los valores de las llaves en routes/index.js linea 5

``` js
const visa = new VisaNet({
  user: '---',
  password: '---',
  merchantId: '--',
  env: 'dev',
});
```

Iniciar express

``` bash
npm start
```
