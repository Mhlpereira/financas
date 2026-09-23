# Meu Caixa

Controle de finanças pessoais e da empresa, num app só.

Responde três perguntas que normalmente ficam espalhadas entre a fatura do
cartão, os boletos e a cabeça:

- **Quanto sobra este mês?** — depois dos fixos e das parcelas.
- **Quanto já está comprometido?** — antes do mês sequer começar.
- **Quanto eu junto até dezembro?** — com os parcelamentos acabando no caminho.

Android e iOS, feito com Expo. Funciona **offline**, sem conta e sem nuvem: os
dados ficam em SQLite no próprio aparelho, protegidos por PIN.

```
┌──────────────────────────────────────┐
│  ● Pessoal ▾                    ⚙︎   │
│                                      │
│  ‹   setembro 2026   ›               │
│  ┌────────────────────────────────┐  │
│  │  Saldo do mês                  │  │
│  │  + R$ 2.340,00                 │  │
│  │  Entradas      Saídas          │  │
│  │  R$ 8.000,00   R$ 5.660,00     │  │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░          │  │
│  └────────────────────────────────┘  │
│  Comprometido  R$ 3.180,00   (40%)   │
│  Livre         R$ 4.820,00           │
│                                      │
│  hoje                                │
│   🛒  Mercado              −179,90   │
│   📺  Netflix        fixo   −55,00   │
│  dia 15                              │
│   🧊  Geladeira      3/10  −320,00   │
│  dia 05                              │
│   💰  Salário          ✓  +8.000,00  │
└──────────────────────────────────────┘
```

---

## Instalar no celular (Android)

O APK pronto fica em `~/Documentos/meu-caixa.apk` (46 MB, arm64).

### Jeito mais fácil: baixar pelo Wi-Fi

Funciona melhor que o cabo porque o download passa pelo gerenciador do Android,
que registra o arquivo direito na pasta Downloads.

**1.** No PC, dentro da pasta onde está o APK, suba um servidor:

```bash
cd ~/Documentos
python3 -m http.server 8765 --bind 0.0.0.0
```

**2.** Descubra o IP do PC na rede:

```bash
ip -4 addr show scope global | grep -oP 'inet \K[\d.]+' | head -1
```

**3.** No celular — **no mesmo Wi-Fi** —, abra o Chrome e digite o endereço com
a porta, por exemplo `192.168.1.30:8765`.

**4.** Toque em **meu-caixa.apk**. O Chrome avisa que esse tipo de arquivo pode
ser perigoso: confirme o download.

**5.** Toque na notificação de download concluído para instalar.

**6.** O Android pede para permitir instalação de fontes desconhecidas.
Autorize **para o Chrome** e a instalação segue.

> Em MIUI / HyperOS (Xiaomi, Redmi, POCO) aparece ainda uma verificação de
> segurança e uma contagem de alguns segundos antes do botão **Instalar**
> liberar. É o padrão da Xiaomi para APK de fora da Play Store — só esperar.

**7.** Encerre o servidor no PC com `Ctrl+C`.

### Pelo cabo USB, com depuração ativada

Mais rápido para reinstalar durante o desenvolvimento, porque o `-r` substitui
a versão instalada **sem apagar seus lançamentos**.

Ative a depuração USB uma vez:

```
Configurações → Sobre o telefone → toque 7× em "Versão MIUI"
Opções do desenvolvedor → Depuração USB
```

Plugue o cabo, aceite o aviso *"Permitir depuração USB?"* na tela do celular, e:

```bash
adb devices          # o aparelho precisa aparecer como "device", não "unauthorized"
adb install -r ~/Documentos/meu-caixa.apk
```

### Pelo cabo USB, sem depuração (MTP)

Copiar o arquivo funciona, mas o **Google Files pode não mostrar o APK** — ele
lista pelo índice de mídia do Android, e arquivo copiado por MTP nem sempre
entra nesse índice.

Se acontecer, não perca tempo procurando no atalho "Downloads": vá em
**Procurar → Armazenamento interno → Download**. Navegando pela pasta de
verdade, em vez do índice, o arquivo aparece.

---

## Testar sem instalar nada

Para só experimentar o app, ou desenvolver, não precisa de build:

```bash
npm install
npm start
```

Instale o **Expo Go** na Play Store / App Store, abra e leia o QR code do
terminal. Celular e PC no mesmo Wi-Fi.

A diferença é que o Expo Go roda o app dentro dele; o APK é o app de verdade,
com ícone próprio na gaveta e funcionando sem o PC ligado.

---

## Gerar o APK do zero

**Precisa ter:** Android SDK (plataforma 36, NDK 27) e um **JDK 21 com
compilador**. Cuidado: pacotes `*-jre` não têm `javac` e o build falha com
*"does not provide the required capabilities: [JAVA_COMPILER]"*.

```bash
# 1. gerar o projeto nativo (só na primeira vez)
npx expo prebuild --platform android

# 2. compilar
cd android
JAVA_HOME=/usr/lib/jvm/jdk-21.0.10-oracle-x64 \
  ./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a

# 3. o APK sai em:
#    android/app/build/outputs/apk/release/app-release.apk
```

O `-PreactNativeArchitectures=arm64-v8a` derruba o APK de **109 MB para 46 MB**.
Sem ele o build inclui bibliotecas nativas para x86 e x86_64, que só servem em
emulador — nenhum celular físico usa. Todo aparelho dos últimos anos é arm64.

A primeira compilação baixa o Gradle e as dependências nativas e leva de 5 a 15
minutos. As seguintes levam menos de um minuto.

### ⚠️ A keystore

O app é assinado com `android/app/meucaixa-release.keystore` (senha e alias em
`android/gradle.properties`).

**Guarde esse arquivo fora do projeto.** Se ele sumir, você não consegue mais
instalar uma atualização por cima: o Android recusa APK assinado com chave
diferente, e a saída seria desinstalar o app — levando junto todos os seus
lançamentos.

O template do Expo assina o release com a chave de *debug*, que é pública e
idêntica em todo projeto React Native. Trocar por uma própria é o que impede
qualquer um de assinar um APK se passando pelo seu app.

Tanto `/android` quanto `*.keystore` estão no `.gitignore`, então nem a chave
nem as senhas vazam se você versionar o projeto.

---

## O que o app faz

**Perfis.** Vem com "Pessoal" e "Empresa". Cada um tem seus lançamentos e seu
saldo; a visão **Todos os perfis** soma os dois, marcando cada linha com a cor
do dono. Serve exatamente para separar o que é seu do que é da empresa sem
perder a visão geral.

**Lançamentos em três formatos:**

| | |
|---|---|
| **Única** | a compra do mercado de hoje |
| **Parcelada** | cadastra "10x de R$ 320" uma vez e ela aparece sozinha nos 10 meses, numerada (3/10), sumindo da projeção quando acaba |
| **Recorrente** | aluguel, Netflix, salário — repete todo mês, com ou sem data de fim |

Um gasto marcado para o dia 31 cai no **último dia** dos meses que não têm dia
31 — 28 de fevereiro, 30 de abril. Nunca escorrega para o mês seguinte, o que
jogaria a despesa na competência errada e bagunçaria o saldo de dois meses.

**Mês.** Saldo, entradas, saídas, quanto já está comprometido com fixos e
parcelas, e quanto sobra livre. Deslize a linha para a direita para marcar como
pago — é o gesto mais usado do app e não podia custar dois toques.

**Futuro.** Projeção de até 36 meses com o saldo de cada um e o **acumulado**.
O acumulado começa do zero, não do seu saldo bancário: o app não sabe quanto
você tem na conta, então ele responde *"quanto eu junto a partir de agora"*.
Mês que fecha no vermelho vem destacado.

**Compromissos.** Os parcelamentos em aberto com barra de progresso, quanto
falta e **em que mês terminam**, mais a lista de gastos fixos e rendas com o
total mensal de cada grupo.

**Trava.** PIN de 6 dígitos, com digital ou Face ID opcional. Bloqueio
progressivo depois de 5 erros. Não há recuperação de PIN esquecido — sem
servidor, sem e-mail. Exporte um backup antes de ativar.

**Backup.** *Ajustes → Dados → Exportar* gera um JSON com tudo e abre o
compartilhamento do sistema. Importar substitui o conteúdo atual. O backup não
contém o PIN.

---

## Desenvolvimento

| Comando | O que faz |
|---|---|
| `npm start` | Sobe o Expo e mostra o QR code |
| `npm test` | Testes do domínio (63, focados na aritmética) |
| `npm run typecheck` | `tsc --noEmit` |

```
app/                 rotas expo-router, só composição
src/domain/          regras puras — sem React, sem SQLite
src/repositories/    única camada que escreve SQL
src/stores/          zustand
src/ui/              componentes sem regra de negócio
```

A regra que sustenta o resto: **`src/domain/` não importa React nem
`expo-sqlite`.** É o que torna a materialização das parcelas e os cálculos de
saldo testáveis sem subir app nem banco — e são exatamente as partes onde um
erro passa despercebido e envenena todos os números da tela.

As convenções de código (sem `any`, sem comentários, dinheiro em centavos)
estão em [CLAUDE.md](CLAUDE.md).

---

## A spec

Este projeto foi feito *spec-driven*: a spec veio antes do código e continua
sendo a fonte da verdade. Mudou o comportamento, atualiza a spec junto.

| | |
|---|---|
| [00 — Visão geral](specs/00-visao-geral.md) | Problema, escopo, decisões e seus porquês |
| [01 — Modelo de dados](specs/01-modelo-de-dados.md) | Tabelas e a razão de cada uma |
| [02 — Regras de negócio](specs/02-regras-de-negocio.md) | Materialização, cálculos, trava |
| [03 — Telas e UX](specs/03-telas-e-ux.md) | Layout, paleta, microinterações |
| [04 — Arquitetura](specs/04-arquitetura.md) | Stack, camadas, testes |
| [05 — Critérios de aceite](specs/05-criterios-de-aceite.md) | 50 itens verificáveis da v1 |

A decisão central está em [01](specs/01-modelo-de-dados.md): separar
**compromisso** de **ocorrência**. Você cadastra "geladeira em 10x" uma vez e o
app materializa 10 linhas mensais. É isso que permite marcar março como pago
sem tocar nos outros meses, corrigir uma parcela que veio com juros, e ver em
que mês exatamente o parcelamento sai do seu caminho.
