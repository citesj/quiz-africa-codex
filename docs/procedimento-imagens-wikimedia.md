# Procedimento interno para novas imagens (Wikimedia Commons)

Este procedimento deve ser seguido **sempre que uma nova imagem for adicionada** ao projeto.

## 1) Selecionar arquivo no Wikimedia Commons

1. Acesse o Wikimedia Commons e localize um arquivo adequado ao contexto (país/tema).
2. Verifique se a página do arquivo contém:
   - autor(a),
   - título,
   - licença,
   - link permanente da página do arquivo,
   - URL do arquivo original.
3. Confirme se a licença permite o uso no projeto (incluindo redistribuição).
4. Se você tiver apenas o link da imagem no Wikipedia (ex.: `pt.wikipedia.org/wiki/Ficheiro:...`), ele também pode ser usado no script de geração: o processo converte automaticamente para a página equivalente no Commons.

## 2) Baixar arquivo em resolução adequada

1. Defina o tamanho-alvo para uso no app (ex.: 900x600 para imagens de conteúdo).
2. Baixe a versão mais apropriada (evitando arquivos desnecessariamente pesados).
3. Se necessário, gere uma versão otimizada mantendo proporção e qualidade.

## 3) Registrar metadados completos

No `src/data/imageCredits.json`, adicione uma entrada com os campos:

- `countryId`
- `field` (ex.: `imageUrl`, `landmarkImageUrl`, etc.)
- `imageUrl`
- `author`
- `title`
- `license`
- `sourcePageUrl` (página do arquivo no Commons)
- `originalFileUrl` (URL direta do arquivo)
- `lastModified` (formato `YYYY-MM-DD`)
- `attributionText`

## 4) Gerar `attributionText` padronizado

Formato obrigatório:

`{title} — {author}. Licença: {license}. Fonte: {sourcePageUrl}`

Exemplo:

`Victoria Falls (aerial view) — John Doe. Licença: CC BY-SA 4.0. Fonte: https://commons.wikimedia.org/wiki/File:Victoria_Falls.jpg`

## 5) Salvar arquivo no diretório do país

Quando a imagem for local (não remota), use a convenção:

`public/images/countries/<countryId>/<tipo>.jpg`

Exemplos:

- `public/images/countries/egito/cover.jpg`
- `public/images/countries/egito/landmark.jpg`

## 6) Referenciar ativo e crédito no dataset

1. Atualize `src/data/countryData.json` no país e campo corretos (`imageUrl`, `capitalImageUrl`, etc.).
2. Garanta que existe entrada correspondente em `src/data/imageCredits.json` com `countryId + field`.
3. Execute validação:

```bash
npm run validate:image-credits
```

Se houver erro, corrija antes de commitar.

## 7) Geração em lote de créditos (opcional)

Para acelerar o cadastro de créditos por país, use o script:

```bash
node scripts/generate-image-credit.mjs --input caminho/do/arquivo.json
```

Formato esperado do arquivo de entrada:

```json
{
  "countryId": "egito",
  "items": [
    {
      "field": "flagImageUrl",
      "sourcePageUrl": "https://commons.wikimedia.org/wiki/File:Flag_of_Egypt.svg"
    },
    {
      "field": "capitalImageUrl",
      "sourcePageUrl": "https://commons.wikimedia.org/wiki/File:Cairo_Skyline_(2020).jpg"
    }
  ]
}
```

Regras:

- `countryId` obrigatório no nível raiz;
- `items` deve ser array não vazio;
- cada item deve ter `field` e `sourcePageUrl`.
- `sourcePageUrl` pode ser de `commons.wikimedia.org/wiki/File:...` **ou** de algum domínio do Wikipedia (`...wikipedia.org/wiki/Ficheiro:...`, `.../wiki/File:...`, etc.).

O script busca metadados no Wikimedia Commons, faz upsert em `imageCredits.json` por `countryId + field` e prioriza o `imageUrl` já existente em `countryData.json` para manter consistência com a validação.

---

## Validação automatizada (opcional adotada no projeto)

Foi adicionado o script `scripts/validate-image-credits.mjs` para garantir que:

- toda imagem usada em `countryData.json` possui crédito correspondente em `imageCredits.json`;
- não há créditos duplicados por `countryId + field`;
- o `attributionText` segue o padrão obrigatório.
