import type { User, Admin } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user: (User & { admin: Admin | null }) | null;
        }
    }

    interface HttpError {
        message?: string;
        status?: number;
    }
}
