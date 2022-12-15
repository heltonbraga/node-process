# node-process
Brincando com cluster, master, workers... em nodejs

# Qual o propósito?
Comparar tempo de processamento de diferentes abordagens para ler um arquivo .csv, aplicar uma lógica e gravar o resultado em um arquivo .txt 

# Como?
Abordagem padrão: Ler o arquivo .csv linha a linha (com n-readlines) processando e gravando em arquivo .txt (com writestream).

Abordagem cluster: Seja N o número de cores da máquina executando, segmenta o processamento em N workers, ficando para o master apenas a mensuaração do tempo total de processamento. Cada worker segue o mesmo fluxo da abordagem padrão, porém processando apenas 1 em cada N linhas.

# Resultados
Os testes foram realizados em uma máquina quad-core com 8gb de ram.
Para um arquivo de entrada de ~15k linhas, a abordagem padrão é ~20% mais rápida que a abordagem cluster, acredito que devido ao overhead de inicialização e sincronia dos workers.

Para um arquivo de entrada de ~60k linhas, temos um empate.

Para um arquivo de entrada de ~150k linhas, a abordagem cluster é ~10% mais rápida que a abordagem padrão.

Observações: Da forma como foi implementada, cada worker do cluster consome aproximadamente tanta memória quanto a abordagem padrão. Assim, para arquivos de entrada maiores se verificou uso de paginação da memória para disco, o que acredito que tenha impossibilitado ganhos maiores que o observado até o teste de 150k de entrada.

# A seguir
- Alterar leitura dos workers para consumir menos memória?
- Uma nova abordagem onde apenas o master leia a entrada e os workers apenas processam e gravam o resultado?
