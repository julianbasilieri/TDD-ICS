interface User {
  email: string;
  password: string;
}

export const userService = {
  async initialize() {
    if (!localStorage.getItem('users')) {
      try {
        const response = await fetch('/users.json');
        if (!response.ok) throw new Error('Error al cargar users.json');
        const data = await response.json();
        
        // Inicializar con contraseñas encriptadas para datos iniciales
        const usersWithEncryptedPasswords = await Promise.all(data.users.map(async (user: User) => ({
          ...user,
          password: await encryptPassword(user.password)
        })));
        
        localStorage.setItem('users', JSON.stringify(usersWithEncryptedPasswords));
      } catch (error) {
        console.error('Error al inicializar usuarios:', error);
        localStorage.setItem('users', JSON.stringify([]));
      }
    }
  },

  registerUser: async (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verificar si el usuario ya existe
      if (users.some((user: User) => user.email === email)) {
        return { success: false, error: 'El usuario ya existe' };
      }

      // Encriptar la contraseña antes de almacenarla
      const hashedPassword = await encryptPassword(password);
      
      users.push({ email, password: hashedPassword });
      localStorage.setItem('users', JSON.stringify(users));
      
      return { success: true };
    } catch (error) {
      console.error('Error al registrar:', error);
      return { success: false, error: 'Error al registrar usuario' };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Encriptar la contraseña proporcionada para compararla
      const hashedPassword = await encryptPassword(password);
      
      const user = users.find((u: User) => u.email === email && u.password === hashedPassword);
      
      if (!user) {
        return { success: false, error: 'Credenciales inválidas' };
      } 

      // No almacenar la contraseña (ni siquiera el hash) en el localStorage
      localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
      window.dispatchEvent(new Event('userChange'));
      return { success: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userChange'));
  },

  getUsers: () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
};

/**
 * Encripta una contraseña usando SHA-256
 * @param password Contraseña en texto plano
 * @returns Contraseña encriptada como string hexadecimal
 */
async function encryptPassword(password: string): Promise<string> {
  // Convertir la contraseña a un array de bytes
  const msgBuffer = new TextEncoder().encode(password);
  
  // Crear un hash SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // Convertir el ArrayBuffer a string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
