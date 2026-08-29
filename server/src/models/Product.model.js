const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        comparePrice: {
            type: Number,
            min: 0
        },

        costPerItem: {
            type: Number,
            min: 0
        },

        barcode: String,

        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        images: [
            {
                url: {
                    type: String,
                    required: true
                },
                alt: {
                    type: String,
                    default: ""
                },
                isDefault: {
                    type: Boolean,
                    default: false
                }
            }
        ],

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },

        subcategory: String,

        tags: [String],

        attributes: {
            brand: String,
            color: [String],
            size: [String],
            material: String,

            weight: Number,

            dimensions: {
                length: Number,
                width: Number,
                height: Number
            }
        },

        ratings: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5
            },

            count: {
                type: Number,
                default: 0
            }
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isFeatured: {
            type: Boolean,
            default: false
        },

        views: {
            type: Number,
            default: 0
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;