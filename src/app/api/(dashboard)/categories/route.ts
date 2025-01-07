import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";

import { NextResponse } from "next/server";
import { Types } from "mongoose";
import next from "next";
import connect from "@/lib/db";
const ObjectId = require("mongoose").Types.ObjectId;


//get Category

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing user id" }), { status: 400 })

        }

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found in database" }), { status: 400 })
        }

        await connect();
        const categories = await Category.find({
            user: new Types.ObjectId(userId)
        })

        return new NextResponse(JSON.stringify(categories), { status: 200 })


    }
    catch (error: any) {
        return new NextResponse("Error fetching  categories" + error.message, { status: 500 });
    }
}

//post categories
export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing userid" }), { status: 400 })
        }

        await connect();

        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found in database" }), { status: 400 })
        }

        const { title } = await request.json();

        const newCategories = new Category({
            title,
            user: new Types.ObjectId(userId),
        })
        await newCategories.save();

        return new NextResponse(JSON.stringify({ message: "Category is created successfully " }), { status: 200 })


    }
    catch (error: any) {
        return new NextResponse("Error in creating categories " + error.message, { status: 500 })
    }
}