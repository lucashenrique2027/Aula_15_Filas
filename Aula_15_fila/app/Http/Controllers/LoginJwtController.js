import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock de usuário admin fixo
const mockUser = {
  id: 1,
  email: 'admin@example.com',
  nome: 'Admin',
  role: { nome: 'admin' },
  senhaHash: await bcrypt.hash('senha123', 10) // já tem o hash da senha123
};

// POST /login
export default async (request, response) => {
  const email = request.body.email;
  const senha = request.body.senha;

  const JWT_SECRET = process.env.JWT_SECRET || 'segredo'; // coloque uma chave aqui pra teste
  const JWT_EXPIRES_IN = '10m';

  try {
    // Aqui não busca no banco, usa o mock
    if (email !== mockUser.email) {
      return response.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Compara a senha com a hash do mock
    const senhaValida = await bcrypt.compare(senha, mockUser.senhaHash);

    if (!senhaValida) {
      return response.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera JWT
    const payload = {
      id: mockUser.id,
      email: mockUser.email,
      nome: mockUser.nome,
      role: mockUser.role.nome
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return response.json({
      token: token,
      expires_in: JWT_EXPIRES_IN
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return response.status(500).json({ error: 'Erro interno no servidor' });
  }
};
