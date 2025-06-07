# burnwatch

# 🔥 Burn Watch - FIRMS Fire Data Viewer

https://burn-watch.netlify.app

Este projeto é um **experimento interativo** feito com React e Leaflet para visualização dos focos de calor detectados pelos sensores **MODIS** e **VIIRS (S-NPP, NOAA-20, NOAA-21)**, usando dados da plataforma FIRMS (NASA) consumidos via API.

O objetivo aqui foi **explorar a integração entre React, Leaflet e APIs públicas de monitoramento por satélite**.

---

## Funcionalidades

- Exibe os focos de calor mais recentes (últimos dias)
- Filtra os focos que estão **dentro de uma área geográfica específica (ROI)** definida por um arquivo GeoJSON
- Ícones personalizados para cada tipo de sensor (MODIS, VIIRS)
- Ajuste automático de zoom com base na área da ROI
- Legenda explicativa com os sensores utilizados

---

## Aviso

> Este projeto é **experimental** e foi desenvolvido apenas com fins exploratórios.  

---

## Como rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/burnwatch.git
cd burnwatch
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Adicionar chave da API FIRMS

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo. Você pode obter sua chave gratuita em: https://firms.modaps.eosdis.nasa.gov/api/

```bash
REACT_APP_FIRMS_KEY=sua_chave_firms_aqui
```

### Rodar o projeto localmente

```bash
npm start
```

## Deploy (Netlify)

Este app pode ser facilmente hospedado no Netlify.
Certificando-se de adicionar a variável REACT_APP_FIRMS_KEY no painel Site Settings > Environment Variables.