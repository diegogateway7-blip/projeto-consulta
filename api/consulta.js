// api/consulta.js - API para Vercel (MODO DE TESTE)
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Token');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas para garantir que um CPF foi enviado
  const { cpf } = req.query;
  if (!cpf) {
    return res.status(400).json({ erro: 'CPF é obrigatório' });
  }

  // Dados de teste (mock) para verificar a conexão frontend-backend
  const mockData = {
      nome: "CONEXÃO BEM-SUCEDIDA",
      situacao: "REGULAR",
      nascimento: "01/01/2000",
      score: 750,
      endereco: { logradouro: 'Rua de Teste, 123' },
      telefones: ['(11) 98765-4321'],
      emails: ['teste@conexao.com'],
      restricoes: false
  };

  // Resposta de sucesso com os dados de teste
  res.status(200).json({
    sucesso: true,
    cpf: cpf,
    timestamp: new Date().toISOString(),
    dados: mockData,
    cliente: "Teste de Sistema",
    fonte: "Mock Interno"
  });
}