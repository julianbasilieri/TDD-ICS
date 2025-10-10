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
        localStorage.setItem('users', JSON.stringify(data.users));
      } catch (error) {
        console.error('Error al inicializar usuarios:', error);
        localStorage.setItem('users', JSON.stringify([]));
      }
    }
  },

  registerUser: (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verificar si el usuario ya existe
      if (users.some((user: User) => user.email === email)) {
        return { success: false, error: 'El usuario ya existe' };
      }

      users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(users));
      
      return { success: true };
    } catch (error) {
      console.error('Error al registrar:', error);
      return { success: false, error: 'Error al registrar usuario' };
    }
  },

  login: (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, error: 'Credenciales inválidas' };
      } 

      localStorage.setItem('currentUser', JSON.stringify(user));
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
