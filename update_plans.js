const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const updates = {
    'semilla-digital': {
        management: [
            { title: "Soporte Continuo", description: "Monitoreo 24/7 para asegurar que tu sitio esté siempre en línea, seguro y funcionando rápido." },
            { title: "Cambios a Medida", description: "Actualizamos tus horarios, dirección, números de teléfono o texturas básicas de diseño a tu pedido." }
        ],
        considerations: [
            "Este plan está diseñado como una presentación rápida (One-Page). Si necesitas múltiples páginas (Inicio, Nosotros, Servicios), considera el plan Presencia Digital.",
            "No incluye venta en línea activa con pasarela de pagos."
        ],
        recommendations: [
            "Proporciona imágenes de buena calidad y textos concisos para impactar rápidamente a tus clientes.",
            "Mantén tu botón de WhatsApp siempre vinculado al número principal de atención de tu negocio."
        ]
    },
    'presencia-digital': {
        management: [
            { title: "Gestión Activa de Contenidos", description: "Realizamos modificaciones puntuales en tus textos, actualización de banners promocionales o recambio de imágenes mensualmente." },
            { title: "Optimización y Seguimiento", description: "Mantenemos tu servidor optimizado, realizamos backups de seguridad para que nunca pierdas datos y supervisamos la velocidad de carga." }
        ],
        considerations: [
            "El chatbot inicial requiere que nos proveas las preguntas y respuestas más comunes de tus clientes para preconfigurarlo.",
            "El SEO Básico asegura que tu sitio sea indexado por Google, pero el posicionamiento altamente competitivo requiere tiempo y actualización de contenido frecuente."
        ],
        recommendations: [
            "Utiliza tus redes sociales para dirigir tráfico a esta web donde tienes toda tu información profesionalmente organizada.",
            "Solicita tus actualizaciones mensuales de contenido para promover ofertas especiales y mantener la página fresca."
        ]
    },
    'comercio-local': {
        management: [
            { title: "Soporte de Catálogo", description: "Te ayudamos a actualizar métricas, precios o cargar nuevos productos al catálogo si necesitas asistencia, además de contar con tu panel propio." },
            { title: "Mentoria Funcional y SEO", description: "Seguimiento técnico del funcionamiento del sistema de pedidos y ajustes periódicos para dominar el SEO Local en tu ciudad." }
        ],
        considerations: [
            "El proceso de alta masivo de productos inicial requiere que tengas las fotos y precios estructurados previamente.",
            "Este plan no debita cobros automáticamente dentro de la página, sino que envía el carrito a tu WhatsApp para que cierres la venta de forma personalizada."
        ],
        recommendations: [
            "Crea códigos de descuento e incentiva promociones exclusivas online para acostumbrar a tu clientela a usar el catálogo.",
            "Mantén el stock actualizado frecuentemente usando tu panel de administrador interactivo."
        ]
    },
    'ecommerce-pro': {
        management: [
            { title: "Administración Técnica Avanzada", description: "Tienes el control total de las ventas. Nosotros nos encargamos de que la pasarela de pagos, los correos transaccionales y la seguridad funcionen al 100%." },
            { title: "Auditorías de Rendimiento Mensual", description: "Revisión constante de la base de datos, compresión y optimización de velocidad de carga y escaneo automatizado de vulnerabilidades de e-commerce." }
        ],
        considerations: [
            "El cobro por transacciones con tarjeta en plataformas de pago (Mercado Pago, Stripe) conlleva las comisiones estándar propias de dichas empresas.",
            "Es altamente recomendable que un miembro de tu equipo esté designado para despachar la gran cantidad de pedidos en tiempo y forma."
        ],
        recommendations: [
            "Aprovecha el almacenamiento incluido en la nube para subir videos demostrativos y fotos en alta definición para cada variante del producto.",
            "Activa y configura correos de abandono de carrito dentro de la plataforma para recuperar un alto porcentaje de ventas no concretadas."
        ]
    },
    'corporativo-premium': {
        management: [
            { title: "Consultoría IT Permanente", description: "Asignación de un especialista para reuniones mensuales de estrategia digital, mejora de flujos y propuestas de nuevas integraciones de software." },
            { title: "Soporte Inmediato (SLA 99.9%)", description: "Respuesta hiper-prioritaria ante cualquier eventualidad e infraestructura elástica garantizada que soporta picos masivos de usuarios en eventos como CyberMonday." }
        ],
        considerations: [
            "La integración transparente de las sucursales y la migración de datos de tu sistema de gestión anterior requiere un relevamiento técnico exhaustivo en el primer mes.",
            "El desarrollo de funciones o APIs extras a medida post-lanzamiento puede requerir escalado del plan dependiendo de la complejidad y proveedores terceros."
        ],
        recommendations: [
            "Distribuir roles clave entre el equipo por área y sucursal para aprovechar inteligentemente el estricto control de jerarquías y permisos del sistema.",
            "Hacer uso intensivo del panel de métricas gerenciales y reportes automáticos para tomar decisiones de negocio en tiempo real."
        ]
    }
};

async function updatePlans() {
    try {
        for (const [slug, data] of Object.entries(updates)) {
            const query = `
                UPDATE "Plan" 
                SET management = $1, considerations = $2, recommendations = $3
                WHERE slug = $4
            `;
            await pool.query(query, [
                JSON.stringify(data.management), 
                JSON.stringify(data.considerations), 
                JSON.stringify(data.recommendations),
                slug
            ]);
            console.log(`Successfully updated ${slug}`);
        }
    } catch (e) {
        console.error('Error updating plans:', e);
    } finally {
        pool.end();
    }
}

updatePlans();
