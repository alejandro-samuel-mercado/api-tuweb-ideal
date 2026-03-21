require("dotenv").config();
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

const exampleProjects = require("../ExampleProject.json");

const plans = require("../Plan.json");

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


    // Clear existing data
    await prisma.exampleProject.deleteMany({});
    await prisma.plan.deleteMany({});

    // Seed Plans
    console.log("Seeding plans...");
    for (const planData of plans) {
        try {
            const { id, ...dataWithoutId } = planData;
            // Map legacy 'price' field to setupPrice if it exists, otherwise use setupPrice
            const data = { 
                ...dataWithoutId,
                price: dataWithoutId.setupPrice || dataWithoutId.price || 0
            };
            
            await prisma.plan.create({ data });
        } catch (error) {
            console.error(`Error creating plan: ${planData.name}`);
            console.error(error);
        }
    }

    // Seed Example Projects
    console.log("Seeding example projects...");
    for (const projectData of exampleProjects) {
        try {
            const { id, createdAt, updatedAt, ...dataWithoutIdAndDates } = projectData;

            // Convert space-separated dates to ISO strings if they exist
            const data = { ...dataWithoutIdAndDates };
            if (createdAt) data.createdAt = new Date(createdAt.replace(" ", "T")).toISOString();
            if (updatedAt) data.updatedAt = new Date(updatedAt.replace(" ", "T")).toISOString();

            await prisma.exampleProject.create({
                data,
            });
        } catch (error) {
            console.error(`Error creating project: ${projectData.title}`);
            console.error(error);
        }
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
