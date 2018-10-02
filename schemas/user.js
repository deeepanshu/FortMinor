const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const Schema = mongoose.Schema;
const validator = require("validator");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    contact: String,
    fullName: String,
    linkedin_url: String,
    facebook_url: String,
    google_plus_url: String,
    isAdmin: {type: Boolean, default: false},
    isSupplier: {type: Boolean, default: false},
    isConsumer: Boolean,
    organisationName: String,
    supplier: {
        supplierbasic: {
            type: Schema.Types.Mixed,
            default: {}
        },
        expertise: {
            type: Schema.Types.Mixed,
            default: {}
        },
        location: {
            type: Schema.Types.Mixed,
            default: {}
        },
        capacity: {
            type: Schema.Types.Mixed,
            default: {}
        },
        employments: Array,
        educations: Array,
        projects: Array,
        isCompany: {
            type: Boolean,
            default: true
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ],
    addresses: Array
});

mongoose.model("user", userSchema);