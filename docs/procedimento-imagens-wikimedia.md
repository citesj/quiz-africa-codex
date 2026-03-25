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

## 7) Fluxo em lote para preencher créditos

Use `scripts/fill-country-image-credits.mjs` para processar múltiplos créditos de uma vez.

### Formato do arquivo de entrada

O arquivo deve conter um array JSON, com cada item no formato:

```json
{
  "countryId": "egito",
  "field": "imageUrl",
  "sourcePageUrl": "https://commons.wikimedia.org/wiki/File:Giza_Pyramid_Complex.jpg"
}
```

Exemplo pronto: `scripts/data/credits-input-egito.json`.

### Comando de execução em lote

```bash
node scripts/fill-country-image-credits.mjs --input scripts/data/credits-input-egito.json
```

Esse fluxo:

1. Processa cada item usando internamente a mesma lógica de geração de crédito do script unitário.
2. Ao final executa `scripts/validate-image-credits.mjs`.
3. Em caso de falha, imprime os erros de validação agrupados por `countryId:field`.

---

## Validação automatizada (opcional adotada no projeto)

Foi adicionado o script `scripts/validate-image-credits.mjs` para garantir que:

- toda imagem usada em `countryData.json` possui crédito correspondente em `imageCredits.json`;
- não há créditos duplicados por `countryId + field`;
- o `attributionText` segue o padrão obrigatório.
