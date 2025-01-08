import connect from "@/lib/db"
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import bcrypt from 'bcrypt';

const ObjectId = require("mongoose").Types.ObjectId;
//get users
export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 })

    }
    catch (error: any) {
        return new NextResponse("Error in fetching users" + error.message, { status: 500 })
    }

}

//create users
export const POST = async (request: Request) => {
    try {
        //parse the request bdy
        const body = await request.json();
        const { password } = body;
        //connect to the database
        await connect();

        //hash the password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({ ...body, password: hashedPassword });
        await newUser.save();

        return new NextResponse(JSON.stringify({ message: "User is created", user: newUser }), { status: 200 })

    }
    catch (error: any) {
        return new NextResponse("Error in creating users" + error.message, { status: 500 })

    }
}

//update users

export const PATCH = async (request: Request) => {
    const body = await request.json();
    try {
        const { userId, newUserName } = body;
        await connect();

        if (!userId || !newUserName) {
            return new NextResponse(
                JSON.stringify({ message: "Id or new user not found" }),
                { status: 400 }
            )
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid User Id" }), {
                status: 400
            }
            )
        }

        const updatedUser = await User.findByIdAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUserName },
            { new: true }
        )

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }), {
                status: 400
            }
            )
        }

        return new NextResponse(
            JSON.stringify({ message: "User updated successfully", user: updatedUser }), { status: 200 }
        )

    }
    catch (error: any) {
        return new NextResponse("Error in updating users" + error.message, { status: 500 })


    }
}

//delete user

export const DELETE = async (request: Request) => {

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "Id  not found in database" }),
                { status: 400 }
            )
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "User id is invalid" }), { status: 400 }
            )
        }
        await connect();
        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)

        )
        if (!deletedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in the database" }), { status: 400 }
            )
        }

        return new NextResponse(
            JSON.stringify({ message: "User deleted successfully", user: deletedUser }), { status: 200 }
        )


    }
    catch (error: any) {
        return new NextResponse("Error in deleting users" + error.message, { status: 500 })

    }
}