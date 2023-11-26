import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        }
    ],
    wishLists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WishList",
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false,
    },
    shippingAddress: {
        firsrName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        province: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        hasShippingAddress: {
            type: Boolean,
            default: false,
        },
        country: {
            type: String,
        },
        phone: {
            type: String,
        },
    }, 
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema)
export default User;