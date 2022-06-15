import type { Student, Admin } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user: (Student & { admin: Admin | null }) | null;
        }
    }

    interface HttpError {
        message?: string;
        status?: number;
    }
}
