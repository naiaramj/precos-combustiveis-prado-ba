-- =====================================================
-- PROJETO: Preços de Combustíveis - Prado/BA
-- Consultas obrigatórias da AOP
-- =====================================================

USE combustiveis;

-- =====================================================
-- CONSULTA I
-- Menor e maior preço de cada tipo de combustível
-- =====================================================

WITH extremos AS (
    SELECT
        id_combustivel,
        MIN(valor) AS menor_preco,
        MAX(valor) AS maior_preco
    FROM coleta_preco
    GROUP BY id_combustivel
)

SELECT
    CASE
        WHEN cp.valor = e.menor_preco THEN 'Menor preço'
        WHEN cp.valor = e.maior_preco THEN 'Maior preço'
    END AS classificacao,
    p.nome AS posto,
    CONCAT_WS(', ', p.logradouro, p.numero) AS endereco,
    p.bairro,
    c.tipo AS combustivel,
    cp.valor,
    MAX(cp.data_coleta) AS data_coleta
FROM coleta_preco cp
JOIN posto p
    ON cp.id_posto = p.id_posto
JOIN combustivel c
    ON cp.id_combustivel = c.id_combustivel
JOIN extremos e
    ON cp.id_combustivel = e.id_combustivel
WHERE cp.valor = e.menor_preco
   OR cp.valor = e.maior_preco
GROUP BY
    p.id_posto,
    p.nome,
    p.logradouro,
    p.numero,
    p.bairro,
    c.id_combustivel,
    c.tipo,
    cp.valor,
    classificacao
ORDER BY
    CASE c.tipo
        WHEN 'Gasolina Comum' THEN 1
        WHEN 'Gasolina Aditivada' THEN 2
        WHEN 'Etanol' THEN 3
        WHEN 'Diesel' THEN 4
    END,
    CASE
        WHEN classificacao = 'Menor preço' THEN 1
        WHEN classificacao = 'Maior preço' THEN 2
    END;


-- =====================================================
-- CONSULTA II
-- Preço médio e quantidade de amostras
-- para cada posto e combustível
-- =====================================================

SELECT
    p.nome AS posto,
    p.bairro,
    c.tipo AS combustivel,
    ROUND(AVG(cp.valor), 2) AS preco_medio,
    COUNT(*) AS quantidade_amostras
FROM coleta_preco cp
JOIN posto p
    ON cp.id_posto = p.id_posto
JOIN combustivel c
    ON cp.id_combustivel = c.id_combustivel
GROUP BY
    p.id_posto,
    p.nome,
    p.bairro,
    c.id_combustivel,
    c.tipo
ORDER BY
    p.id_posto,
    CASE c.tipo
        WHEN 'Gasolina Comum' THEN 1
        WHEN 'Gasolina Aditivada' THEN 2
        WHEN 'Etanol' THEN 3
        WHEN 'Diesel' THEN 4
    END;


-- =====================================================
-- CONSULTA III
-- Preço mais recente de cada combustível
-- em cada posto
-- =====================================================

WITH preco_recente AS (
    SELECT
        p.nome AS posto,
        p.bairro,
        c.tipo AS combustivel,
        cp.valor,
        cp.data_coleta,
        ROW_NUMBER() OVER (
            PARTITION BY p.id_posto, c.id_combustivel
            ORDER BY cp.data_coleta DESC
        ) AS ordem
    FROM coleta_preco cp
    JOIN posto p
        ON cp.id_posto = p.id_posto
    JOIN combustivel c
        ON cp.id_combustivel = c.id_combustivel
)

SELECT
    posto,
    bairro,
    combustivel,
    valor,
    data_coleta
FROM preco_recente
WHERE ordem = 1
ORDER BY
    posto,
    CASE combustivel
        WHEN 'Gasolina Comum' THEN 1
        WHEN 'Gasolina Aditivada' THEN 2
        WHEN 'Etanol' THEN 3
        WHEN 'Diesel' THEN 4
    END;


-- =====================================================
-- CONSULTA IV
-- Evolução do preço da Gasolina Comum
-- na Rede Dal (Posto Evangelista)
-- =====================================================

SELECT
    p.nome AS posto,
    p.bairro,
    c.tipo AS combustivel,
    cp.valor,
    cp.data_coleta
FROM coleta_preco cp
JOIN posto p
    ON cp.id_posto = p.id_posto
JOIN combustivel c
    ON cp.id_combustivel = c.id_combustivel
WHERE p.nome = 'Rede Dal (Posto Evangelista)'
  AND c.tipo = 'Gasolina Comum'
ORDER BY cp.data_coleta ASC;
