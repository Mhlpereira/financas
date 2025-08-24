# Animação Coordenada: Painel + Lançamentos

## 🎬 Funcionalidade Implementada

### **Animação sincronizada do painel de valores e lista de lançamentos**
- ✅ Quando o usuário faz scroll para baixo, tanto o **painel de valores** quanto a **seção de lançamentos** sobem juntos
- ✅ Movimento coordenado de **-50px** para ambos os elementos
- ✅ Aproveitamento otimizado do espaço da tela
- ✅ Experiência visual mais fluida e intuitiva

## 🔧 Como funciona:

### **Trigger da animação:**
- **Scroll para baixo > 30px**: Ativa animação (sobe painel + lançamentos)
- **Scroll para cima**: Desfaz animação (volta posição original)

### **Elementos animados:**
1. **BalancePainel**: Sobe -50px
2. **ExpenseManager (lançamentos)**: Sobe -50px também
3. **NavMonths**: Some (-60px + opacidade 0)

### **Coordenação:**
```typescript
balanceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50], // Aplicado tanto no painel quanto nos lançamentos
})
```

## 🎯 Benefícios:

### **1. Melhor aproveitamento do espaço:**
- **Estado normal**: Visualização completa com nav bar
- **Estado compacto**: Mais espaço para ver lançamentos

### **2. Experiência mais intuitiva:**
- Painel e lançamentos se movem como **uma unidade**
- Transição suave e natural
- Foco no conteúdo principal durante scroll

### **3. Consistência visual:**
- Todos os elementos respondem ao scroll de forma coordenada
- Animação sincronizada evita "quebras" visuais

## 🧪 Estados da interface:

### **Estado 1: Completo (scroll no topo)**
```
[Header fixo]
[Nav Months - visível]
[Painel de Valores - posição normal]
[Lançamentos - posição normal]
```

### **Estado 2: Compacto (scroll ativo)**
```
[Header fixo]
[Nav Months - oculto]
[Painel de Valores - subiu 50px]
[Lançamentos - subiu 50px]
```

## 📱 Resultado visual:

- **Mais cards visíveis** na lista de lançamentos
- **Navegação mais fluida** entre os dados
- **Interface responsiva** ao comportamento do usuário
- **Transições suaves** entre estados

## 🚀 Como testar:

1. Abra o app
2. Faça scroll para baixo na lista de lançamentos
3. Observe que tanto o painel de valores quanto a lista sobem juntos
4. Faça scroll para cima e veja tudo voltando à posição original
5. Note o aproveitamento otimizado do espaço da tela
