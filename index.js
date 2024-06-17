const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function extrairTitulosYoutube(links) {
    const titulos = [];
    for (const link of links) {
        try {
            const response = await axios.get(link);
            const $ = cheerio.load(response.data);
            const titulo = $('title').text();
            titulos.push(titulo);
        } catch (error) {
            console.error(`Erro ao extrair título do link ${link}: ${error}`);
        }
    }
    return titulos;
}

async function lerLinksDoArquivo(caminhoArquivo) {
    try {
        const data = fs.readFileSync(caminhoArquivo, 'utf8');
        const links = data.trim().split('\n');
        return links;
    } catch (error) {
        console.error('Erro ao ler arquivo:', error);
        return [];
    }
}

async function salvarResultadoEmArquivo(titulos, caminhoArquivo) {
    try {
        // Ordenar os títulos em ordem alfabética
        titulos.sort();
        const conteudo = titulos.join('\n');
        fs.writeFileSync(caminhoArquivo, conteudo);
        console.log(`Resultados salvos em ${caminhoArquivo}`);
    } catch (error) {
        console.error('Erro ao salvar arquivo:', error);
    }
}

const caminhoArquivoEntrada = 'links.txt';
const caminhoArquivoSaida = 'titulos_ordenados.txt';

lerLinksDoArquivo(caminhoArquivoEntrada)
    .then(links => {
        return extrairTitulosYoutube(links);
    })
    .then(titulos => {
        return salvarResultadoEmArquivo(titulos, caminhoArquivoSaida);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
