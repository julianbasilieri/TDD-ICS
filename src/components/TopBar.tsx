import { Box, Group, Button, Image, Burger, Drawer, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import classes from './TopBar.module.css';

export function TopBar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(userService.getCurrentUser());

  useEffect(() => {
    const checkUser = () => {
      setCurrentUser(userService.getCurrentUser());
    };

    window.addEventListener('userChange', checkUser);
    return () => window.removeEventListener('userChange', checkUser);
  }, []);

  const handleLogout = () => {
    userService.logout();
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <a href="/" className={classes.link}>
            <Image src="/logo.png" alt="EcoHarmony Park" className={classes.logo} />
          </a>

          <Group visibleFrom="sm">
            {currentUser ? (
              <>
                <Button variant="white" color="green" onClick={() => navigate('/tickets')}>
                  Comprar Entradas
                </Button>
                <Button
                  variant="filled"
                  color="red"
                  onClick={handleLogout}
                  styles={(theme) => ({
                    root: {
                      backgroundColor: theme.colors.red[8],
                      '&:hover': {
                        backgroundColor: theme.colors.red[9],
                      },
                    },
                  })}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="white" color="green" onClick={() => navigate('/login')}>
                  Iniciar Sesión
                </Button>
                <Button variant="outline" color="white" onClick={() => navigate('/registro')}>
                  Registrarse
                </Button>
              </>
            )}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
            color="white"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Menu"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Stack>
          {currentUser ? (
            <>
              <Button variant="light" color="green" onClick={() => { navigate('/tickets'); closeDrawer(); }}>
                Comprar Entradas
              </Button>
              <Button variant="filled" color="red" onClick={() => { handleLogout(); closeDrawer(); }}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button variant="light" color="green" onClick={() => { navigate('/login'); closeDrawer(); }}>
                Iniciar Sesión
              </Button>
              <Button variant="outline" color="green" onClick={() => { navigate('/registro'); closeDrawer(); }}>
                Registrarse
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
}
