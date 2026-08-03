const fs = require('fs');
const { z } = require('zod');

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

const jsonArrayOfStrings = (fieldName) => z.string().transform((val, ctx) => {
    let parsed;
    try {
        parsed = JSON.parse(val);
    } catch {
        ctx.addIssue({ code: 'custom', message: `${fieldName} must be a JSON array` });
        return z.NEVER;
    }
    if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === 'string')) {
        ctx.addIssue({ code: 'custom', message: `${fieldName} must be a JSON array of strings` });
        return z.NEVER;
    }
    return parsed;
});

const signUpSchema = z.object({
    role: z.enum(['owner', 'tenant']),
    name: z.string().trim().min(1, 'Name is required').max(100),
    email: z.string().trim().email('Must be a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    mobile: z.coerce.number().int('Mobile must be a number'),
});

const loginSchema = z.object({
    email: z.string().trim().email('Must be a valid email address'),
    password: z.string().min(1, 'Password is required'),
    role: z.enum(['owner', 'tenant']),
});

// propertyType/tenantType are intentionally left loose (not required,
// no enum) - see DEV_NOTES.md's coupled propertyType key-typo/enum-
// mismatch bug. Requiring the correctly-spelled key here would 400
// every submission today, since the frontend currently sends it under
// a different (typo'd) key entirely and relies on the schema default.
const addPropertySchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    desc: z.string().trim().min(1, 'Description is required'),
    rent: z.coerce.number().positive('Rent must be a positive number'),
    deposite: z.coerce.number().nonnegative('Deposit must be zero or a positive number'),
    address: z.string().trim().min(1, 'Address is required'),
    landmark: z.string().trim().min(1, 'Landmark is required'),
    propertyType: z.string().optional(),
    tenantType: z.string().optional(),
    roomAmenities: jsonArrayOfStrings('roomAmenities'),
    roomType: jsonArrayOfStrings('roomType'),
    rules: jsonArrayOfStrings('rules'),
});

const addReviewSchema = z.object({
    property_id: z.string().regex(OBJECT_ID_RE, 'Invalid property id'),
    user_id: z.string().regex(OBJECT_ID_RE, 'Invalid user id'),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().min(1, 'Comment is required'),
});

// Mounted as the first middleware on a route. Validates req.body
// against `schema`; on failure, cleans up any files multer already
// wrote to disk for this request (a multipart request's files are
// saved as the stream is parsed, before body validation ever runs -
// they'd otherwise be orphaned on a 400), then responds 400 with
// field-level errors. `redactFields` replaces a field's error detail
// with a generic message instead of zod's specific one - used for
// password so a validation failure response never describes (or
// echoes) what was actually submitted.
function validate(schema, { redactFields = [] } = {}) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (result.success) {
            req.body = result.data;
            return next();
        }

        const cleanup = (req.files || []).map((file) =>
            fs.promises.unlink(file.path).catch(() => {})
        );

        Promise.all(cleanup).finally(() => {
            const fieldErrors = result.error.flatten().fieldErrors;
            redactFields.forEach((field) => {
                if (fieldErrors[field]) {
                    fieldErrors[field] = ['Invalid value.'];
                }
            });
            res.status(400).json({ message: 'Validation failed', errors: fieldErrors });
        });
    };
}

module.exports = {
    validate,
    signUpSchema,
    loginSchema,
    addPropertySchema,
    addReviewSchema,
};
