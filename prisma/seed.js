require("dotenv").config();
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");


async function main() {
  console.log("Starting seed...");

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Admin email or password is not defined in .env");
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: "ADMIN",
      name: "Admin",
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      name: "Admin",
    },
  });

  console.log("Admin user restored:", admin.email);

  const plans = [
    {
      name: "Básico",
      slug: "basico",
      tagline: "Perfecto para comenzar tu presencia online",
      price: 299,
      popular: false,
      description:
        "Nuestro plan Básico es ideal para pequeños negocios, profesionales independientes o emprendedores que necesitan una presencia online simple pero profesional.",
      detailedDescription:
        "Incluye todo lo esencial para que tu negocio esté en internet con un sitio moderno y funcional.",
      features: [
        "Sitio web de 1-3 páginas",
        "Diseño responsive (mobile-friendly)",
        "Formulario de contacto",
        "Integración redes sociales",
        "Hosting por 1 año incluido",
        "Certificado SSL (HTTPS)",
        "Optimización SEO básica",
        "2 revisiones de diseño",
        "Soporte por 3 meses",
      ],
      whatYouGet: [
        {
          title: "Sitio Web Responsive",
          description: "Tu sitio se verá perfecto en cualquier dispositivo.",
        },
        {
          title: "Hosting Incluido",
          description:
            "Incluimos hosting profesional rápido y seguro por 12 meses.",
        },
        {
          title: "Certificado SSL",
          description: "Tu sitio tendrá el candado de seguridad (HTTPS).",
        },
        {
          title: "Formulario de Contacto",
          description:
            "Recibe mensajes de tus clientes directamente en tu email.",
        },
        {
          title: "Optimización SEO",
          description: "Configuramos tu sitio para que Google lo encuentre.",
        },
      ],
      useCases: [
        "Profesionales independientes",
        "Pequeños negocios locales",
        "Portafolios personales",
        "Sitios informativos simples",
        "Landing pages",
      ],
      management: [
        {
          title: "Panel de Administración",
          description: "Acceso a un panel simple para editar textos básicos.",
        },
        {
          title: "Actualizaciones Menores",
          description: "Soporte para cambios menores durante 3 meses.",
        },
      ],
      considerations: [
        "Hasta 3 páginas incluidas",
        "Imágenes y textos provistos por el cliente",
        "Renovación de hosting: $89/año",
      ],
      recommendations: [
        "Prepara tus textos y fotos antes de iniciar",
        "Ten claro el objetivo principal del sitio",
      ],
      demos: [
        { name: "Estudio Jurídico", url: "#", category: "Servicios" },
        { name: "Peluquería", url: "#", category: "Comercio" },
      ],
    },
    {
      name: "Negocio",
      slug: "negocio",
      tagline: "Para negocios que quieren crecer online",
      price: 599,
      popular: true,
      description:
        "El plan Negocio está diseñado para empresas que necesitan un sitio web completo con capacidad de actualización constante.",
      detailedDescription:
        "Ideal para negocios que quieren compartir noticias, publicar artículos y mantener su contenido actualizado de forma autónoma.",
      features: [
        "Sitio web de 5-8 páginas",
        "Diseño responsive premium",
        "Blog integrado",
        "Sistema de gestión de contenidos (CMS)",
        "Formularios personalizados",
        "Galería de imágenes",
        "Hosting por 1 año incluido",
        "Certificado SSL (HTTPS)",
        "Optimización SEO avanzada",
        "Google Analytics integrado",
        "4 revisiones de diseño",
        "Soporte por 6 meses",
      ],
      whatYouGet: [
        {
          title: "CMS Intuitivo",
          description: "Actualiza tu sitio tú mismo sin tocar código.",
        },
        {
          title: "Blog Profesional",
          description: "Publica artículos y noticias fácilmente.",
        },
        {
          title: "SEO Avanzado",
          description: "Optimización profunda para motores de búsqueda.",
        },
        {
          title: "Analytics",
          description: "Métricas detalladas de tus visitantes.",
        },
      ],
      useCases: [
        "Empresas de servicios",
        "Negocios con actualización frecuente",
        "Portafolios de trabajos",
        "Blogs corporativos",
      ],
      management: [
        { title: "Panel CMS", description: "Editor visual fácil de usar." },
        {
          title: "Soporte Extendido",
          description: "6 meses de soporte prioritario.",
        },
      ],
      considerations: [
        "Requiere capacitación inicial (incluida)",
        "Renovación de hosting: $149/año",
      ],
      recommendations: [
        "Define una estrategia de contenidos",
        "Mantén el blog actualizado",
      ],
      demos: [
        { name: "Consultora Global", url: "#", category: "Empresarial" },
        { name: "Estudio Arquitectura", url: "#", category: "Portfolio" },
      ],
    },
    {
      name: "Profesional",
      slug: "profesional",
      tagline: "Sitios complejos con funcionalidades avanzadas",
      price: 1299,
      popular: false,
      description:
        "El plan Profesional es para negocios serios que necesitan vender online o gestionar interacciones complejas con clientes.",
      detailedDescription:
        "Incluye tienda online completa, procesamiento de pagos, gestión de inventario y todas las herramientas para un negocio digital exitoso.",
      features: [
        "Sitio web ilimitado en páginas",
        "Tienda online (hasta 50 productos)",
        "Pasarela de pagos integrada",
        "Sistema de gestión de inventario",
        "Blog y CMS completo",
        "Área de clientes/membresía",
        "Hosting premium por 1 año",
        "SEO avanzado + Schema markup",
        "Email corporativo (5 cuentas)",
        "Soporte prioritario por 12 meses",
      ],
      whatYouGet: [
        {
          title: "E-commerce Completo",
          description: "Vende tus productos 24/7 de forma segura.",
        },
        {
          title: "Pasarela de Pagos",
          description: "Acepta tarjetas, transferencias y más.",
        },
        {
          title: "Gestión de Pedidos",
          description: "Panel avanzado para controlar tus ventas.",
        },
        {
          title: "Emails Profesionales",
          description: "Cuentas de correo con tu propio dominio.",
        },
      ],
      useCases: [
        "Tiendas online",
        "Sistemas de reservas",
        "Catálogos complejos",
        "Áreas de clientes",
      ],
      management: [
        {
          title: "Control Total",
          description: "Gestiona productos, stock y clientes.",
        },
        {
          title: "Reportes",
          description: "Análisis detallado de ventas e ingresos.",
        },
      ],
      considerations: [
        "Requiere cuenta en pasarela de pagos",
        "Renovación de hosting: $299/año",
      ],
      recommendations: [
        "Usa fotos de alta calidad",
        "Escribe descripciones detalladas",
      ],
      demos: [
        { name: "Tienda Urban Style", url: "#", category: "E-commerce" },
        { name: "Gimnasio FitLife", url: "#", category: "Reservas" },
      ],
    },
    {
      name: "Empresarial",
      slug: "empresarial",
      tagline: "Soluciones a medida para grandes proyectos",
      price: 2999,
      popular: false,
      description:
        "El plan Empresarial es una solución completamente personalizada para organizaciones con necesidades específicas y complejas.",
      detailedDescription:
        "Desarrollamos exactamente lo que necesitas, integrando con tus sistemas existentes y creando funcionalidades únicas para tu negocio.",
      features: [
        "Desarrollo 100% personalizado",
        "Integraciones con sistemas externos",
        "API personalizada",
        "Múltiples roles de usuarios",
        "Automatizaciones",
        "Hosting empresarial",
        "Seguridad avanzada",
        "Soporte 24/7 prioritario",
      ],
      whatYouGet: [
        {
          title: "A Medida",
          description: "Desarrollo desde cero según tus necesidades.",
        },
        { title: "Integraciones", description: "Conexión con ERP, CRM y más." },
        {
          title: "Infraestructura",
          description: "Servidores de alta disponibilidad.",
        },
        {
          title: "Soporte Total",
          description: "Equipo dedicado para tu proyecto.",
        },
      ],
      useCases: [
        "Marketplaces",
        "Plataformas SaaS",
        "Intranets corporativas",
        "Proyectos únicos",
      ],
      management: [
        {
          title: "Dashboard Custom",
          description: "Métricas específicas para tu negocio.",
        },
        {
          title: "Roles y Permisos",
          description: "Gestión avanzada de usuarios.",
        },
      ],
      considerations: [
        "Precio base sujeto a requerimientos",
        "Tiempo de desarrollo: 8-16 semanas",
      ],
      recommendations: [
        "Planifica con antelación las integraciones",
        "Involucra a los responsables de cada área",
      ],
      demos: [
        { name: "Marketplace Regional", url: "#", category: "Marketplace" },
        { name: "Plataforma Educativa", url: "#", category: "E-learning" },
      ],
    },
  ];

  for (const planData of plans) {
    await prisma.plan.upsert({
      where: { slug: planData.slug },
      update: planData,
      create: planData,
    });
  }

  console.log("Plans restored.");

  const exampleProjects = [
    {
      title: "Blog de Cocina Gourmet",
      slug: "blog-cocina-gourmet",
      tagline: "Blog profesional de recetas y técnicas culinarias",
      description: "Blog profesional de recetas y técnicas culinarias",
      detailedDescription:
        "Un blog completo con sistema de gestión de contenidos, categorías de recetas, buscador avanzado y optimización SEO.",
      imageUrl: "/examples/blog-cocina.jpg",
      category: "Blogs",
      url: "#",
      features: [
        "Blog con CMS",
        "Categorías de recetas",
        "Buscador avanzado",
        "Galería de imágenes",
      ],
      technologies: ["Next.js", "TailwindCSS", "Prisma", "PostgreSQL"],
      client: "Chef Carlos Martínez",
      completionDate: "2024-03-15",
      testimonial: {
        text: "Excelente trabajo, el sitio superó mis expectativas.",
        author: "Carlos Martínez",
        role: "Chef",
      },
      gallery: ["/examples/blog-cocina-1.jpg", "/examples/blog-cocina-2.jpg"],
    },
    {
      title: "Tienda Urban Fashion",
      slug: "tienda-urban-fashion",
      tagline: "Ecommerce de ropa y accesorios urbanos",
      description: "Ecommerce de ropa y accesorios urbanos",
      detailedDescription:
        "Tienda online completa con catálogo de productos, carrito de compras, pasarela de pagos y gestión de inventario.",
      imageUrl: "/examples/tienda-ropa.jpg",
      category: "Tiendas",
      url: "#",
      features: [
        "Catálogo de productos",
        "Carrito de compras",
        "Mercado Pago integrado",
        "Gestión de inventario",
      ],
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      client: "Urban Style SA",
      completionDate: "2024-06-20",
      testimonial: {
        text: "La tienda nos ayudó a triplicar nuestras ventas online.",
        author: "Lucía García",
        role: "CEO",
      },
      gallery: ["/examples/tienda-ropa-1.jpg", "/examples/tienda-ropa-2.jpg"],
    },
    {
      title: "FitZone CrossFit",
      slug: "fitzone-crossfit",
      tagline: "Gimnasio con sistema de reservas de clases",
      description: "Gimnasio con sistema de reservas de clases",
      detailedDescription:
        "Sistema de gestión de gimnasio con reservas online, membresías, calendario de clases y panel de administración.",
      imageUrl: "/examples/gym-crossfit.jpg",
      category: "Gimnasios",
      url: "#",
      features: [
        "Reservas online",
        "Gestión de membresías",
        "Calendario de clases",
        "Panel de administración",
      ],
      technologies: ["Angular", "Firebase", "Node.js"],
      client: "FitZone",
      completionDate: "2024-01-10",
      testimonial: {
        text: "Nuestros clientes aman poder reservar sus clases desde el celular.",
        author: "Martín López",
        role: "Dueño",
      },
      gallery: ["/examples/gym-1.jpg", "/examples/gym-2.jpg"],
    },
    {
      title: "Corralón El Constructor",
      slug: "corralon-el-constructor",
      tagline: "Materiales de construcción con catálogo completo",
      description: "Materiales de construcción con catálogo completo",
      detailedDescription:
        "Catálogo digital con más de 5000 productos, sistema de cotizaciones online y gestión de pedidos mayoristas.",
      imageUrl: "/examples/corralon-constructor.jpg",
      category: "Corralones",
      url: "#",
      features: [
        "Catálogo de 5000+ productos",
        "Cotizaciones online",
        "Gestión de pedidos",
        "Sistema B2B",
      ],
      technologies: ["React", "PostgreSQL", "Express"],
      client: "El Constructor SRL",
      completionDate: "2024-09-05",
      testimonial: null,
      gallery: ["/examples/corralon-1.jpg"],
    },
    {
      title: "Panadería Artesanal",
      slug: "panaderia-artesanal",
      tagline: "Panadería local con pedidos online",
      description: "Panadería local con pedidos online",
      detailedDescription:
        "Sitio web con catálogo de productos, sistema de pedidos para retiro y delivery, e integración con WhatsApp.",
      imageUrl: "/examples/comercio-panaderia.jpg",
      category: "Comercios",
      url: "#",
      features: [
        "Catálogo de productos",
        "Pedidos online",
        "Integración WhatsApp",
        "Retiro y delivery",
      ],
      technologies: ["Next.js", "Prisma", "PostgreSQL"],
      client: "Panadería La Artesanal",
      completionDate: "2024-04-22",
      testimonial: {
        text: "Ahora recibimos muchos más pedidos gracias al sitio.",
        author: "Ana Rodríguez",
        role: "Dueña",
      },
      gallery: [],
    },
    {
      title: "Agencia Creativa Studio",
      slug: "agencia-creativa-studio",
      tagline: "Landing page para agencia de publicidad",
      description: "Landing page para agencia de publicidad",
      detailedDescription:
        "Landing page moderna con portfolio de trabajos, formulario de contacto y animaciones premium.",
      imageUrl: "/examples/pub-agencia.jpg",
      category: "Publicitarios",
      url: "#",
      features: [
        "Portfolio interactivo",
        "Formulario de contacto",
        "Animaciones premium",
        "Diseño responsive",
      ],
      technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
      client: "Studio Creativo",
      completionDate: "2024-02-28",
      testimonial: null,
      gallery: [],
    },
  ];

  await prisma.exampleProject.deleteMany({});

  for (const projectData of exampleProjects) {
    await prisma.exampleProject.create({
      data: projectData,
    });
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
