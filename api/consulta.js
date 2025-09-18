// api/consulta.js - API para Vercel
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

  // Só aceitar GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      erro: 'Método não permitido',
      codigo: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const { cpf } = req.query;

    // Token fixo para uso pessoal
    const CLIENT_INFO = { name: 'Uso Pessoal', active: true };

    // Validar CPF
    if (!cpf) {
      return res.status(400).json({
        erro: 'CPF é obrigatório',
        codigo: 'CPF_MISSING'
      });
    }

    if (!validarCPF(cpf)) {
      return res.status(400).json({
        erro: 'CPF inválido',
        codigo: 'CPF_INVALID'
      });
    }

    // Consultar dados na API externa
    const dados = await consultarDados(cpf);

    // Resposta de sucesso
    res.status(200).json({
      sucesso: true,
      cpf: cpf,
      timestamp: new Date().toISOString(),
      dados: dados,
      cliente: CLIENT_INFO.name,
      fonte: 'searchapi.dnnl.live'
    });

  } catch (error) {
    console.error('Erro na consulta:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor',
      codigo: 'INTERNAL_ERROR'
    });
  }
}

// Função para validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Função para consultar dados na API externa
async function consultarDados(cpf) {
  try {
    const apiUrl = `https://searchapi.dnnl.live/consulta?cpf=${cpf}&token_api=1528`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
      },
      timeout: 10000 // 10 segundos
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Retornar os dados recebidos da API externa
    return data;
    
  } catch (error) {
    console.error('Erro ao consultar API externa:', error);
    throw error;
  }
}