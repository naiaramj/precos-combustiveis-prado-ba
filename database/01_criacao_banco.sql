-- =========================================
-- AOP2 - PROJETO FÍSICO
-- BANCO DE DADOS: COMBUSTÍVEIS
-- SGBD: MySQL
-- =========================================

CREATE DATABASE combustiveis
CHARACTER SET utf8mb4;

USE combustiveis;


-- =========================================
-- TABELA POSTO
-- =========================================

CREATE TABLE posto (
    id_posto INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    logradouro VARCHAR(120) NOT NULL,
    numero VARCHAR(20),
    bairro VARCHAR(80) NOT NULL,
    cep CHAR(8) NOT NULL,

    CONSTRAINT pk_posto
        PRIMARY KEY (id_posto)
);


-- =========================================
-- TABELA COMBUSTIVEL
-- =========================================

CREATE TABLE combustivel (
    id_combustivel INT AUTO_INCREMENT,
    tipo VARCHAR(30) NOT NULL,

    CONSTRAINT pk_combustivel
        PRIMARY KEY (id_combustivel),

    CONSTRAINT uq_combustivel_tipo
        UNIQUE (tipo),

    CONSTRAINT chk_combustivel_tipo
        CHECK (
            tipo IN (
                'Gasolina Comum',
                'Gasolina Aditivada',
                'Etanol',
                'Diesel'
            )
        )
);


-- =========================================
-- TABELA TELEFONE_POSTO
-- =========================================

CREATE TABLE telefone_posto (
    id_posto INT NOT NULL,
    telefone VARCHAR(20) NOT NULL,

    CONSTRAINT pk_telefone_posto
        PRIMARY KEY (id_posto, telefone),

    CONSTRAINT fk_telefone_posto
        FOREIGN KEY (id_posto)
        REFERENCES posto(id_posto)
);


-- =========================================
-- TABELA COLETA_PRECO
-- =========================================

CREATE TABLE coleta_preco (
    id_coleta INT AUTO_INCREMENT,
    id_posto INT NOT NULL,
    id_combustivel INT NOT NULL,
    data_coleta DATE NOT NULL,
    valor DECIMAL(6,2) NOT NULL,

    CONSTRAINT pk_coleta_preco
        PRIMARY KEY (id_coleta),

    CONSTRAINT fk_coleta_posto
        FOREIGN KEY (id_posto)
        REFERENCES posto(id_posto),

    CONSTRAINT fk_coleta_combustivel
        FOREIGN KEY (id_combustivel)
        REFERENCES combustivel(id_combustivel),

    CONSTRAINT uq_coleta_preco
        UNIQUE (
            id_posto,
            id_combustivel,
            data_coleta
        ),

    CONSTRAINT chk_valor
        CHECK (valor > 0)
);


-- =========================================
-- VERIFICAÇÃO DAS TABELAS CRIADAS
-- =========================================

SHOW TABLES;