import React from "react";

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-2xl font-semibold text-indigo-600 mt-10 mb-3 border-l-4 border-indigo-600 pl-3">
        {title}
    </h2>
);

const CodeBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto border border-gray-700 shadow-md">
        {children}
    </pre>
);

export default function Documentation() {
    return (
        <div className="p-6 max-w-5xl mx-auto text-gray-800">

            {/* Title */}
            <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-2">
                📘 Budget Tracker API Documentation
            </h1>

            <p className="text-center text-gray-600 mb-8">
                Full-stack budget management application powered by <b>Django + DRF</b>
                &nbsp;and&nbsp; <b>React + Vite + TS + Tailwind + D3 + TailAdmin</b>.
                <br />This guide explains backend APIs & integration steps.
            </p>

            {/* Tech Stack */}
            <SectionTitle title="🛠️ Tech Stack" />
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li><b>Backend:</b> Django, Django REST Framework, JWT Auth</li>
                <li><b>Frontend:</b> React, Vite, TypeScript, TailwindCSS, TailAdmin UI</li>
                <li><b>Charts:</b> D3.js</li>
                <li><b>DB:</b> SQLite (local), PostgreSQL (Render Cloud)</li>
                <li><b>Hosting:</b> Backend 👉 Render, Frontend 👉 Vercel</li>

            </ul>

            {/* Live Links */}
            <SectionTitle title="🌍 Live URLs" />
            <p><b>Backend API:</b></p>
            <CodeBox>
                https://budgettracker-yene.onrender.com/api
            </CodeBox>

            <p className="mt-2"><b>Frontend UI:</b></p>
            <CodeBox>
                https://budget-tracker-ten-olive.vercel.app/
            </CodeBox>


            {/* Auth */}
            <SectionTitle title="🔐 Authentication (JWT)" />
            <p>Login to get access & refresh tokens.</p>
            <span className="font-medium">POST /auth/login/</span>

            <CodeBox>
                {`{
                    "username": "Admin",
                    "password": "Admin123"
                }`}
            </CodeBox>

            <p className="mt-2 font-medium">Success Response</p>
            <CodeBox>
                {`{
                    "access": "ACCESS_TOKEN",
                    "refresh": "REFRESH_TOKEN"
                }`}
            </CodeBox>

            {/* Categories */}
            <SectionTitle title="📂 Category Endpoints" />
            <CodeBox>
                {`GET    /finance/categories/
POST   /finance/categories/
PUT    /finance/categories/{id}/
DELETE /finance/categories/{id}/`}
            </CodeBox>

            {/* Transactions */}
            <SectionTitle title="💰 Transaction Endpoints" />
            <CodeBox>
                {`GET    /finance/transactions/
POST   /finance/transactions/
PUT    /finance/transactions/{id}/
DELETE /finance/transactions/{id}/`}
            </CodeBox>

            {/* Budgets */}
            <SectionTitle title="📊 Budget Endpoints" />
            <CodeBox>
                {`GET    /finance/budgets/
POST   /finance/budgets/
PUT    /finance/budgets/{id}/
DELETE /finance/budgets/{id}/`}
            </CodeBox>

            {/* Summary */}
            <SectionTitle title="📈 Summary" />
            <CodeBox>GET /finance/summary/</CodeBox>

            {/* Filters */}
            <SectionTitle title="🔎 Filters & Search" />
            <CodeBox>
                {`/finance/transactions/?search=food
/finance/transactions/?is_income=false
/finance/transactions/?ordering=-date`}
            </CodeBox>

            {/* ENV Setup */}
            <SectionTitle title="⚙️ Frontend .env Setup" />
            <CodeBox>
                {`VITE_API_BASE_URL=https://budgettracker-yene.onrender.com/api`}
            </CodeBox>

            {/* CORS */}
            <SectionTitle title="🌐 CORS Allowed Origins" />
            <CodeBox>
                {`CORS_ALLOWED_ORIGINS = [
                    "http://localhost:5173",
                    "http://localhost:4173",
                    "https://budget-tracker-ten-olive.vercel.app"
        ]`}
            </CodeBox>

            {/* Postman */}
            <SectionTitle title="📦 Postman Collection" />
            <p>Postman file coming soon — You can test all API routes above.</p>

            {/* Credentials */}
            <SectionTitle title="🧪 Test Login Credentials" />
            <CodeBox>
                {`Username: Admin
                Password: Admin123`}
            </CodeBox>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600 mt-12">
                Built with ❤️ by <span className="font-semibold">Usaib Peer</span> 🚀
            </p>
        </div>
    );
}
