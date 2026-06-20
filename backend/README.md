student-tracking-system-backend/
src/
├── app/                             # 🚀 App bootstrap (Express setup)
│   ├── app.js
│   ├── routes.js                    # load all module routes
│   └── server.js                    # start server
│
├── config/                          # ⚙️ Configurations
│   ├── database.js                  # Sequelize connection
│   ├── env.js
│   ├── logger.js
│   └── constants.js
│
├── database/                        # 🗄️ DB version control
│   ├── migrations/
│   ├── seeders/
│   └── index.js
│
├── shared/                          # ♻️ reusable code (GLOBAL)
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── hash.js
│   │   ├── pagination.js
│   │   ├── response.js
│   │   └── logger.js
│   │
│   ├── constants/
│   └── exceptions/
│
├── modules/                         # 🔥 DOMAIN-BASED (CORE)
│
│   ├── auth/                        # 🔐 Authentication
│   │   ├── controller/
│   │   │   ├── auth.controller.js
│   │   │   └── oauth.controller.js
│   │   │
│   │   ├── service/
│   │   │   └── auth.service.js
│   │   │
│   │   ├── repository/
│   │   │   └── auth.repository.js
│   │   │
│   │   ├── model/
│   │   │   └── auth.model.js
│   │   │
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   │
│   │   ├── validation/
│   │   │   └── auth.validation.js
│   │   │
│   │   └── index.js
│
│   ├── users/                       # 👤 User Management
│   │   ├── controller/
│   │   │   ├── user.controller.js
│   │   │   └── admin-user.controller.js
│   │   │
│   │   ├── service/
│   │   │   └── user.service.js
│   │   │
│   │   ├── repository/
│   │   │   └── user.repository.js
│   │   │
│   │   ├── model/
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   └── user.routes.js
│   │   │
│   │   ├── validation/
│   │   │   └── user.validation.js
│   │   │
│   │   └── index.js
│
│   ├── classes/                     # 📚 Class Management
│   │   ├── controller/
│   │   │   ├── class.controller.js
│   │   │   └── admin-class.controller.js
│   │   │
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── routes/
│   │   └── index.js
│
│   ├── assignments/                 # 📝 Assignments
│   │   ├── controller/
│   │   │   ├── assignment.controller.js
│   │   │   └── admin-assignment.controller.js
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── routes/
│   │   └── index.js
│
│   ├── submissions/                 # 📤 Student submissions
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── routes/
│   │   └── index.js
│
│   ├── grades/                      # 📊 Grading system
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── routes/
│   │   └── index.js
│
│   ├── admin/                       # 🧠 SYSTEM-LEVEL (IMPORTANT)
│   │   ├── controller/
│   │   │   ├── dashboard.controller.js
│   │   │   ├── analytics.controller.js
│   │   │   ├── logs.controller.js
│   │   │   └── system.controller.js   # backup / restore
│   │   │
│   │   ├── service/
│   │   │   ├── dashboard.service.js
│   │   │   ├── analytics.service.js
│   │   │   ├── logs.service.js
│   │   │   └── system.service.js
│   │   │
│   │   ├── routes/
│   │   │   └── admin.routes.js
│   │   │
│   │   └── index.js
│
│   ├── analytics/                   # 📈 Future AI / reports
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── routes/
│   │   └── index.js
│
│   └── dashboard/                   # (optional shared dashboards)
│
├── infrastructure/                  # 🌐 external services
│   ├── email/                       # email service
│   ├── storage/                     # file upload (S3, local)
│   ├── cache/                       # Redis
│   └── queue/                       # background jobs
│
├── docs/                            # 📄 Swagger / API docs
│
├── tests/                           # 🧪 testing
│   ├── unit/
│   └── integration/
│
└── scripts/                         # ⚙️ CLI scripts
    ├── migrate.js
    ├── seed.js
    └── reset.js