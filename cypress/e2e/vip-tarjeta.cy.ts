describe('Flujo completo de usuario', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    // email: "julian_basilieri@hotmail.com",
    password: 'Password123!',
  };

  it('Completa el flujo completo: registro, login y compra de entradas', () => {
    // 1. Visitar la página principal
    cy.visit('/');

    // 2. Navegar a la página de registro
    cy.get('button').contains('Registrarse').click();

    // 3. Completar el formulario de registro
    cy.url().should('include', '/registro');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    // 4. Verificar que el registro fue exitoso y redirige al login
    cy.url().should('eq', Cypress.config().baseUrl + '/login');
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('button').contains('Comprar Entradas').click();

    // 5. Completar la compra de tickets
    cy.url().should('include', '/tickets');

    // Cantidad de tickets
    cy.get('input[name="ticketCount"]').clear().type('3');

    // Abrir el acordeón de visitantes
    cy.contains('Datos de los visitantes').click();

    // Ingresar edades
    cy.get('input[name="visitorAges.0"]').type('25');
    cy.get('input[name="visitorAges.1"]').type('2');
    cy.get('input[name="visitorAges.2"]').type('13');

    // Seleccionar tipo de ticket
    cy.get('input[value="Regular"]').click();
    cy.get('div[value="vip"]').click()

    // Seleccionar método de pago
    cy.get('input[value="Efectivo en boletería"]').click();
    cy.get('div[value="credit"]').click()

    // Confirmar compra
    cy.contains('button', 'Pagar con Mercado Pago').click();

    // 6. Verificar compra exitosa
    cy.contains('Compra iniciada!').should('be.visible');
    cy.contains('Tu código de compra es:').should('be.visible');
  });
});
