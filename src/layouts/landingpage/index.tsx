import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Container, Flex, Heading, Image, SimpleGrid, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiCheckCircle, FiDollarSign, FiLock, FiPieChart } from 'react-icons/fi'

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // Asegúrate de tener la dependencia instalada

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ReactElement;
}

const Feature: React.FC<FeatureProps> = ({ title, text, icon }) => {
  return (
    <Stack
      align={'center'}
      textAlign={'center'}
      p={8}
      borderRadius={'lg'}
      backgroundColor={'rgba(255, 255, 255, 0.08)'}
      backdropFilter={'blur(10px)'}
      transition={'all 0.3s'}
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'blue.500'}
        mb={4}>
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize={'xl'} mb={2}>{title}</Text>
      <Text color={'gray.500'}>{text}</Text>
    </Stack>
  )
}

interface PricingProps {
  price: number;
  title: string;
  features: string[];
}

const Pricing: React.FC<PricingProps> = ({ price, title, features }) => {
  return (
    <Box
      maxW={'330px'}
      w={'full'}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'2xl'}
      rounded={'md'}
      overflow={'hidden'}
      transition={'all 0.3s'}
      _hover={{ transform: 'scale(1.05)' }}>
      <Stack
        textAlign={'center'}
        p={6}
        color={useColorModeValue('gray.800', 'white')}
        align={'center'}
        backgroundColor={'rgba(255, 255, 255, 0.08)'}
        backdropFilter={'blur(10px)'}
      >
        <Text
          fontSize={'sm'}
          fontWeight={500}
          bg={'blue.50'}
          p={2}
          px={3}
          color={'blue.500'}
          rounded={'full'}>
          {title}
        </Text>
        <Stack direction={'row'} align={'center'} justify={'center'}>
          <Text fontSize={'3xl'}>$</Text>
          <Text fontSize={'6xl'} fontWeight={800}>
            {price}
          </Text>
          <Text color={'gray.500'}>/mes</Text>
        </Stack>
      </Stack>

      <Box bg={useColorModeValue('gray.50', 'gray.900')} px={6} py={10}>
        {features.map((feature, index) => (
          <Text key={index} textAlign={'center'} fontWeight={600} color={'gray.500'} mb={4}>
            {feature}
          </Text>
        ))}
        <Button
          mt={10}
          w={'full'}
          bg={'blue.400'}
          color={'white'}
          rounded={'xl'}
          boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
          _hover={{
            bg: 'blue.500',
          }}
          _focus={{
            bg: 'blue.500',
          }}>
          Comenzar prueba
        </Button>
      </Box>
    </Box>
  )
}

const ParticlesBackground: React.FC = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => ({
    background: {
      color: {
        value: "#0a192f",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: {
          enable: true,
        }, // Cambia el valor de resize a un objeto
      },
      modes: {
        push: {
          quantity: 2,
        },
        repulse: {
          distance: 100,
          duration: 0.2,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        
        enable: true,
        random: true,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  }), []);

  return init ? (
    <Particles
      id="tsparticles"
      options={options}
    />
  ) : <></>;
}

const EnhancedLandingPage: React.FC = () => {
  return (
    <Box position="relative" minH="100vh" color="white">
      <ParticlesBackground />
      <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={1}>
        {/* Hero Section */}
        <Container maxW={'7xl'}>
          <Stack
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}
            direction={{ base: 'column', md: 'row' }}>
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
                <Text as={'span'} position={'relative'}>
                  Simplifica la Gestión
                </Text>
                <br />
                <Text as={'span'} color={'blue.400'}>
                  de Gastos Comunes
                </Text>
              </Heading>
              <Text color={'gray.300'} fontSize={'xl'}>
                Un sistema elegante y fácil de usar para gestionar propiedades, dueños y gastos comunes. Todo en un solo lugar, diseñado para la eficiencia.
              </Text>
              <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
                <Button
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  colorScheme={'blue'}
                  bg={'blue.400'}
                  _hover={{ bg: 'blue.500' }}>
                  Probar Gratis
                </Button>
                <Button
                  as={RouterLink}
                  to="/auth/sign-in"
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  bg={'whiteAlpha.900'}
                  _hover={{ bg: 'whiteAlpha.500' }}>
                  Iniciar Sesión
                </Button>
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
              w={'full'}>
              <Box
                position={'relative'}
                height={'300px'}
                rounded={'2xl'}
                boxShadow={'2xl'}
                width={'full'}
                overflow={'hidden'}>
                <Image
                  alt={'Hero Image'}
                  fit={'cover'}
                  align={'center'}
                  w={'100%'}
                  h={'100%'}
                  src={
                    'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                  }
                />
              </Box>
            </Flex>
          </Stack>
        </Container>

        {/* Features Section */}
        <Box p={4}>
          <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
            <Heading fontSize={'3xl'}>¿Por qué elegir nuestro software?</Heading>
            <Text color={'gray.300'} fontSize={'xl'}>
              Nuestras características principales están diseñadas para hacer tu vida más fácil y tu gestión más eficiente.
            </Text>
          </Stack>

          <Container maxW={'5xl'} mt={10}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <Feature
                title={'Gestión Simplificada'}
                text={'Organiza y controla todos los gastos de forma clara y sencilla.'}
                icon={<FiPieChart size={'50px'} />}
              />
              <Feature
                title={'Seguridad y Privacidad'}
                text={'Tus datos están protegidos y solo accesibles por ti.'}
                icon={<FiLock size={'50px'} />}
              />
              <Feature
                title={'Transacciones Claras'}
                text={'Sigue y gestiona cada gasto y transacción con facilidad.'}
                icon={<FiDollarSign size={'50px'} />}
              />
              <Feature
                title={'Análisis Inteligente'}
                text={'Obtén informes y análisis para una mejor toma de decisiones.'}
                icon={<FiCheckCircle size={'50px'} />}
              />
            </SimpleGrid>
          </Container>
        </Box>

        {/* Pricing Section */}
        <Box p={4}>
          <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
            <Heading fontSize={'3xl'}>Planes de Precios</Heading>
            <Text color={'gray.300'} fontSize={'xl'}>
              Ofrecemos planes flexibles para satisfacer tus necesidades.
            </Text>
          </Stack>

          <Container maxW={'5xl'} mt={10}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={10}>
              <Pricing
                title={'Básico'}
                price={29}
                features={['Gestión de hasta 5 propiedades', 'Soporte básico', 'Acceso a informes']}
              />
              <Pricing
                title={'Profesional'}
                price={59}
                features={['Gestión de propiedades ilimitadas', 'Soporte prioritario', 'Análisis avanzados']}
              />
              <Pricing
                title={'Empresarial'}
                price={99}
                features={['Características personalizadas', 'Soporte 24/7', 'Consultoría gratuita']}
              />
            </SimpleGrid>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default EnhancedLandingPage;
