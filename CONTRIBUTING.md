# Contribution

¡Gracias por contribuir a este proyecto! 

Antes de enviar cualquier pull request, asegúrate de seguir estas pautas:

# Project Settings

## Node Environment

- Asegúrate de usar `node@v18` o versiones posteriores a esta.
- Antes de configurar `EsLint` instala las dependencias del proyecto usando `npm install` o `pnpm install`

## Linter

- Asegúrate de que tu código sigue el estándar de lint especificado para el proyecto. Puedes encontrar las reglas en el archivo [`.eslintrc.cjs`](https://github.com/EDUJOS/tweet-cli-v2/blob/master/.eslintrc.cjs) o en el archivo `README.md`.

```js
module.exports = {
  'env': {
    'browser': false,
    'node': true,
    'es2021': true
  },
  'extends': 'eslint:recommended',
  'overrides': [
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'block-spacing': [
      'error',
      'always'
    ],
    'no-multi-spaces': [
      'error',
      {
        'ignoreEOLComments': false
      }
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 2
      }
    ],
    'no-trailing-spaces': [
      'error'
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  }
}
```

- Ejecuta las pruebas unitarias del proyecto para asegurarte de que tu contribución no rompa la funcionalidad existente. 

- Si tu pull request introduce nuevas características, asegúrate de que se han agregado las pruebas unitarias correspondientes.

- Asegúrate de que tu código se ha probado en diferentes plataformas o entornos, si es posible.

- Si has realizado cambios significativos, actualiza la documentación correspondiente.

## Docs

Para traducir la documentación a inglés solo tienes que seguir el mismo formato y contenido del archivo `README.md`


> Gracias por contribuir a este proyecto siguiendo estas pautas. ¡Estamos emocionados de ver lo que has creado!