import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Container, Grid, 
  Box, IconButton, Stack, Fab 
} from '@mui/material';
import { 
  ShoppingBag, WhatsApp, Login as LoginIcon, 
  LocalShipping, Straighten, Replay 
} from '@mui/icons-material';
import { motion, type Variants } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom';

// --- 1. COMPONENTES MOTION ---
const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionStack = motion.create(Stack);

// --- 2. VARIANTES DE ANIMACIÓN ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.3, delayChildren: 0.2 } 
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
  }
};

const Index: React.FC = () => {
  const navigate = useNavigate();
  const WHATSAPP_NUMBER = "593981514649"; 

  const handleGoToLogin = () => navigate('/login');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Nombres de productos
  const productNames = [
    "Jean Classic Blue", "Denim Slim Fit", "Black Edition", "Vintage Cargo", 
    "Urban Relaxed", "Premium Straight", "Dark Indigo", "Street Style", 
    "Essential Denim", "Legacy Blue"
  ];

  // Generamos los productos con fotos específicas de Jeans
  const products = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: productNames[i],
    price: `${(79.90 + i * 5).toFixed(2)} USD`,
    img: `https://images.unsplash.com/photo-${[
      "1541099649105-f69ad21f3246", 
      "1542272604-787c3835535d", 
      "1582418702059-97ebafb35d09", 
      "1591195853828-11db59a44f6b", 
      "1604176354204-ad2f500c1b1c",
      "1514327605112-b887c0e61c0a",
      "1475178626620-a4d074967452",
      "1565084888279-aca607ecce0c",
      "1624372533038-af5ee7f96bb9",
      "1520006406004-f3ad97063e14"
    ][i]}?auto=format&fit=crop&w=500&q=80`
  }));

  return (
    <Box sx={{ bgcolor: '#fff', color: '#000', overflowX: 'hidden', minHeight: '100vh' }}>
      
      {/* NAVBAR */}
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: 'rgba(255,255,255,0.9)', 
          backdropFilter: 'blur(20px)', 
          color: '#000', 
          boxShadow: 'none', 
          borderBottom: '1px solid #f0f0f0', 
          zIndex: 1200 
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 8 }, py: 1 }}>
          <Typography 
            variant="h4" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{ fontWeight: 900, letterSpacing: '-2px', cursor: 'pointer' }}
          >
            PROMAX
          </Typography>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 5 }}>
            <Button onClick={() => scrollToSection('coleccion')} sx={{ color: '#000', fontSize: '0.7rem', fontWeight: 700 }}>COLECCIÓN</Button>
            <Button onClick={() => scrollToSection('servicios')} sx={{ color: '#000', fontSize: '0.7rem', fontWeight: 700 }}>BENEFICIOS</Button>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button 
              onClick={handleGoToLogin}
              startIcon={<LoginIcon />} 
              sx={{ 
                color: '#000', 
                fontWeight: 800, 
                fontSize: '0.75rem', 
                border: '1.5px solid #000', 
                borderRadius: 0, 
                px: 3,
                '&:hover': { bgcolor: '#000', color: '#fff' }
              }}
            >
              LOGIN
            </Button>
            <IconButton color="inherit"><ShoppingBag /></IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* HERO SECTION */}
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', px: { xs: 3, md: 10 }, pt: 8 }}>
        <MotionBox variants={containerVariants} initial="hidden" animate="visible">
          <MotionTypography variants={itemVariants} variant="overline" sx={{ letterSpacing: 6, fontWeight: 700, color: '#888', display: 'block' }}>
            ESTABLECIDO EN 2026
          </MotionTypography>
          <MotionTypography variants={itemVariants} sx={{ fontSize: { xs: '3.5rem', md: '7.5rem' }, fontWeight: 900, lineHeight: 0.85, mt: 2, mb: 4, letterSpacing: '-5px' }}>
            ESCULPIENDO <br /> EL AZUL.
          </MotionTypography>
          <MotionStack variants={itemVariants}>
            <Button 
              variant="contained" 
              onClick={() => scrollToSection('coleccion')}
              sx={{ bgcolor: '#000', color: '#fff', px: 6, py: 2, borderRadius: 0, fontWeight: 900, '&:hover': { bgcolor: '#333' }, width: 'fit-content' }}
            >
              COMPRAR AHORA
            </Button>
          </MotionStack>
        </MotionBox>
      </Box>

      {/* SERVICIOS / BENEFICIOS */}
      <Box id="servicios" sx={{ py: 15, bgcolor: '#000', color: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, sm: 5 }}>
              <MotionTypography 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                variant="h2" 
                sx={{ fontWeight: 900, mb: 3, letterSpacing: '-2px', lineHeight: 1 }}
              >
                COMPRA CON <br /> CONFIANZA.
              </MotionTypography>
              <Typography sx={{ color: '#666', mb: 4 }}>
                En PROMAX no solo vendemos jeans, garantizamos la mejor experiencia de compra denim.
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 7 }}>
              <Stack spacing={6}>
                {[
                  { icon: <LocalShipping />, title: 'ENVÍOS A TODO EL PAÍS', desc: 'Recibe tus jeans en la puerta de tu casa en 24-48 horas.' },
                  { icon: <Straighten />, title: 'AJUSTE PERFECTO', desc: 'Si no te queda como esperabas, lo ajustamos a tu medida.' },
                  { icon: <Replay />, title: 'CAMBIOS SIN COSTO', desc: '¿Te equivocaste de talla? El primer cambio corre por nuestra cuenta.' }
                ].map((service, index) => (
                  <MotionBox 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    sx={{ display: 'flex', gap: 4 }}
                  >
                    <Box sx={{ color: '#fff', '& svg': { fontSize: 40 } }}>{service.icon}</Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: 2 }}>{service.title}</Typography>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>{service.desc}</Typography>
                    </Box>
                  </MotionBox>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* PRODUCTOS */}
      <Box id="coleccion" sx={{ py: 10, px: { xs: 2, md: 5 } }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 6, textAlign: 'center', letterSpacing: 4 }}>NUEVOS MODELOS</Typography>
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={product.id}>
              <MotionBox 
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                sx={{ 
                  p: 1.5, 
                  border: '1px solid #f2f2f2', 
                  '&:hover': { borderColor: '#000', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' } 
                }}
              >
                <Box sx={{ bgcolor: '#f5f5f5', height: 320, mb: 2, overflow: 'hidden' }}>
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500";
                    }}
                  />
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: '0.7rem' }}>{product.name}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#888', mb: 2 }}>{product.price}</Typography>
                <Button 
                  fullWidth 
                  variant="contained" 
                  sx={{ bgcolor: '#000', borderRadius: 0, fontWeight: 900 }}
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, quiero info de ${product.name}`}
                  target="_blank"
                >
                  INFO WHATSAPP
                </Button>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* WHATSAPP CONTACTANOS */}
      <Fab 
        variant="extended" 
        sx={{ 
          position: 'fixed', 
          bottom: 40, 
          right: 40, 
          bgcolor: '#000', 
          color: '#fff', 
          borderRadius: 0,
          px: 3,
          '&:hover': { bgcolor: '#333' }
        }}
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
      >
        <WhatsApp sx={{ mr: 1 }} /> CONTACTANOS
      </Fab>

      <Box sx={{ py: 4, textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
        <Typography variant="caption" sx={{ color: '#aaa', fontWeight: 700 }}>
          © 2026 PROMAX. TODOS LOS DERECHOS RESERVADOS.
        </Typography>
      </Box>
    </Box>
  );
};

export default Index;