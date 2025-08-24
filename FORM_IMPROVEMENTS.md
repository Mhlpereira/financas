# Melhorias no Formulário de Transações

## 🔄 Alterações Implementadas

### 1. **Botão padrão alterado para "Saída"**
- ✅ O formulário agora inicia com "Saída" (EXPENSE) selecionado por padrão
- ✅ Após salvar, também reseta para "Saída" 
- **Motivo:** Despesas são mais comuns que receitas no dia a dia

### 2. **Campo de valor melhorado**
- ✅ Aceita valores decimais com vírgula (,) e ponto (.)
- ✅ Permite valores como: `13,00`, `13.00`, `13,5`, `13.50`
- ✅ Valida automaticamente o formato
- ✅ Limita a 2 casas decimais
- ✅ Converte automaticamente vírgula para ponto no processamento

### 3. **Código limpo**
- ✅ Comentários desnecessários removidos seguindo princípios de clean code
- ✅ Código autodocumentado e legível

## 🧪 Exemplos de uso:

### **Valores aceitos:**
- `13` ✅
- `13,00` ✅
- `13.00` ✅
- `13,5` ✅
- `13.50` ✅
- `1300,75` ✅

### **Valores rejeitados:**
- `13,` ❌ (vírgula sem número)
- `13,,00` ❌ (múltiplas vírgulas)
- `13.00.5` ❌ (múltiplos pontos)
- `13,999` ❌ (mais de 2 casas decimais)
- `abc` ❌ (texto)

## 🔧 Validação:
- **Regex atualizada:** `/^[0-9]+([.,][0-9]{0,2})?$/`
- **Mensagem de erro:** "Valor deve ser um número válido (ex: 13,00 ou 13.00)"
- **Placeholder:** "Valor (ex: 13,00)"

## 🚀 Como testar:
1. Abra o formulário de transação
2. Verifique que "Saída" está selecionado por padrão
3. Digite valores com vírgula ou ponto no campo valor
4. Confirme que valores como `13,00` são aceitos
5. Salve e verifique que reseta para "Saída"
