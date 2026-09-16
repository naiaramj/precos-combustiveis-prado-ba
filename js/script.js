// ==========================================
// CARREGAMENTO DOS DADOS
// ==========================================

const arquivoDados = "dados/coletas.csv";

fetch(arquivoDados)
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error(
                `Não foi possível carregar ${arquivoDados}`
            );
        }

        return resposta.text();
    })

    .then(texto => {

        // ==========================================
        // LEITURA DO CSV
        // ==========================================

        const linhas = texto
            .trim()
            .split(/\r?\n/);

        linhas.shift();

        const coletas = linhas.map(linha => {

            const colunas = linha.match(
                /(".*?"|[^",]+)(?=\s*,|\s*$)/g
            );

            return {
                posto: colunas[0]
                    .replaceAll('"', '')
                    .trim(),

                bairro: colunas[1]
                    .replaceAll('"', '')
                    .trim(),

                logradouro: colunas[2]
                    .replaceAll('"', '')
                    .trim(),

                numero: colunas[3]
                    .replaceAll('"', '')
                    .trim(),

                combustivel: colunas[4]
                    .replaceAll('"', '')
                    .trim(),

                valor: Number(colunas[5]),

                data: colunas[6]
                    .replaceAll('"', '')
                    .trim()
            };
        });


        // ==========================================
        // FUNÇÕES AUXILIARES
        // ==========================================

        function formatarData(data) {
            const [ano, mes, dia] = data.split("-");

            return `${dia}/${mes}/${ano}`;
        }


        // Data usada SOMENTE nos gráficos.
        // No celular: 12/08
        // No desktop: 12/08/2026

        function formatarDataGrafico(data) {
            const [ano, mes, dia] = data.split("-");

            if (window.innerWidth <= 600) {
                return `${dia}/${mes}`;
            }

            return `${dia}/${mes}/${ano}`;
        }


        function formatarPreco(valor) {
            return `R$ ${valor
                .toFixed(2)
                .replace(".", ",")}`;
        }


        function formatarEndereco(registro) {
            if (registro.numero) {
                return `${registro.logradouro}, ${registro.numero}`;
            }

            return registro.logradouro;
        }


        const combustiveis = [
            "Gasolina Comum",
            "Gasolina Aditivada",
            "Etanol",
            "Diesel"
        ];


        const listaPostos = [
            ...new Set(
                coletas.map(
                    coleta => coleta.posto
                )
            )
        ];


        // ==========================================
        // RESUMO
        // ==========================================

        const datas = coletas.map(
            coleta => coleta.data
        );


        const dataMaisRecente =
            [...datas]
                .sort()
                .reverse()[0];


        const coletasRecentes =
            coletas.filter(
                coleta =>
                    coleta.data === dataMaisRecente
            );


        const resumoGrid =
            document.getElementById(
                "resumo-grid"
            );


        combustiveis.forEach(combustivel => {

            const registros =
                coletasRecentes.filter(
                    coleta =>
                        coleta.combustivel === combustivel
                );


            const soma =
                registros.reduce(
                    (total, coleta) =>
                        total + coleta.valor,
                    0
                );


            const media =
                registros.length
                    ? soma / registros.length
                    : 0;


            resumoGrid.innerHTML += `
                <div class="resumo-card">

                    <h3 class="fuel-name">
                        ${combustivel}
                    </h3>

                    <p class="fuel-price">
                        ${formatarPreco(media)}
                    </p>

                </div>
            `;
        });


        // ==========================================
        // CONSULTA I
        // MENOR E MAIOR PREÇO
        // ==========================================

        const seletorMinMax =
            document.getElementById(
                "combustivel-minmax"
            );


        const tabelaMinMax =
            document.getElementById(
                "tabela-minmax"
            );


        function mostrarMenorMaior(
            combustivelSelecionado
        ) {

            const registros =
                coletas.filter(
                    coleta =>
                        coleta.combustivel ===
                        combustivelSelecionado
                );


            const menorValor =
                Math.min(
                    ...registros.map(
                        registro => registro.valor
                    )
                );


            const maiorValor =
                Math.max(
                    ...registros.map(
                        registro => registro.valor
                    )
                );


            function obterExtremos(valor) {

                const registrosExtremos =
                    registros.filter(
                        registro =>
                            registro.valor === valor
                    );


                const porPosto = {};


                registrosExtremos.forEach(
                    registro => {

                        const atual =
                            porPosto[registro.posto];


                        if (
                            !atual ||
                            registro.data > atual.data
                        ) {
                            porPosto[registro.posto] =
                                registro;
                        }
                    }
                );


                return Object.values(porPosto);
            }


            const menores =
                obterExtremos(menorValor);


            const maiores =
                obterExtremos(maiorValor);


            tabelaMinMax.innerHTML = "";


            menores.forEach(registro => {

                tabelaMinMax.innerHTML += `
                    <tr>

                        <td
                            class="menor-preco"
                            data-label="Classificação"
                        >
                            ↓ Menor preço
                        </td>

                        <td data-label="Posto">
                            ${registro.posto}
                        </td>

                        <td data-label="Endereço">
                            ${formatarEndereco(registro)}
                        </td>

                        <td data-label="Bairro">
                            ${registro.bairro}
                        </td>

                        <td data-label="Combustível">
                            ${registro.combustivel}
                        </td>

                        <td data-label="Preço">
                            ${formatarPreco(registro.valor)}
                        </td>

                        <td data-label="Data">
                            ${formatarData(registro.data)}
                        </td>

                    </tr>
                `;
            });


            maiores.forEach(registro => {

                tabelaMinMax.innerHTML += `
                    <tr>

                        <td
                            class="maior-preco"
                            data-label="Classificação"
                        >
                            ↑ Maior preço
                        </td>

                        <td data-label="Posto">
                            ${registro.posto}
                        </td>

                        <td data-label="Endereço">
                            ${formatarEndereco(registro)}
                        </td>

                        <td data-label="Bairro">
                            ${registro.bairro}
                        </td>

                        <td data-label="Combustível">
                            ${registro.combustivel}
                        </td>

                        <td data-label="Preço">
                            ${formatarPreco(registro.valor)}
                        </td>

                        <td data-label="Data">
                            ${formatarData(registro.data)}
                        </td>

                    </tr>
                `;
            });
        }


        mostrarMenorMaior(
            seletorMinMax.value
        );


        seletorMinMax.addEventListener(
            "change",
            function () {
                mostrarMenorMaior(
                    this.value
                );
            }
        );


        // ==========================================
        // CONSULTA II
        // PREÇO MÉDIO POR POSTO
        // ==========================================

        const seletorMedia =
            document.getElementById(
                "combustivel-media"
            );


        const tabelaMedia =
            document.getElementById(
                "tabela-media"
            );


        function mostrarMediaPorPosto(
            combustivelSelecionado
        ) {

            const registros =
                coletas.filter(
                    coleta =>
                        coleta.combustivel ===
                        combustivelSelecionado
                );


            const postos = [
                ...new Set(
                    registros.map(
                        registro =>
                            registro.posto
                    )
                )
            ];


            tabelaMedia.innerHTML = "";


            postos.forEach(posto => {

                const coletasPosto =
                    registros.filter(
                        registro =>
                            registro.posto === posto
                    );


                const soma =
                    coletasPosto.reduce(
                        (total, registro) =>
                            total + registro.valor,
                        0
                    );


                const media =
                    soma / coletasPosto.length;


                const bairro =
                    coletasPosto[0].bairro;


                tabelaMedia.innerHTML += `
                    <tr>

                        <td data-label="Posto">
                            ${posto}
                        </td>

                        <td data-label="Bairro">
                            ${bairro}
                        </td>

                        <td data-label="Combustível">
                            ${combustivelSelecionado}
                        </td>

                        <td data-label="Preço médio">
                            ${formatarPreco(media)}
                        </td>

                        <td data-label="Amostras">
                            ${coletasPosto.length}
                        </td>

                    </tr>
                `;
            });
        }


        mostrarMediaPorPosto(
            seletorMedia.value
        );


        seletorMedia.addEventListener(
            "change",
            function () {
                mostrarMediaPorPosto(
                    this.value
                );
            }
        );


        // ==========================================
        // CONSULTA III
        // PREÇOS MAIS RECENTES
        // ==========================================

        const seletorPostoRecente =
            document.getElementById(
                "posto-recente"
            );


        const tabelaRecentes =
            document.getElementById(
                "tabela-recentes"
            );


        listaPostos.forEach(posto => {

            seletorPostoRecente.innerHTML += `
                <option value="${posto}">
                    ${posto}
                </option>
            `;
        });


        function mostrarPrecosRecentes(
            postoSelecionado
        ) {

            const registros =
                postoSelecionado === "todos"
                    ? coletas
                    : coletas.filter(
                        coleta =>
                            coleta.posto ===
                            postoSelecionado
                    );


            const grupos = {};


            registros.forEach(registro => {

                const chave =
                    `${registro.posto}-${registro.combustivel}`;


                if (
                    !grupos[chave] ||
                    registro.data >
                    grupos[chave].data
                ) {
                    grupos[chave] =
                        registro;
                }
            });


            const precosRecentes =
                Object.values(grupos);


            tabelaRecentes.innerHTML = "";


            precosRecentes.forEach(registro => {

                tabelaRecentes.innerHTML += `
                    <tr>

                        <td data-label="Posto">
                            ${registro.posto}
                        </td>

                        <td data-label="Bairro">
                            ${registro.bairro}
                        </td>

                        <td data-label="Combustível">
                            ${registro.combustivel}
                        </td>

                        <td data-label="Preço">
                            ${formatarPreco(registro.valor)}
                        </td>

                        <td data-label="Data">
                            ${formatarData(registro.data)}
                        </td>

                    </tr>
                `;
            });
        }


        mostrarPrecosRecentes("todos");


        seletorPostoRecente.addEventListener(
            "change",
            function () {
                mostrarPrecosRecentes(
                    this.value
                );
            }
        );


        // ==========================================
        // OPÇÕES DOS GRÁFICOS
        // ==========================================

        function opcoesGrafico() {

            const mobile =
                window.innerWidth <= 600;


            return {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    mode: "index",
                    intersect: false
                },

                layout: {
                    padding: {
                        top: mobile ? 0 : 5,
                        right: mobile ? 2 : 10,
                        bottom: mobile ? 0 : 5,
                        left: mobile ? 0 : 5
                    }
                },

                scales: {

                    x: {
                        grid: {
                            display: !mobile
                        },

                        ticks: {
                            font: {
                                size: mobile ? 9 : 12
                            },

                            // No mobile as datas ficam
                            // horizontais e mais limpas.

                            maxRotation: 0,
                            minRotation: 0,

                            autoSkip: true,

                            maxTicksLimit:
                                mobile
                                    ? 5
                                    : undefined
                        }
                    },

                    y: {
                        grid: {
                            color: "#E6E6E6"
                        },

                        ticks: {
                            font: {
                                size: mobile ? 10 : 12
                            },

                            callback: function (valor) {
                                return "R$ " +
                                    Number(valor)
                                        .toFixed(2)
                                        .replace(".", ",");
                            }
                        }
                    }
                },

                plugins: {

                    legend: {
                        display: true,
                        position: "top",

                        labels: {
                            usePointStyle: true,
                            pointStyle: "rect",

                            boxWidth:
                                mobile ? 9 : 16,

                            boxHeight:
                                mobile ? 9 : 12,

                            padding:
                                mobile ? 8 : 14,

                            font: {
                                size:
                                    mobile ? 9 : 12
                            }
                        }
                    },

                    tooltip: {

                        callbacks: {

                            label: function (context) {

                                const valor =
                                    Number(context.raw)
                                        .toFixed(2)
                                        .replace(".", ",");

                                return `${context.dataset.label}: R$ ${valor}`;
                            }
                        }
                    }
                }
            };
        }


        // ==========================================
        // CONSULTA IV
        // EVOLUÇÃO DOS PREÇOS
        // ==========================================

        const seletorPostoEvolucao =
            document.getElementById(
                "posto-evolucao"
            );


        const seletorCombustivelEvolucao =
            document.getElementById(
                "combustivel-evolucao"
            );


        const tabelaEvolucao =
            document.getElementById(
                "tabela-evolucao"
            );


        listaPostos.forEach(posto => {

            seletorPostoEvolucao.innerHTML += `
                <option value="${posto}">
                    ${posto}
                </option>
            `;
        });


        let graficoEvolucao;


        function mostrarEvolucao() {

            const postoSelecionado =
                seletorPostoEvolucao.value;


            const combustivelSelecionado =
                seletorCombustivelEvolucao.value;


            let registros =
                coletas.filter(
                    coleta =>
                        coleta.posto ===
                        postoSelecionado
                );


            if (
                combustivelSelecionado !==
                "todos"
            ) {
                registros =
                    registros.filter(
                        coleta =>
                            coleta.combustivel ===
                            combustivelSelecionado
                    );
            }


            registros.sort(
                (a, b) =>
                    a.data.localeCompare(
                        b.data
                    )
            );


            // ======================================
            // TABELA
            // ======================================

            tabelaEvolucao.innerHTML = "";


            registros.forEach(registro => {

                tabelaEvolucao.innerHTML += `
                    <tr>

                        <td data-label="Posto">
                            ${registro.posto}
                        </td>

                        <td data-label="Bairro">
                            ${registro.bairro}
                        </td>

                        <td data-label="Combustível">
                            ${registro.combustivel}
                        </td>

                        <td data-label="Preço">
                            ${formatarPreco(registro.valor)}
                        </td>

                        <td data-label="Data">
                            ${formatarData(registro.data)}
                        </td>

                    </tr>
                `;
            });


            if (graficoEvolucao) {
                graficoEvolucao.destroy();
            }


            const canvas =
                document.getElementById(
                    "grafico-evolucao"
                );


            // ======================================
            // TODOS OS COMBUSTÍVEIS
            // ======================================

            if (
                combustivelSelecionado ===
                "todos"
            ) {

                const datasPosto = [
                    ...new Set(
                        registros.map(
                            registro =>
                                registro.data
                        )
                    )
                ].sort();


                const datasets =
                    combustiveis.map(
                        combustivel => {

                            const valores =
                                datasPosto.map(
                                    data => {

                                        const registrosData =
                                            registros.filter(
                                                registro =>
                                                    registro.combustivel ===
                                                    combustivel &&
                                                    registro.data ===
                                                    data
                                            );


                                        if (
                                            !registrosData.length
                                        ) {
                                            return null;
                                        }


                                        const soma =
                                            registrosData.reduce(
                                                (
                                                    total,
                                                    registro
                                                ) =>
                                                    total +
                                                    registro.valor,
                                                0
                                            );


                                        return (
                                            soma /
                                            registrosData.length
                                        );
                                    }
                                );


                            return {

                                label:
                                    combustivel,

                                data:
                                    valores,

                                borderWidth: 2,

                                tension: 0.2,

                                pointRadius:
                                    window.innerWidth <= 600
                                        ? 2
                                        : 3
                            };
                        }
                    );


                graficoEvolucao =
                    new Chart(
                        canvas,
                        {
                            type: "line",

                            data: {

                                labels:
                                    datasPosto.map(
                                        data =>
                                            formatarDataGrafico(
                                                data
                                            )
                                    ),

                                datasets:
                                    datasets
                            },

                            options:
                                opcoesGrafico()
                        }
                    );
            }


            // ======================================
            // UM COMBUSTÍVEL
            // ======================================

            else {

                const datasGrafico =
                    registros.map(
                        registro =>
                            formatarDataGrafico(
                                registro.data
                            )
                    );


                const precosGrafico =
                    registros.map(
                        registro =>
                            registro.valor
                    );


                graficoEvolucao =
                    new Chart(
                        canvas,
                        {
                            type: "line",

                            data: {

                                labels:
                                    datasGrafico,

                                datasets: [{

                                    label:
                                        `${combustivelSelecionado} — ${postoSelecionado}`,

                                    data:
                                        precosGrafico,

                                    borderWidth: 2,

                                    tension: 0.2,

                                    pointRadius:
                                        window.innerWidth <= 600
                                            ? 2
                                            : 3
                                }]
                            },

                            options:
                                opcoesGrafico()
                        }
                    );
            }
        }


        mostrarEvolucao();


        seletorPostoEvolucao.addEventListener(
            "change",
            mostrarEvolucao
        );


        seletorCombustivelEvolucao.addEventListener(
            "change",
            mostrarEvolucao
        );


        // ==========================================
        // GRÁFICO
        // PREÇO MÉDIO GERAL
        // ==========================================

        const datasColeta = [
            ...new Set(
                coletas.map(
                    coleta =>
                        coleta.data
                )
            )
        ].sort();


        const dadosGraficoMedia =
            combustiveis.map(
                combustivel => {

                    const mediasPorData =
                        datasColeta.map(
                            data => {

                                const registros =
                                    coletas.filter(
                                        coleta =>
                                            coleta.combustivel ===
                                            combustivel &&
                                            coleta.data ===
                                            data
                                    );


                                const soma =
                                    registros.reduce(
                                        (
                                            total,
                                            registro
                                        ) =>
                                            total +
                                            registro.valor,
                                        0
                                    );


                                return registros.length
                                    ? soma /
                                      registros.length
                                    : null;
                            }
                        );


                    return {

                        label:
                            combustivel,

                        data:
                            mediasPorData,

                        borderWidth: 2,

                        tension: 0.2,

                        pointRadius:
                            window.innerWidth <= 600
                                ? 2
                                : 3
                    };
                }
            );


        const canvasMediaGeral =
            document.getElementById(
                "grafico-media-geral"
            );


        new Chart(
            canvasMediaGeral,
            {
                type: "line",

                data: {

                    labels:
                        datasColeta.map(
                            data =>
                                formatarDataGrafico(
                                    data
                                )
                        ),

                    datasets:
                        dadosGraficoMedia
                },

                options:
                    opcoesGrafico()
            }
        );

    })


    // ==========================================
    // ERROS
    // ==========================================

    .catch(erro => {

        console.error(
            "Erro ao carregar os dados:",
            erro
        );

    });
